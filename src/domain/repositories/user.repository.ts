// contrato para o repositorio do usuario
import { User } from "../entities/user.entity";
import { UserRole } from "../enums/user-role.enum";

export interface UserRepository {
    findById(id: string): Promise<User | null>;
    findByName(name: string): Promise<User[]>;
    findByNickname(nickname: string): Promise<User | null>; // somente 1 usuario por nickname!!
    findByRole(role: UserRole): Promise<User[]>
    findAll(): Promise<User[]>;
    findMany(filters: { name?: string; role?: UserRole, nickname?: string }): Promise<User[]>;
    existsByName(name: string): Promise<boolean>;
    existsByNickname(name: string): Promise<boolean>;
    save(user: User): Promise<void>;
}