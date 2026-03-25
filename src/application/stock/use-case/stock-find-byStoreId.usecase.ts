import { StockRepository } from "@/src/domain/repositories/stock.repository";
import { FindStockByStoreIdInputDto, FindStockOutputDto } from "../dto/stock-find.dto";
import { ValidationError } from "@/src/domain/errors/validation.error";
import { NotFoundError } from "@/src/domain/errors/not-found.error";

export class FindStockByStoreIdUseCase {
    constructor(
        private stockRepository: StockRepository,
    ) { }

    async execute(input: FindStockByStoreIdInputDto): Promise<FindStockOutputDto[]> {
        if (!input.storeId?.trim()) throw new ValidationError("Id cannot be empty");

        const stocks = await this.stockRepository.findByStoreId(input.storeId);
        if (!stocks) throw new NotFoundError("Stock not found");

        return stocks.map(stock => ({
            id: stock.id,
            name: stock.name,
            type: stock.type,
            storeId: stock.storeId,
            createdAt: stock.createdAt,
            updatedAt: stock.updatedAt,
            deletedAt: stock.deletedAt,
        }));
    }
}