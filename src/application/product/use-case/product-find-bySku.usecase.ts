import { ProductRepository } from "@/src/domain/repositories/product.repository";

type FindProductBySkuProps = {
    sku: string,
}

export class FindProductBySkuUseCase {
    constructor(
        private productRepository: ProductRepository,
    ) { }

    async execute(input: FindProductBySkuProps) {
        if(!input) throw new Error("Product sku cannot be empty");
        const findedProduct = await this.productRepository.findBySku(input.sku);
        if(!findedProduct) throw new Error("User not found");

        return findedProduct;
    }
}