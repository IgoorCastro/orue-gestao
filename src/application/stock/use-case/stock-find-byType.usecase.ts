import { StockType } from "@/src/domain/enums/stock-type.enum";
import { StockRepository } from "@/src/domain/repositories/stock.repository";
import { FindStockByTypeInputDto, FindStockOutputDto } from "../dto/stock-find.dto";

export class FindStockByIdUseCase {
    constructor(
        private stockRepository: StockRepository,
    ) { }

    async execute(input: FindStockByTypeInputDto): Promise<FindStockOutputDto[]> {
        if (!input.type) throw new Error("type cannot be empty");

        const stocks = await this.stockRepository.findByType(input.type);

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