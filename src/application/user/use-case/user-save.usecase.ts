import { UserRepository } from "@/src/domain/repositories/user.repository";
import { SaveUserInputDto, SaveUserOutputDto } from "../dto/user-save.dto";
import { ValidationError } from "@/src/domain/errors/validation.error";
import { NotFoundError } from "@/src/domain/errors/not-found.error";
import normalizeName from "@/src/domain/utils/normalize-name";
import { ConflictError } from "@/src/domain/errors/conflict.error";
import { Password } from "@/src/domain/value-objects/password.vo";
import { HashService } from "@/src/domain/services/hash.service";

export class UpdateUserUseCaseUseCase {
    constructor(
        private userRepository: UserRepository,
        private readonly hashService: HashService
    ) {}

    async execute(input: SaveUserInputDto): Promise<SaveUserOutputDto> {
        if(!input.id?.trim()) throw new ValidationError("Id cannot be empty");
        console.log(input);

        const user = await this.userRepository.findById(input.id);
        if(!user) throw new NotFoundError("User not found");

        // validação de nome
        if(input.name !== undefined) {
            const formattedName = normalizeName(input.name);
            const exists = await this.userRepository.existsByName(formattedName);
            if(exists) throw new ConflictError("User name already exists");

            user.rename(input.name);
        }

        // validação de nickname
        if(input.nickname !== undefined) {
            const formattedNickname = normalizeName(input.nickname);
            const exists = await this.userRepository.existsByNickname(formattedNickname);
            if(exists && input.id !== user.id) throw new ConflictError("User nickname already exists");

            user.changeNickname(input.nickname);
        }

        // update no password
        if(input.password !== undefined) {
            const hashedPassword = await this.hashService.hash(input.password); // hash da senha
            user.changePassword(Password.create(hashedPassword)); // converte para Password e guarda
        };

        // update na função
        if(input.role !== undefined) user.changeRole(input.role);

        await this.userRepository.save(user);

        return {
            id: user.id,
            name: user.name,
            normalizedName: user.normalizedName,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            deletedAt: user.deletedAt,
        }
    }
}