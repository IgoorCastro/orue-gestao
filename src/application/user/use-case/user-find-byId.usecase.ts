import { UserRepository } from "@/src/domain/repositories/user.repository";
import { UuidGenerator } from "@/src/domain/services/uuid-generator.services";

export class FindUserById {
    constructor(
        private userRepository: UserRepository,
        private uuid: UuidGenerator,
    ) { }

    async execute(id: string) {
        if(!id) throw new Error("Invalid id");
        this.uuid.validate(id);
        
        const findedUser = await this.userRepository.findById(id);
        if(!findedUser) throw new Error("User not found");
        
        return findedUser;
    }
};