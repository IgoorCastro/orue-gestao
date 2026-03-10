import { ProductStockRepository } from "@/src/domain/repositories/product-stock.repository";

export class FindProductStockAllUseCase {
    constructor(
        private productStockRepository: ProductStockRepository,
    ) { }

    async execute() {
        const findedProductStock = await this.productStockRepository.findAll();
        if(!findedProductStock) throw new Error("Product stock not found");

        return findedProductStock;
    }
}