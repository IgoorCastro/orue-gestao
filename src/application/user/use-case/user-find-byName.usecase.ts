import { UserRepository } from "@/src/domain/repositories/user.repository";
import { UuidGenerator } from "@/src/domain/services/uuid-generator.services";
import { FindUserByNameInputDto, FindUserOutputDto } from "../dto/user-find.dto";

export class FindUserByNameUseCase {
    constructor(
        private userRepository: UserRepository,
    ) { }

    async execute(input: FindUserByNameInputDto): Promise<FindUserOutputDto[]> {
        if(!input.name?.trim()) throw new Error("Name cannot be empty");
        
        const users = await this.userRepository.findByName(input.name);
        if(!users) throw new Error("User not found");
        
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