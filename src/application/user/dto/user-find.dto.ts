import { UserRole } from "@/src/domain/enums/user-role.enum";

export type FindUserByIdInputDto = Readonly<{
    id: string;
}>;

export type FindUserByNameInputDto = Readonly<{
    name: string;
}>;

export type FindUserByRoleInputDto = Readonly<{
    role: UserRole;
}>;

export type FindUserOutputDto = Readonly<{
    id: string;
    name: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date,
    deletedAt?: Date,
}>;