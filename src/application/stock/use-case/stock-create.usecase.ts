// cria um novo estoque
// uma loja pode ter mais de um estoque
// estoque principal nao precisa de loja vinculada
// estoque do tipo loja precisa de uma loja vinculada a ele

import { StockRepository } from "@/src/domain/repositories/stock.repository";
import { UuidGenerator } from "@/src/domain/services/uuid-generator.services";
import { CreateStockInputDto, CreateStockOutputDto } from "../dto/stock-create.dto";
import { Stock } from "@/src/domain/entities/stock.entity";
import normalizeName from "@/src/domain/utils/normalize-name";
import { ValidationError } from "@/src/domain/errors/validation.error";
import { StockType } from "@/src/domain/enums/stock-type.enum";
import { ConflictError } from "@/src/domain/errors/conflict.error";

export class CreateStockUseCase {
    constructor(
        private stockRepository: StockRepository,
        private uuid: UuidGenerator,
    ) { }

    async execute(input: CreateStockInputDto): Promise<CreateStockOutputDto> {
        if (!input.name?.trim()) throw new ValidationError("Stock name cannot be empty"); // valida nome
        if (!input.type) throw new ValidationError("Stock type is required"); // valida o tipo

        // estoque tipo STORE precisa ter um storeId vinculado
        if (input.type === StockType.STORE && !input.storeId?.trim()) throw new ValidationError("Stock type 'store' needs a storeId");
        // estoque MAIN nao precisa de uma loja vinculada
        if (input.type === StockType.MAIN && input.storeId) throw new ValidationError("Main stock cannot have a storeId");

        const formattedName = normalizeName(input.name);
        const exists = await this.stockRepository.findByName(formattedName); // procura por estoque com o msm nome
        if (exists) throw new ConflictError("Stock name already exists");

        const stock = Stock.create({
            id: this.uuid.generate(),
            name: formattedName,
            type: input.type,
            storeId: input.storeId,
        });

        await this.stockRepository.create(stock);

        return {
            id: stock.id,
            name: stock.name,
            type: stock.type,
            storeId: stock.storeId,
            createdAt: stock.createdAt,
            updatedAt: stock.updatedAt,
            deletedAt: stock.deletedAt,
        }
    }
}