// contrato para o repositorio do produto
import { Product } from "../entities/product.entity";
import { ProductFilters } from "../types/product-filters.type";

export interface ProductRepository {
    create(product: Product): Promise<void>;
    findById(id: string): Promise<Product | null>;
    // findByIds(ids: string[]): Promise<Product[]>;
    findByName(name: string): Promise<Product[]>;
    // findByNames(names: string[]): Promise<Product[]>;
    findBySku(sku: string): Promise<Product | null>;
    findByBarcode(barcode: string): Promise<Product | null>;
    findAll(): Promise<Product[]>;
    findWithFilters(filters: ProductFilters): Promise<{ // filtro geral para cor, material, tamanho e modelo 
        data: Product[];
        total: number;
    }>
    existsByBarcode(barcode: string): Promise<boolean>; // verifica se existe um produto por pesquisa me bc no db
    existsById(id: string): Promise<boolean>; // verifica se existe um produto por pesquisa em id no db
    existsByName(name: string): Promise<boolean>; // verifica se existe um produto por name no db
    save(product: Product): Promise<void>;
    updateFields(product: Product): Promise<void> ;
}