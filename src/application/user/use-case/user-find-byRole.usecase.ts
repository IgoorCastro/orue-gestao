import { UserRepository } from "@/src/domain/repositories/user.repository";
import { FindUserByNameInputDto, FindUserByRoleInputDto, FindUserOutputDto } from "../dto/user-find.dto";

export class FindUserByRoleUseCase {
    constructor(
        private userRepository: UserRepository,
    ) { }

    async execute(input: FindUserByRoleInputDto): Promise<FindUserOutputDto[]> {
        if(!input.role?.trim()) throw new Error("Role cannot be empty");
        
        const users = await this.userRepository.findByRole(input.role);
        
        return users.map(user => ({
            id: user.id,
            name: user.name,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            deletedAt: user.deletedAt,
        }));
    }
};