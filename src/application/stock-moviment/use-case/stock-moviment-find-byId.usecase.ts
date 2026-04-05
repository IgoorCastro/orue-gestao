import { StockMovimentRepository } from "@/src/domain/repositories/stock-moviment.repository";
import { FindStockMovimentByIdInputDto, FindStockMovimentOutputDto } from "../dto/stock-moviment-find.dto";

export class FindStockMovimentByIdUseCase {
    constructor(
        private smRepository: StockMovimentRepository,
    ) { }

    async execute({ id }: FindStockMovimentByIdInputDto): Promise<FindStockMovimentOutputDto> {
        if (!id?.trim()) throw new Error("Id cannot be empty");

        // busca e validação por id
        const sm = await this.smRepository.findById(id);
        if (!sm) throw new Error("Stock moviment not found");

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
        }
    }
}