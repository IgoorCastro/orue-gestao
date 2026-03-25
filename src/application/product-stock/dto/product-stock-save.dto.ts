export type UpdateProductStockInputDto = Readonly<{
    id: string,
    stockId?: string,
    productId?: string,
    quantity?: number,
}>;

export type UpdateProductStockOutputDto = {
    id: string,
    stockId: string,
    productId: string,
    quantity: number,
    createdAt: Date,
    updatedAt: Date,
    deletedAt?: Date,
}