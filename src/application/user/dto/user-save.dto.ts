import { UserRole } from "@/src/domain/enums/user-role.enum";

export interface SaveUserDto {
    id: string;
    name?: string;
    role?: UserRole;
    isActive?: boolean;
}