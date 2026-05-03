import { StockMovimentType } from "../enums/stock-moviment-type.enum";

export type StockMovimentFilters = Readonly<{
    type?: StockMovimentType,
    quantity?: number,

    productStockId?: string,
    userId?: string,
    fromStockId?: string,
    toStockId?: string,

    page?: number;
    limit?: number;

    price?: {
        gte?: number,
        lte?: number,
    },
    orderBy?: {
        field: "quantity";
        direction: "asc" | "desc";
    };
    createdAt?: {
        gte?: Date;
        lte?: Date;
    };
}>;