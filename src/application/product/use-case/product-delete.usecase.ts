import { ValidationError } from "@/src/domain/errors/validation.error";
import { NotFoundError } from "@/src/domain/errors/not-found.error";
import { ProductRepository } from "@/src/domain/repositories/product.repository";
import { DeleteProductByIdInputDto } from "../dto/product-delete.dto";

export class DeleteProductByIdUseCase {
    constructor(private productRepository: ProductRepository) { }

    async execute(input: DeleteProductByIdInputDto): Promise<void> {
        if(!input.id?.trim()) throw new ValidationError("Id cannot be empty");

        const product = await this.productRepository.findById(input.id);
        if(!product) throw new NotFoundError("Product not found");

        product.delete();

        await this.productRepository.save(product);
    }
}