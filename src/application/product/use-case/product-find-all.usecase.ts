import { ProductRepository } from "@/src/domain/repositories/product.repository";

export class FindProductAllUseCase {
    constructor(
        private productRepository: ProductRepository,
    ) { }

    async execute() {
        const findedUser = await this.productRepository.findAll();
        if(!findedUser) throw new Error("User not found");

        return findedUser;
    }
}