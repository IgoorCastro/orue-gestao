import { UserRole } from "@/src/domain/enums/user-role.enum";

export interface UserOutputDto {
    id: string,
    name: string,
    role: UserRole,
    isActive: boolean,
    createAt: Date,
}