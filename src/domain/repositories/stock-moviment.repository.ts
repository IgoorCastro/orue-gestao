import { StockMoviment } from "../entities/stock-moviment.entity";
import { StockMovimentFilters } from "../types/stock-moviment-filters.type";

export interface StockMovimentRepository {
    findById(id: string): Promise<StockMoviment | null>;
    findMany(): Promise<StockMoviment[]>;
    findWithFilters(filters: StockMovimentFilters): Promise<{ // filtro geral  
        data: StockMoviment[];
        total: number;
    }>
    save(stockMoviment: StockMoviment): Promise<void>;
}