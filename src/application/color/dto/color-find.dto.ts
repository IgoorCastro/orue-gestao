export type FindColorByNameInputDto = Readonly<{
    name: string,
}>;

export type FindColorByIdInputDto = Readonly<{
    id: string,
}>;

export type FindColorOutpuDto = Readonly<{
    id: string,
    name: string,
}>;