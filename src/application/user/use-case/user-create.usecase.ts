import { User } from "@/src/domain/entities/user.entity";
import { UserRepository } from "@/src/domain/repositories/user.repository";
import { CreateUserInputDTO, CreateUserOutputDTO } from "../dto/user-create.dto";
import { UuidGenerator } from "@/src/domain/services/uuid-generator.services";
import normalizeName from "@/src/domain/utils/normalize-name";
import { ValidationError } from "@/src/domain/errors/validation.error";
import { ConflictError } from "@/src/domain/errors/conflict.error";

export class CreateUserUseCase {
    constructor(
        private userRepository: UserRepository,
        private uuid: UuidGenerator,
    ) { }

    async execute(input: CreateUserInputDTO): Promise<CreateUserOutputDTO> {
        // validação pelo nome
        const formattedName = normalizeName(input.name);
        const exists = await this.userRepository.existsByName(formattedName);
        if (exists) throw new ConflictError("User already exists");

        // novo usuario
        const user = User.create({
            id: this.uuid.generate(),
            name: formattedName,
            role: input.role,
        });

        // inserindo no banco
        await this.userRepository.create(user);

        return {
            id: user.id,
            name: user.name,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            deletedAt: user.deletedAt,
        };
    }
}