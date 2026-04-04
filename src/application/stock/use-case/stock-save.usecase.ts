import { StockRepository } from "@/src/domain/repositories/stock.repository";
import { SaveStockInputDto, SaveStockOutputDto } from "../dto/stock-save.dto";
import { ValidationError } from "@/src/domain/errors/validation.error";
import { NotFoundError } from "@/src/domain/errors/not-found.error";
import { StockType } from "@/src/domain/enums/stock-type.enum";
import normalizeName from "@/src/domain/utils/normalize-name";
import { ConflictError } from "@/src/domain/errors/conflict.error";
import { StoreRepository } from "@/src/domain/repositories/store.repository";

export class UpdateStockUseCase {
    constructor(
        private stockRepository: StockRepository,
        private storeRepository: StoreRepository,
    ) { }

    async execute(input: SaveStockInputDto): Promise<SaveStockOutputDto> {
        if(!input.id?.trim()) throw new ValidationError("Id cannot be empty");
        if(input.type === StockType.STORE && !input.storeId) throw new ValidationError("Update type MAIN to STORE needs storeId");

        const stock = await this.stockRepository.findById(input.id);
        if(!stock) throw new NotFoundError("Stock not found");


        // validação de existencia da nova loja
        if(input.storeId !== undefined) {
            const exists = await this.storeRepository.findById(input.storeId);
            if(!exists) throw new NotFoundError("Store not found");

            stock.changeStoreId(input.storeId);
        }

        // Validação para update no nome
        if(input.name !== undefined) {
            const formattedName = normalizeName(input.name); // forma padrão que vai para o db
            const exists = await this.stockRepository.findByName(formattedName);
            if(exists) throw new ConflictError("Stock name already exists");

            stock.rename(input.name);
        };
        // Validação para update de tipo de estoque
         // estoque 'STORE' para 'MAIN'
        if(input.type === StockType.MAIN) stock.setAsMainStock(); 
         // estoque 'MAIN' para 'STORE'
        if(input.type === StockType.STORE && input.storeId) // se alterar o tipo e o storeId n precisa alterar o stoerId novamente
            stock.setAsStoreStock(input.storeId);
        else
            if(input.storeId !== undefined && input.type === undefined) stock.changeStoreId(input.storeId); // Validação para update no storeId

        await this.stockRepository.save(stock);

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