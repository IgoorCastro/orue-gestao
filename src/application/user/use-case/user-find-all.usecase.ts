import { UserRepository } from "@/src/domain/repositories/user.repository";
import { UuidGenerator } from "@/src/domain/services/uuid-generator.services";
import { FindUserOutputDto } from "../dto/user-find.dto";

export class FindUserAllUseCase {
    constructor(
        private userRepository: UserRepository,
    ) { }

    async execute(): Promise<FindUserOutputDto[]> {        
        const users = await this.userRepository.findAll();
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