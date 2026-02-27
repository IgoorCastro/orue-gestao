import { StockRepository } from "@/src/domain/repositories/stock.repository";
import { UuidGenerator } from "@/src/domain/services/uuid-generator.services";

export class FindStockById {
    constructor(
        private stockRepository: StockRepository,
        private uuid: UuidGenerator,
    ) { }

    async execute(id: string) {
        if(!id) throw new Error("Id cannot be empty")
        this.uuid.validate(id);

        const findedStock = this.stockRepository.findById(id);
        if(!findedStock) throw new Error("Stock not found");

        return findedStock;
    }
}