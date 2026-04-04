export type CreateStoreInputDto = Readonly<{
    name: string,
}>

export type CreateStoreOutputDto = Readonly<{
    id: string,
    name: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt?: Date,
}>