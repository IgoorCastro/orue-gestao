import { ProductStockRepository } from "@/src/domain/repositories/product-stock.repository";
import { FindProductStockOutputDto } from "../dto/product-stock-find.dto";

export class FindProductStockAllUseCase {
    constructor(
        private productStockRepository: ProductStockRepository,
    ) { }

    async execute(): Promise<FindProductStockOutputDto[]> {
        const findedProductStock = await this.productStockRepository.findAll();

        return findedProductStock.map(ps => ({
            id: ps.id,
            productId: ps.productId,
            stockId: ps.stockId,
            quantity: ps.quantity,
            createdAt: ps.createdAt,
            updatedAt: ps.updatedAt,
            deletedAt: ps.deletedAt,
        }));
    }
}