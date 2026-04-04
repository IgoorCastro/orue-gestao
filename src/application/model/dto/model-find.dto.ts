export type FindModelByIdInputDto = Readonly<{
    id: string,
}>

export type FindModelByNameInputDto = Readonly<{
    name: string,
}>

export type FindModelOutputDto = Readonly<{
    id: string,
    name: string,
    normalizedName: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt?: Date,
}>