import { StockMovimentType } from "@/src/domain/enums/stock-moviment-type.enum"

export type CreateStockMoivmentInputDto = Readonly<{
    type: StockMovimentType,
    unitPrice: number,
    totalPrice: number,
    quantity: number,
    fromStockId?: string,
    toStockId?: string,
    productStockId: string,
    userId: string,
}>

export type CreateStockMoivmentOutputDto = Readonly<{
    id: string,
    type: StockMovimentType,
    unitPrice: number,
    totalPrice: number,
    quantity: number,
    fromStockId?: string,
    toStockId?: string,
    productStockId: string,
    userId: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt?: Date,
}>