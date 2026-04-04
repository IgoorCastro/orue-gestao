import { UserRole } from "@/src/domain/enums/user-role.enum";

export interface SaveUserInputDto {
    id: string;
    name?: string;
    nickname: string,
    password: string,
    role?: UserRole;
}

export interface SaveUserOutputDto {
    id: string;
    name: string;
    normalizedName: string,
    role: UserRole;
    createdAt: Date,
    updatedAt: Date,
    deletedAt?: Date,
}