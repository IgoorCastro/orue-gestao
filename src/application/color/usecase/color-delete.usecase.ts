import { UserRepository } from "@/src/domain/repositories/user.repository";
import { ValidationError } from "@/src/domain/errors/validation.error";
import { NotFoundError } from "@/src/domain/errors/not-found.error";
import { DeleteColorByIdInputDto } from "../dto/color-delete.dto";
import { ColorRepository } from "@/src/domain/repositories/color.repository";

export class DeleteColorByIdUseCase {
    constructor(private colorRepository: ColorRepository) { }

    async execute(input: DeleteColorByIdInputDto): Promise<void> {
        if(!input.id?.trim()) throw new ValidationError("Id cannot be empty");

        const color = await this.colorRepository.findById(input.id);
        if(!color) throw new NotFoundError("Color not found");

        color.delete();

        await this.colorRepository.save(color);
    }
}