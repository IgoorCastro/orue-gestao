import { ValidationError } from "@/src/domain/errors/validation.error";
import { NotFoundError } from "@/src/domain/errors/not-found.error";
import { DeleteStockByIdInputDto } from "../dto/stock-delete.dto";
import { StockRepository } from "@/src/domain/repositories/stock.repository";

export class DeleteStockByIdUseCase {
    constructor(private stockRepository: StockRepository) { }

    async execute({ id }: DeleteStockByIdInputDto): Promise<void> {
        if(!id?.trim()) throw new ValidationError("Id cannot be empty");

        const stock = await this.stockRepository.findById(id);
        if(!stock) throw new NotFoundError("Stock not found");

        stock.delete();

        await this.stockRepository.save(stock);
    }
}