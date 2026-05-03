// use case simples para retorno do valor total (R$) em estoque
// stockId na props ativa a busca por um ID especifico

import { ProductStockRepository } from "@/src/domain/repositories/product-stock.repository";

export class GetProductStockValueUseCase {
    constructor(private productStockRepository: ProductStockRepository) { }

    async execute(filters?: { stockId?: string; productId?: string }) {
        const value = await this.productStockRepository.sumStockValue(filters);
        
        return value;
    }
}   