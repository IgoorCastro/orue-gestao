export type SaveProductInputDto = {
    id: string,
    name: string,
    price: number,
    colorId: string,
    sizeId: string,
    materialId: string,
    modelId: string,
    mlProductId?: string,
    barcode?: string,
}

export type SaveProductOutputDto = {
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