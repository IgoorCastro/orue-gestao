export type FindColorByNameInputDto = Readonly<{
    name: string,
}>;

export type FindColorByIdInputDto = Readonly<{
    id: string,
}>;

export type FindColorOutputDto = Readonly<{
    id: string,
    name: string,
}>;