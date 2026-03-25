import { ProductStockRepository } from "@/src/domain/repositories/product-stock.repository";
import { FindProductStockByIdInputDto, FindProductStockOutputDto } from "../dto/product-stock-find.dto";
import { ValidationError } from "@/src/domain/errors/validation.error";
import { NotFoundError } from "@/src/domain/errors/not-found.error";

export class FindProductStockById {
    constructor(
        private productStockRepository: ProductStockRepository,
    ) { }

    async execute(input: FindProductStockByIdInputDto): Promise<FindProductStockOutputDto> {
        if(!input.id) throw new ValidationError("Id cannot be empty");

        const ps = await this.productStockRepository.findById(input.id);
        if(!ps) throw new NotFoundError("Product stock not found");

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