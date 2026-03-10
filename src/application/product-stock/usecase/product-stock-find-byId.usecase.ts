import { ProductStockRepository } from "@/src/domain/repositories/product-stock.repository";

export class FindProductStockById {
    constructor(
        private productStockRepository: ProductStockRepository,
    ) { }

    async execute(id: string) {
        if(!id) throw new Error("Id cannot be empty");

        const findedProductStock = await this.productStockRepository.findById(id);
        if(!findedProductStock) throw new Error("Product stock not found");

        return findedProductStock;
    }
}