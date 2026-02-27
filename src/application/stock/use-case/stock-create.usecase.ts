import { StockRepository } from "@/src/domain/repositories/stock.repository";
import { UuidGenerator } from "@/src/domain/services/uuid-generator.services";
import { CreateStockInputDto, CreateStockOutputDto } from "../dto/stock-create.dto";
import { Stock } from "@/src/domain/entities/stock.entity";

export class CreateStockUseCase {
    constructor(
        private stockRepository: StockRepository,
        private uuid: UuidGenerator,
    ) {}

    async execute(input: CreateStockInputDto): Promise<CreateStockOutputDto> {
        const { name, type, isActive, storeId } = input;
        // apenas 1 estoque por loja
        if(storeId) {
            const existingStock = await this.stockRepository.findByStoreId(storeId);
            if(existingStock) throw new Error("Stock already exists for this store")
        }

        const stock = new Stock(
            this.uuid.generate(),
            name,
            isActive,
            type,
            storeId,
        );

        await this.stockRepository.create(stock);

        return {
            id: stock.id,
            name: stock.name,
            type: stock.type,
            isActive: stock.isActive(),
            storeId: stock.storeId
        }
    }   
}