import { User } from "@/src/domain/entities/user.entity";
import { UserRepository } from "@/src/domain/repositories/user.repository";
import { CreateUserInputDTO, CreateUserOutputDTO } from "../dto/user-create.dto";
import { UuidGeneratorServices } from "@/src/domain/services/uuid-generator.services";
import normalizeName from "@/src/domain/utils/normalize-name";
import { ConflictError } from "@/src/domain/errors/conflict.error";
import { HashService } from "@/src/domain/services/hash.service";
import { Password } from "@/src/domain/value-objects/password.vo";
import { ValidationError } from "@/src/domain/errors/validation.error";

export class CreateUserUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly uuid: UuidGeneratorServices,
        private readonly hashService: HashService
    ) { }

    async execute(input: CreateUserInputDTO): Promise<CreateUserOutputDTO> {
        // validação de senha ainda em string
        if(input.password.length < 5) throw new ValidationError("Password must be at least 5 characters");
        const hashedPassword = await this.hashService.hash(input.password);
        // validação pelo nome
        const [existsName, existsNickname] = await Promise.all([
            this.userRepository.existsByName(normalizeName(input.name)),
            this.userRepository.existsByNickname(normalizeName(input.nickname))
        ])        
        if (existsName) throw new ConflictError("User name already exists");
        if (existsNickname) throw new ConflictError("User nickname already exists");

        // novo usuario
        const user = User.create({
            id: this.uuid.generate(),
            name: input.name,
            nickname: input.nickname,
            password: Password.create(hashedPassword),
            role: input.role,
        });

        // inserindo no banco
        await this.userRepository.save(user);

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