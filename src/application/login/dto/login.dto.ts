type User = {
    id: string,
    nickname: string,
    role: string,
}

export type LoginInputDTO = Readonly<{
    nickname: string,
    password: string,
}>;

export type LoginOutputDTO = Readonly<{
    user: User,
    token: string,
}>;