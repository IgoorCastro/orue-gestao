export interface CreateProductInputDto {
    name: string,
    price: number,
    colorId: string,
    sizeId: string,
    materialId: string,
    modelId: string,
    mlProductId?: string,
    barcode?: string,
}

export interface CreateProductOutputDto {
    id: string,
    sku: string,
    name: string,
    price: number,
    colorId: string,
    sizeId: string,
    materialId: string,
    modelId: string,
    mlProductId?: string,
    barcode?: string,
}