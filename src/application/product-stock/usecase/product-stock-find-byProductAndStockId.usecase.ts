// retorna um produto de acordo com o productId e stockId
// exemplo = productId : 'k2j31_k12n3'; stockId: 'dmqws_23k1ls'
// resultado = id: 'k2j31_k12n3'; stockId: 'dmqws_23k1ls'; quantity: 35;
import { ProductStockRepository } from "@/src/domain/repositories/product-stock.repository";
import { FindProductStockByProductAndStockIdInputDto, FindProductStockOutputDto } from "../dto/product-stock-find.dto";
import { ValidationError } from "@/src/domain/errors/validation.error";
import { NotFoundError } from "@/src/domain/errors/not-found.error";

export class GetProductStockByProductIdAndStockIdUseCase {
    constructor(
        private productStockRepository: ProductStockRepository,
    ) { }

    async execute(input: FindProductStockByProductAndStockIdInputDto): Promise<FindProductStockOutputDto> {
        if (!input.stockId?.trim()) throw new ValidationError("Stock id cannot be empty");
        if (!input.productId?.trim()) throw new ValidationError("Product id cannot be empty");

        const ps = await this.productStockRepository.findByProductAndStockId(input.stockId, input.productId);
        if (!ps) throw new NotFoundError("Product not found");

        return {
            id: ps.id,
            productId: ps.productId,
            stockId: ps.stockId,
            quantity: ps.quantity,
            createdAt: ps.createdAt,
            updatedAt: ps.updatedAt,
            deletedAt: ps.deletedAt,
        };
    }
}