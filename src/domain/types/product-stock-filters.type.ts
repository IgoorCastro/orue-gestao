// utilizar para receber filtros no repositório
// withDeleted e onlyDeleted utilizado para gerenciar
// o retorno de items deletados

export type ProductStockFilters = Readonly<{
    productId?: string;
    stockId?: string;
    productName?: string;
    
    withDeleted?: boolean,
    onlyDeleted?: boolean,
    
    page?: number;
    limit?: number;
    
    orderBy?: {
        field: "quantity";
        direction: "asc" | "desc";
    };
}>