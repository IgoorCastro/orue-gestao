// usecase para restaurar um usuario 'deleteado

import { ValidationError } from "@/src/domain/errors/validation.error";
import { NotFoundError } from "@/src/domain/errors/not-found.error";
import { RestoreProductStockByIdInputDto } from "../dto/product-stock-restore.dto";
import { ProductStockRepository } from "@/src/domain/repositories/product-stock.repository";

export class RestoreProductStockByIdUseCase {
    constructor(private readonly productStockRepository: ProductStockRepository) { }

    async execute({ id }: RestoreProductStockByIdInputDto): Promise<void> {
        if(!id?.trim()) throw new ValidationError("Id cannot be empty");

        const ps = await this.productStockRepository.findById(id);
        if(!ps) throw new NotFoundError("Product stock not found");

        ps.restoreDeleted();

        await this.productStockRepository.save(ps);
    }
}