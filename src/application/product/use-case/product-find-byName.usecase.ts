import { ProductRepository } from "@/src/domain/repositories/product.repository";

type FindProductByNameProps = {
    name: string,
}

export class FindProductByNameUseCase {
    constructor(
        private productRepository: ProductRepository,
    ) { }

    async execute(input: FindProductByNameProps) {
        if(!input) throw new Error("Product name cannot be empty");
        const findedProduct = await this.productRepository.findByName(input.name);
        if(!findedProduct) throw new Error("User not found");

        return findedProduct;
    }
}