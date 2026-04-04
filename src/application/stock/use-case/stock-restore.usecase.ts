// usecase para restaurar um usuario 'deleteado

import { ValidationError } from "@/src/domain/errors/validation.error";
import { NotFoundError } from "@/src/domain/errors/not-found.error";
import { StockRepository } from "@/src/domain/repositories/stock.repository";
import { RestoreStockByIdInputDto } from "../dto/stock-restore.dto";

export class RestoreStockByIdUseCase {
    constructor(private readonly stockRepository: StockRepository) { }

    async execute({ id }: RestoreStockByIdInputDto): Promise<void> {
        if(!id?.trim()) throw new ValidationError("Id cannot be empty");

        const stock = await this.stockRepository.findById(id);
        if(!stock) throw new NotFoundError("Stock not found");

        stock.restoreDeleted();

        await this.stockRepository.save(stock);
    }
}