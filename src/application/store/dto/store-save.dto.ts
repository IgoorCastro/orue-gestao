export type SaveStoreInputDto = Readonly<{
    id: string,
    name?: string,
}>

export type SaveStoreOutputDto = Readonly<{
    id: string,
    name?: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt?: Date,
}>