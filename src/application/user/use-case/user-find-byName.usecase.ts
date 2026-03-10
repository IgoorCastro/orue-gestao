import { UserRepository } from "@/src/domain/repositories/user.repository";
import { UuidGenerator } from "@/src/domain/services/uuid-generator.services";

export class FindUserByNameUseCase {
    constructor(
        private userRepository: UserRepository,
    ) { }

    async execute(name: string) {
        if(!name) throw new Error("Name cannot be empty");
        
        const findedUser = await this.userRepository.findByName(name);
        if(!findedUser) throw new Error("User not found");
        
        return findedUser;
    }
};