import { ProductRepository } from "@/src/domain/repositories/product.repository";

export class FindProductAllUseCase {
    constructor(
        private productRepository: ProductRepository,
    ) { }

    async execute() {
        const findedProduct = await this.productRepository.findAll();
        if(!findedProduct) throw new Error("User not found");

        return findedProduct;
    }
}