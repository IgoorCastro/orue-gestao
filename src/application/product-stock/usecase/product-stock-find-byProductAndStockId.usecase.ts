// retorna um produto de acordo com o productId e stockId
// exemplo = productId : 'k2j31_k12n3'; stockId: 'dmqws_23k1ls'
// resultado = id: 'k2j31_k12n3'; stockId: 'dmqws_23k1ls'; quantity: 35;
import { ProductStockRepository } from "@/src/domain/repositories/product-stock.repository";

export class GetProductStockByProductIdAndStockIdUseCase {
    constructor(
        private productStockRepository: ProductStockRepository,        
    ) { }

    async execute(stockId: string, productId: string) {
        if(!stockId) throw new Error("Stock id cannot be empty");
        if(!productId) throw new Error("Product id cannot be empty");

        const findedProduct = this.productStockRepository.findByProductAndStockId(stockId, productId);
        if(!findedProduct) throw new Error("Product not found");

        return findedProduct;
    }
}