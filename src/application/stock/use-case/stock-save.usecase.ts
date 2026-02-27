import { StockRepository } from "@/src/domain/repositories/stock.repository";
import { SaveStockInputDto } from "../dto/stock-save.dto";

export class UpdateStockUseCase {
    constructor(
        private stockRepository: StockRepository,
    ) { }

    async execute({ id, isActive, name, type }: SaveStockInputDto) {
        const stock = await this.stockRepository.findById(id);
        if(!stock) throw new Error("Stock not found");

        if(name) stock.rename(name);
        if(type) stock.changeType(type);
        if(typeof isActive === "boolean"){
            if(isActive) stock.activate();
            else stock.deactivate();
        }

        await this.stockRepository.save(stock);
    }
}