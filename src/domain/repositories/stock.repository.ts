// contrato para o repositorio do estoque
import { Stock } from "../entities/stock.entity";
import { StockType } from "../enums/stock-type.enum";

export interface StockRepository {
    findById(id: string): Promise<Stock | null>;
    findByName(name: string): Promise<Stock[]>;
    findByType(type: StockType): Promise<Stock[]>;
    findByStoreId(storeId: string): Promise<Stock[]>; // uma loja pode estar vinculada a mais de um estoque
    findMany(filters: { name?: string, storeId?: string, type?: StockType }): Promise<Stock[]>;
    findAll(): Promise<Stock[]>;
    save(stock: Stock): Promise<void>;
}