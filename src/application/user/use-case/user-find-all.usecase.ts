import { UserRepository } from "@/src/domain/repositories/user.repository";
import { UuidGenerator } from "@/src/domain/services/uuid-generator.services";

export class FindUserAll {
    constructor(
        private userRepository: UserRepository,
    ) { }

    async execute() {        
        const findedUser = await this.userRepository.findAll();
        if(!findedUser) throw new Error("User not found");
        
        return findedUser;
    }
};