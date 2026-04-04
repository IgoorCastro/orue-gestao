export type SaveModelInputDto = {
    id: string,
    name: string,
}

export type SaveModelOutputDto = {
    id: string,
    name: string,
    normalizedName: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt?: Date,
}