// Find de movimentação de estoque com filtro
// Filtros permitidos: type, min/ maxPrice, quantity, productStockId, fromStockId, toStockId, userId

import { StockMovimentRepository } from "@/src/domain/repositories/stock-moviment.repository";
import { FindStockMovimentFilteredDto, FindStockMovimentListOutputDto, FindStockMovimentOutputDto } from "../dto/stock-moviment-find.dto";
import { StockMoviment } from "@/src/domain/entities/stock-moviment.entity";

export class FindStockMovimentsUseCase {
    constructor(private smRepository: StockMovimentRepository) { }

    async execute(filters: FindStockMovimentFilteredDto): Promise<FindStockMovimentListOutputDto> {
        const page = filters.page && filters.page > 0 ? filters.page : 1;
        const limit = filters.limit && filters.limit > 0 ? filters.limit : 10;

        const { data, total } = await this.smRepository.findWithFilters({
            ...filters,
            page,
            limit,
        });

        return {
            data: data.map(sm => this.toOutput(sm)),
            total,
            page,
            limit,
        }
    }

    // map para saida
    private toOutput(sm: StockMoviment): FindStockMovimentOutputDto {
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