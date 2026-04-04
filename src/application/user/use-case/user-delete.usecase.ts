import { UserRepository } from "@/src/domain/repositories/user.repository";
import { DeleteUserByIdInputDto } from "../dto/user-delete.dto";
import { ValidationError } from "@/src/domain/errors/validation.error";
import { NotFoundError } from "@/src/domain/errors/not-found.error";

export class DeleteUserByIdUseCase {
    constructor(private userRepository: UserRepository) { }

    async execute(input: DeleteUserByIdInputDto): Promise<void> {
        if(!input.id?.trim()) throw new ValidationError("Id cannot be empty");

        const user = await this.userRepository.findById(input.id);
        if(!user) throw new NotFoundError("User not found");

        user.delete();

        await this.userRepository.save(user);
    }
}