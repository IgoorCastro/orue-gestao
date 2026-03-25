import { StockType } from "@/src/domain/enums/stock-type.enum";

export interface CreateStockInputDto {
    name: string,
    type: StockType,
    storeId?: string,
}

export interface CreateStockOutputDto {
    id: string,
    name: string,
    type: StockType,
    storeId?: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt?: Date,
}