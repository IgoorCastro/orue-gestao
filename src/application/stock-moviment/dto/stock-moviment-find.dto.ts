import { StockMovimentType } from "@/src/domain/enums/stock-moviment-type.enum";

export type FindStockMovimentByIdInputDto = Readonly<{
    id: string,
}>;

export type FindStockMovimentFilteredDto = Readonly<{
    type?: StockMovimentType,
    quantity?: number,
    fromStockId?: string,
    toStockId?: string,
    productStockId?: string,
    userId?: string,
    page?: number;
    limit?: number;
    price?: {
        gte?: number,
        lte?: number,
    },
    createdAt?: {
        gte?: Date;
        lte?: Date;
    };
    orderBy?: {
        field: "createdAt" | "quantity" | "totalPrice";
        direction: "asc" | "desc";
    };
}>;

export type FindStockMovimentOutputDto = Readonly<{
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
}>;

export type FindStockMovimentListOutputDto = Readonly<{
    data: FindStockMovimentOutputDto[];
    total: number;
    page: number;
    limit: number;
}>