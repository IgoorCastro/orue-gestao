export type FindStoreByIdInputDto = Readonly<{
    id: string,
}>;

export type FindStoreByNameInputDto = Readonly<{
    name: string,
}>;

export type FindStoreFilteredDto = Readonly<{
    name?: string,
    
    onlyDeleted?: boolean,
    withDeleted?: boolean,
}>;

export type FindStoreOutputDto = Readonly<{
    id: string,
    name: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt?: Date,
}>;