import { ProductStockRepository } from "@/src/domain/repositories/product-stock.repository";
import { FindProductStockByProductIdInputDto, FindProductStockOutputDto } from "../dto/product-stock-find.dto";
import { ValidationError } from "@/src/domain/errors/validation.error";
import { NotFoundError } from "@/src/domain/errors/not-found.error";

export class FindProductStockByProductIdUseCase {
    constructor(
        private productStockRepository: ProductStockRepository,
    ) { }

    async execute(input: FindProductStockByProductIdInputDto): Promise<FindProductStockOutputDto> {
        if (!input.productId?.trim()) throw new ValidationError("Product id cannot be empty");

        const ps = await this.productStockRepository.findById(input.productId);
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