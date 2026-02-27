import { StockType } from "@/src/domain/enums/stock-type.enum";

export interface SaveStockInputDto {
    id: string,
    name?: string,
    type?: StockType,
    isActive?: boolean,
    storeId?: string,
}