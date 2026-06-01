import { StockType } from "@prisma/client";
import { StockMovimentType } from "../enum/stock-moviment-type";
import { Store } from "./store";

export type Stock = {
    id: string;
    name: string;

    type: StockType; // ou enum depois
    storeId?: string,
    store?: Store,

    createdAt: string; // importante!
    updatedAt: string;
    deletedAt?: string,
};

export type CreateStockDto = {
    name: string;
    type: string,
    storeId: string,

    createdAt?: string; // importante!
    updatedAt?: string;
    deletedAt?: string;
};