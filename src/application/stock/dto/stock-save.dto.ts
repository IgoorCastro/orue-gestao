import { StockType } from "@/src/domain/enums/stock-type.enum";

export interface SaveStockInputDto {
    id: string,
    name?: string,
    type?: StockType,
    storeId?: string,
}

export interface SaveStockOutputDto {
    id: string,
    name: string,
    type: StockType,
    storeId?: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt?: Date,
}