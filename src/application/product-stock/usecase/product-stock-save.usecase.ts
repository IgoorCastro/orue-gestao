import { ProductStockRepository } from "@/src/domain/repositories/product-stock.repository";
import { ProductRepository } from "@/src/domain/repositories/product.repository";
import { StockRepository } from "@/src/domain/repositories/stock.repository";
import { UpdateProductStockInputDto, UpdateProductStockOutputDto } from "../dto/product-stock-save.dto";
import { ValidationError } from "@/src/domain/errors/validation.error";
import { NotFoundError } from "@/src/domain/errors/not-found.error";
import { ConflictError } from "@/src/domain/errors/conflict.error";

export class UpdateProductStockUseCase {
    constructor(
        private productStockRepository: ProductStockRepository,
        private productRepository: ProductRepository,
        private stockRepository: StockRepository,
    ) { }

    async execute(input: UpdateProductStockInputDto): Promise<UpdateProductStockOutputDto> {
        if (!input.id?.trim()) throw new ValidationError("Id cannot be empty");

        // verifica a existencia do Product Stock
        const ps = await this.productStockRepository.findById(input.id);
        if (!ps) throw new NotFoundError("Product stock not found");

        
        const newProductId = input.productId ?? ps.productId;
        const newStockId = input.stockId ?? ps.stockId;

        const [product, stock] = await Promise.all([
            this.productRepository.findById(newProductId),
            this.stockRepository.findById(newStockId),
        ]);

        if (!product) throw new NotFoundError("Product not found");

        if (!stock) throw new NotFoundError("Stock not found");

        const exists = await this.productStockRepository.exists(
            newProductId,
            newStockId,
            ps.id
        );

        if (exists) throw new ConflictError("Product already registered in this stock");

        if (newProductId !== ps.productId) ps.changeProductId(newProductId);

        if (newStockId !== ps.stockId) ps.changeStockId(newStockId);

        if (input.quantity !== undefined) {
            // valor minimo = 0
            if (input.quantity < 0) throw new ValidationError("Quantity cannot be negative");

            ps.changeQuantity(input.quantity);
        }

        await this.productStockRepository.save(ps);

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