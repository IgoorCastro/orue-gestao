import { User } from "@/src/domain/entities/user.entity";
import { UserRepository } from "@/src/domain/repositories/user.repository";
import { CreateUserInputDTO, CreateUserOutputDTO } from "../dto/user-create.dto";
import { UuidGenerator } from "@/src/domain/services/uuid-generator.services";

export class CreateUserUseCase {
    constructor(
        private userRepository: UserRepository,
        private uuid: UuidGenerator,
    ) { }

    async execute(input: CreateUserInputDTO): Promise<CreateUserOutputDTO> {
        const { name, role } = input;

        const existingUser = await this.userRepository.findByName(name);
        if (existingUser) throw new Error("User already exists");

        // novo usuario
        const newUser = new User(
            this.uuid.generate(),
            name,
            role,
            true,
            new Date(),
        );

        // inserindo no banco
        await this.userRepository.create(newUser);

        return {
            id: newUser.id,
            name: newUser.name,
            role: newUser.role,
            isActive: newUser.isActive,
            createdAt: newUser.createdAt,
        };
    }
}