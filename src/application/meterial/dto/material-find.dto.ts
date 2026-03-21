
export type FindMaterialByIdInputDto = Readonly<{
    id: string,
}>;

export type FindMaterialByNameInputDto = Readonly<{
    name: string,
}>;

export type FindMaterialOutputDto = Readonly<{
    id: string,
    name: string,
}>;