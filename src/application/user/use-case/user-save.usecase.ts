import { UserRepository } from "@/src/domain/repositories/user.repository";
import { SaveUserInputDto, SaveUserOutputDto } from "../dto/user-save.dto";
import { ValidationError } from "@/src/domain/errors/validation.error";
import { NotFoundError } from "@/src/domain/errors/not-found.error";
import normalizeName from "@/src/domain/utils/normalize-name";
import { ConflictError } from "@/src/domain/errors/conflict.error";

export class UpdateUserUseCaseUseCase {
    constructor(
        private userRepository: UserRepository,
    ) {}

    async execute(input: SaveUserInputDto): Promise<SaveUserOutputDto> {
        if(!input.id?.trim()) throw new ValidationError("Id cannot be empty");

        const user = await this.userRepository.findById(input.id);
        if(!user) throw new NotFoundError("User not found");

        if(input.name !== undefined) {
            const formattedName = normalizeName(input.name);
            const exists = await this.userRepository.findByName(formattedName);
            if(exists) throw new ConflictError("User name already exists");

            user.rename(input.name);
        }

        if(input.role !== undefined) user.changeRole(input.role);

        await this.userRepository.save(user);

        return {
            id: user.id,
            name: user.name,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            deletedAt: user.deletedAt,
        }
    }
}