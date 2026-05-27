
export type FindMaterialByIdInputDto = Readonly<{
    id: string,
}>;

export type FindMaterialByNameInputDto = Readonly<{
    name: string,
}>;

export type FindMaterialFilteredDto = Readonly<{
    id?: string,
    name?: string,
    
    onlyDeleted?: boolean,
    withDeleted?: boolean,
}>


export type FindMaterialOutputDto = Readonly<{
    id: string,
    name: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt?: Date,
}>;