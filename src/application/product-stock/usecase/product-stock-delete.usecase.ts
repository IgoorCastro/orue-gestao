import { ValidationError } from "@/src/domain/errors/validation.error";
import { NotFoundError } from "@/src/domain/errors/not-found.error";
import { DeleteProductStockByIdInputDto } from "../dto/product-stock-delete.dto";
import { ProductStockRepository } from "@/src/domain/repositories/product-stock.repository";

export class DeleteProductStockByIdUseCase {
    constructor(private productStockRepository: ProductStockRepository) { }

    async execute({ id }: DeleteProductStockByIdInputDto): Promise<void> {
        if(!id?.trim()) throw new ValidationError("Id cannot be empty");

        const ps = await this.productStockRepository.findById(id);
        if(!ps) throw new NotFoundError("Product stock not found");

        ps.delete();

        await this.productStockRepository.save(ps);
    }
}