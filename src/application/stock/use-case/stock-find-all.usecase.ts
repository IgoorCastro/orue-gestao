import { StockRepository } from "@/src/domain/repositories/stock.repository";
import { FindStockOutputDto } from "../dto/stock-find.dto";

export class FindStockAllUseCase {
    constructor(
        private stockRepository: StockRepository
    ) { }

    async execute(): Promise<FindStockOutputDto[]> {
        const stocks = await this.stockRepository.findAll();

        return stocks.map(st => ({
            id: st.id,
            name: st.name,
            storeId: st.storeId,
            type: st.type,
            createdAt: st.createdAt,
            updatedAt: st.updatedAt,
            deletedAt: st.deletedAt,
        }));
    }
}