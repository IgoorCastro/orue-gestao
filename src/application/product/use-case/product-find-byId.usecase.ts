import { ProductRepository } from "@/src/domain/repositories/product.repository";

type FindProductByIdProps = {
    id: string,
}

export class FindProductByIdUseCase {
    constructor(
        private productRepository: ProductRepository,
    ) { }

    async execute(input: FindProductByIdProps) {
        if(!input) throw new Error("Product id cannot be empty");
        const findedProduct = await this.productRepository.findById(input.id);
        if(!findedProduct) throw new Error("User not found");

        return findedProduct;
    }
}