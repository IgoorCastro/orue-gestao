export type FindProductComponentByIdInputDto = Readonly<{
    id: string,
}>;

export type FindProductComponentByParentIdInputDto = Readonly<{
    parentId: string,
}>;

export type FindProductComponentByComponentInputDto = Readonly<{
    componentId: string,
}>;

export type FindProductComponentFilteredDto = Readonly<{
    parentId?: string,
    componentId?: string,
}>

export type FindProductComponentOutputDto = Readonly<{
    id: string,
    parentProductId: string,
    componentProductId: string,
    quantity: number,
    createdAt: Date,
    updatedAt: Date,
    deletedAt?: Date,
}>;