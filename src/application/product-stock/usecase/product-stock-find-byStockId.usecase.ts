import { ProductStockRepository } from "@/src/domain/repositories/product-stock.repository";
import { FindProductStockByStockIdInputDto, FindProductStockOutputDto } from "../dto/product-stock-find.dto";
import { ValidationError } from "@/src/domain/errors/validation.error";
import { NotFoundError } from "@/src/domain/errors/not-found.error";

export class FindProductStockByStockIdUseCase {
    constructor(
        private productStockRepository: ProductStockRepository,
    ) { }

    async execute(input: FindProductStockByStockIdInputDto): Promise<FindProductStockOutputDto> {
        if (!input.stockId) throw new ValidationError("Stock id cannot be empty");

        const ps = await this.productStockRepository.findById(input.stockId);
        if (!ps) throw new NotFoundError("Product stock not found");

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