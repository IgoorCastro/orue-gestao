// usecase para restaurar um usuario 'deleteado

import { RestoreProductByIdInputUseCase } from "../dto/product-restore.dto";
import { ValidationError } from "@/src/domain/errors/validation.error";
import { NotFoundError } from "@/src/domain/errors/not-found.error";
import { ProductRepository } from "@/src/domain/repositories/product.repository";

export class ProductRestoreByIdUseCase {
    constructor(private readonly productRepository: ProductRepository) { }

    async execute({ id }: RestoreProductByIdInputUseCase): Promise<void> {
        if(!id?.trim()) throw new ValidationError("Id cannot be empty");

        console.log("ID: ", id)

        const product = await this.productRepository.findById(id);
        if(!product) throw new NotFoundError("Product not found");

        product.restoreDeleted();

        await this.productRepository.save(product);
    }
}