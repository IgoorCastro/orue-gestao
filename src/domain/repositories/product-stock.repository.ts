// contrato do repositorio de produto no estoque
import { ProductStock } from "../entities/product-stock.entity";

// repositorio do Item no estoque
export interface ProductStockRepository {
    findById(id: string): Promise<ProductStock | null>;
    findByProductAndStockId(productId: string, stockId: string): Promise<ProductStock| null>;
    findByProductId(productId: string): Promise<ProductStock[]>;
    findByStockId(stockId: string): Promise<ProductStock[]>;
    findAll(): Promise<ProductStock[]>;
    findMany(filters: { productId?: string; stockId?: string; }): Promise<ProductStock[]>;
    exists(productId: string, stockId: string, ignoreId?: string): Promise<boolean>
    save(item: ProductStock): Promise<void>;
}