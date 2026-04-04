// relação entre Produto e Estoque
// controla e permite que um produto exista em mais de um estoque
// e em quantidade diferente
import { ProductStockRepository } from "@/src/domain/repositories/product-stock.repository";
import { CreateProductStockInputDto, CreateProductStockOutuputDto } from "../dto/product-stock-create.dto";
import { ProductStock } from "@/src/domain/entities/product-stock.entity";
import { UuidGeneratorServices } from "@/src/domain/services/uuid-generator.services";
import { ValidationError } from "@/src/domain/errors/validation.error";
import { ProductRepository } from "@/src/domain/repositories/product.repository";
import { StockRepository } from "@/src/domain/repositories/stock.repository";
import { NotFoundError } from "@/src/domain/errors/not-found.error";
import { ConflictError } from "@/src/domain/errors/conflict.error";

export class CreateProductStockUseCase {
    constructor(
        private productStockRepository: ProductStockRepository,
        private productRepository: ProductRepository,
        private stockRepository: StockRepository,
        private uuid: UuidGeneratorServices,
    ) { }

    async execute(input: CreateProductStockInputDto): Promise<CreateProductStockOutuputDto> {
        if (input.quantity < 0) throw new ValidationError("Quantity cannot be negative"); // quantidade minima para registro = 0

        // verificar se o estoque e o produto existem
        const [ stock, product ] = await Promise.all([
            this.stockRepository.findById(input.stockId),
            this.productRepository.findById(input.productId),
        ]);
        if(!stock) throw new NotFoundError("Stock not found");
        if(!product) throw new NotFoundError("Product not found");
        
        // valida se ja há um registro igual no Db
        const exists = await this.productStockRepository.findByProductAndStockId(input.stockId, input.productId);
        if(exists) throw new ConflictError("Product is already registered in this stock");

        const productStock = ProductStock.create({
            id: this.uuid.generate(),
            productId: input.productId,
            quantity: input.quantity,
            stockId: input.stockId,
        });

        await this.productStockRepository.save(productStock);

        return {
            id: productStock.id,
            stockId: productStock.stockId,
            productId: productStock.productId,
            quantity: productStock.quantity,
            createdAt: productStock.createdAt,
            updatedAt: productStock.updatedAt,
            deletedAt: productStock.deletedAt,
        }
    }
}