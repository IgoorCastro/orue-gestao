// cria uma nova loja no sistema
// lojas serão associadas a estoques
// estoque principal nao precisa de loja vinculada

import { UuidGeneratorServices } from "@/src/domain/services/uuid-generator.services";
import { CreateStockMoivmentInputDto, CreateStockMoivmentOutputDto } from "../dto/stock-moviment-create.dto";
import normalizeName from "@/src/domain/utils/normalize-name";
import { ValidationError } from "@/src/domain/errors/validation.error";
import { ConflictError } from "@/src/domain/errors/conflict.error";
import { StoreRepository } from "@/src/domain/repositories/store.repository";
import { Store } from "@/src/domain/entities/store.entity";
import { StockRepository } from "@/src/domain/repositories/stock.repository";
import { ProductRepository } from "@/src/domain/repositories/product.repository";
import { UserRepository } from "@/src/domain/repositories/user.repository";
import { StockMovimentRepository } from "@/src/domain/repositories/stock-moviment.repository";
import { NotFoundError } from "@/src/domain/errors/not-found.error";
import { StockMoviment } from "@/src/domain/entities/stock-moviment.entity";
import { StockType } from "@/src/domain/enums/stock-type.enum";
import { ProductStockRepository } from "@/src/domain/repositories/product-stock.repository";
import { ProductStock as ProductStockEntity} from "@/src/domain/entities/product-stock.entity";
import { StockMovimentType } from "@/src/domain/enums/stock-moviment-type.enum";

export class CreateStockMovimentUseCase {
    constructor(
        private readonly stockMovimentRepository: StockMovimentRepository,
        private readonly stockRepository: StockRepository,
        private readonly productStockRepository: ProductStockRepository,
        private readonly userRepository: UserRepository,
        private readonly uuid: UuidGeneratorServices,
    ) { }

    async execute(input: CreateStockMoivmentInputDto): Promise<CreateStockMoivmentOutputDto> {

        
        // VALIDAÇÃO BÁSICA        
        if (!input.type) throw new ValidationError("Type cannot be empty");
        if (!input.quantity) throw new ValidationError("Quantity cannot be empty");
        if (!input.unitPrice) throw new ValidationError("Unit price cannot be empty");
        if (!input.totalPrice) throw new ValidationError("Total price cannot be empty");

        
        // BUSCAR DADOS        
        const [productStock, user] = await Promise.all([
            this.productStockRepository.findById(input.productStockId),
            this.userRepository.findById(input.userId),
        ]);

        if (!productStock) throw new NotFoundError("Product stock not found");
        if (!user) throw new NotFoundError("User not found");

        if (input.fromStockId) {
            const fromStock = await this.stockRepository.findById(input.fromStockId);
            if (!fromStock) throw new NotFoundError("From stock not found");
        }

        if (input.toStockId) {
            const toStock = await this.stockRepository.findById(input.toStockId);
            if (!toStock) throw new NotFoundError("To stock not found");
        }

        // garante consistência entre productStock e fromStock
        if (input.fromStockId && productStock.stockId !== input.fromStockId) {
            throw new ValidationError("Produto não pertence ao estoque informado");
        }

        
        // REGRAS DE NEGÓCIO
        const updates: ProductStockEntity[] = [];

        //INBOUND
        if (input.type === StockMovimentType.INBOUND) {
            if (!input.toStockId) {
                throw new ValidationError("Inbound requires toStockId");
            }

            productStock.changeQuantity(productStock.quantity + input.quantity);

            updates.push(productStock);
        }

        // OUTBOUND
        if (input.type === StockMovimentType.OUTBOUND) {
            if (!input.fromStockId) {
                throw new ValidationError("Outbound requires fromStockId");
            }

            if (productStock.quantity < input.quantity) {
                throw new ValidationError("Estoque insuficiente");
            }

            productStock.changeQuantity(productStock.quantity - input.quantity);

            updates.push(productStock);
        }

        // TRANSFER
        if (input.type === StockMovimentType.TRANSFER) {
            if (!input.fromStockId || !input.toStockId) {
                throw new ValidationError("Transfer requires fromStockId and toStockId");
            }

            if (productStock.quantity < input.quantity) {
                throw new ValidationError("Estoque insuficiente");
            }

            // remove do estoque origem
            productStock.changeQuantity(productStock.quantity - input.quantity);

            // busca produto no estoque destino
            const toPS = await this.productStockRepository.findByProductAndStockId(
                productStock.productId,
                input.toStockId
            );

            if (toPS) {
                // soma no destino
                toPS.changeQuantity(toPS.quantity + input.quantity);
                updates.push(toPS);
            } else {
                // cria novo registro no destino
                const newToPS = ProductStockEntity.create({
                    id: this.uuid.generate(),
                    productId: productStock.productId,
                    stockId: input.toStockId,
                    quantity: input.quantity,
                });

                updates.push(newToPS);
            }

            updates.push(productStock);
        }

        
        // PERSISTIR ESTOQUES
        
        await Promise.all(
            updates.map(ps => this.productStockRepository.save(ps))
        );

        
        // REGISTRAR MOVIMENTAÇÃO
        
        const sm = StockMoviment.create({
            id: this.uuid.generate(),
            type: input.type,
            unitPice: input.unitPrice,
            totalPrice: input.totalPrice,
            quantity: input.quantity,
            fromStockId: input.fromStockId ?? undefined,
            toStockId: input.toStockId ?? undefined,
            productStockId: input.productStockId,
            userId: input.userId,
        });

        await this.stockMovimentRepository.save(sm);

        
        // OUTPUT
        
        return {
            id: sm.id,
            type: sm.type,
            unitPrice: sm.unitPrice,
            totalPrice: sm.totalPrice,
            quantity: sm.quantity,
            productStockId: sm.productStockId,
            fromStockId: sm.fromStockId,
            toStockId: sm.toStockId,
            userId: sm.userId,
            createdAt: sm.createdAt,
            updatedAt: sm.updatedAt,
            deletedAt: sm.deletedAt,
        };
    }
}