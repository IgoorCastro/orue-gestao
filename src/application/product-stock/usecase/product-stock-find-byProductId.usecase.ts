import { ProductStockRepository } from "@/src/domain/repositories/product-stock.repository";

export class FindProductStockByProductIdUseCase {
    constructor(
        private productStockRepository: ProductStockRepository,
    ) { }

    async execute(productId: string) {
        if(!productId) throw new Error("Product id cannot be empty");

        const findedProductStock = await this.productStockRepository.findById(productId);
        if(!findedProductStock) throw new Error("Product stock not found");

        return findedProductStock;
    }
}