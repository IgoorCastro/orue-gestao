// Find em composição de produtos com filtro

import { FindProductStockFilteredDto, FindProductStockOutputDto } from "../dto/product-stock-find.dto";
import { ProductStockRepository } from "@/src/domain/repositories/product-stock.repository";

export class FindProductStocksUseCase {
    constructor(private productStockRepository: ProductStockRepository) { }

    async execute(filters: FindProductStockFilteredDto): Promise<FindProductStockOutputDto[]> {
        const pcs = await this.productStockRepository.findMany({
            ...filters,
        });
        
        return pcs.map(pc => ({
            id: pc.id,
            productId: pc.productId,
            stockId: pc.stockId,
            quantity: pc.quantity,
            createdAt: pc.createdAt,
            updatedAt: pc.updatedAt,
            deletedAt: pc.deletedAt,
        }))
    }
}