import { ProductRepository } from "@/src/domain/repositories/product.repository";

type FindProductByMaterialProps = {
    material: string,
}

export class FindProductByMaterialUseCase {
    constructor(
        private productRepository: ProductRepository,
    ) { }

    async execute(input: FindProductByMaterialProps) {
        if(!input) throw new Error("Product material cannot be empty");
        const findedProduct = await this.productRepository.findByMaterial(input.material);
        if(!findedProduct) throw new Error("User not found");

        return findedProduct;
    }
}