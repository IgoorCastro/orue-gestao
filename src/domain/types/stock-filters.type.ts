import { StockType } from "../enums/stock-type.enum";

export type StockFiltersType = { 
    name?: string;
    type?: StockType;
    storeId?: string;

    onlyDeleted?: boolean;
    withDeleted?: boolean;
}