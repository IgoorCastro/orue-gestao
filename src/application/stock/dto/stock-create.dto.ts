import { StockType } from "@/src/domain/enums/stock-type.enum";

export interface CreateStockInputDto {
    name: string,
    type: StockType,
    isActive: boolean,
    storeId?: string,
}

export interface CreateStockOutputDto {
    id: string,
    name: string,
    type: StockType,
    isActive: boolean,
    storeId?: string,
}