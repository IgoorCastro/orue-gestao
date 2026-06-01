import { StockMovimentType } from "../enum/stock-moviment-type";
import { ProductStock } from "./product-stock";
import { Stock } from "./stock";
import { User } from "./user";

export type StockMoviment = {
    id: string;
    type: StockMovimentType; // ou enum depois
    unitPrice: number,
    totalPrice: number,
    quantity: number,

    fromStockId?: string,
    toStockId?: string,
    productStockId: string,
    userId: string,

    fromStock: Stock,
    toStock: Stock,
    productStock: ProductStock,
    user: User,

    createdAt?: string; // importante!
};

export type PaginatedStockMoviment = {
    data: StockMoviment[],    

    page: number,
    limit: number,
    total: number,
}

export type CreateStockMovimentDto = {
    type: string; // ou enum depois
    unitPrice: number,
    totalPrice: number,
    quantity: number,

    fromStockId?: string,
    toStockId?: string,
    productStockId: string,
    userId: string,

    createdAt?: string; // importante!
};