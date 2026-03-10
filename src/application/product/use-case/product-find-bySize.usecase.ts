import { ProductRepository } from "@/src/domain/repositories/product.repository";

type FindProductBySizeProps = {
    size: string,
}

export class FindProductBySizeUseCase {
    constructor(
        private productRepository: ProductRepository,
    ) { }

    async execute(input: FindProductBySizeProps) {
        if(!input) throw new Error("Product size cannot be empty");
        const findedProduct = await this.productRepository.findBySize(input.size);
        if(!findedProduct) throw new Error("User not found");

        return findedProduct;
    }
}