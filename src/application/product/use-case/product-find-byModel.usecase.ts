import { ProductRepository } from "@/src/domain/repositories/product.repository";

type FindProductByModelProps = {
    model: string,
}

export class FindProductByModelUseCase {
    constructor(
        private productRepository: ProductRepository,
    ) { }

    async execute(input: FindProductByModelProps) {
        if(!input) throw new Error("Product model cannot be empty");
        const findedProduct = await this.productRepository.findByModel(input.model);
        if(!findedProduct) throw new Error("User not found");

        return findedProduct;
    }
}