import { UserRole } from "../enum/user-role.enum";

export type User = {
    id: string;
    name: string;
    nickname: string,
    role: UserRole; 

    createdAt: string; 
    updatedAt: string;
    deletedAt?: string;
};

export type CreateUserDto = {
    name: string;
    password: string,
    nickname: string,
    role: string,
};