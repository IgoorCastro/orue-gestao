import { StockType } from "@/src/domain/enums/stock-type.enum";
import { StockRepository } from "@/src/domain/repositories/stock.repository";

export class FindStockById {
    constructor(
        private stockRepository: StockRepository,
    ) { }

    async execute(type: StockType) {
        if(!type) throw new Error("type cannot be empty")

        const findedStock = this.stockRepository.findByType(type);
        if(!findedStock) throw new Error("Stock not found");

        return findedStock;
    }
}