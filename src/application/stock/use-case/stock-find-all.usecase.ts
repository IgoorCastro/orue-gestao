import { StockRepository } from "@/src/domain/repositories/stock.repository";

export class FindStockAll {
    constructor(
        private stockRepository: StockRepository
    ) { }

    async execute() {
        const findedStock = this.stockRepository.findAll();
        if(!findedStock) throw new Error("Stock not found");

        return findedStock;
    }
}