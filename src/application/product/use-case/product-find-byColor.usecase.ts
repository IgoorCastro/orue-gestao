import { ProductRepository } from "@/src/domain/repositories/product.repository";

type FindProductByColorProps = {
    color: string,
}

export class FindProductByColorUseCase {
    constructor(
        private productRepository: ProductRepository,
    ) { }

    async execute(input: FindProductByColorProps) {
        if(!input) throw new Error("Color name cannot be empty");
        const findedProduct = await this.productRepository.findByColor(input.color);
        if(!findedProduct) throw new Error("User not found");

        return findedProduct;
    }
}