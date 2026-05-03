// contrato do repositorio de produto no estoque
import { ProductStock } from "../entities/product-stock.entity";
import { ProductStockFilters } from "../types/product-stock-filters.type";
import { StockMovimentFilters } from "../types/stock-moviment-filters.type";

// repositorio do Item no estoque
export interface ProductStockRepository {
    findById(id: string): Promise<ProductStock | null>;
    findByProductAndStockId(productId: string, stockId: string): Promise<ProductStock| null>;
    findByProductId(productId: string): Promise<ProductStock[]>;
    findByStockId(stockId: string): Promise<ProductStock[]>;
    findAll(): Promise<ProductStock[]>;
    findMany(filters: ProductStockFilters): Promise<{
        data: ProductStock[],
        total: number,
    }>;
    exists(productId: string, stockId: string, ignoreId?: string): Promise<boolean>
    sumStockValue(filters?: { stockId?: string; productId?: string }): Promise<number>;
    save(item: ProductStock): Promise<void>;
}