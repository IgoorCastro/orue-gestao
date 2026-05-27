export type ProductStockFiltersDto = {
    productId?: string;
    stockId?: string;
    
    page?: number;
    limit?: number;
    orderBy?: string;

    onlyDeleted?: boolean;
    withDeleted?: boolean;
}