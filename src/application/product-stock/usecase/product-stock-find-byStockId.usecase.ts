import { ProductStockRepository } from "@/src/domain/repositories/product-stock.repository";

export class FindProductStockByStockIdUseCase {
    constructor(
        private productStockRepository: ProductStockRepository,
    ) { }

    async execute(stockId: string) {
        if(!stockId) throw new Error("Stock id cannot be empty");

        const findedProductStock = await this.productStockRepository.findById(stockId);
        if(!findedProductStock) throw new Error("Product stock not found");

        return findedProductStock;
    }
}