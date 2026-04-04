import { ValidationError } from "@/src/domain/errors/validation.error";
import { NotFoundError } from "@/src/domain/errors/not-found.error";
import { DeleteModelByIdInputDto } from "../dto/model-delete.dto";
import { ModelRepository } from "@/src/domain/repositories/model.repository";

export class DeleteModelByIdUseCase {
    constructor(private modelRepository: ModelRepository) { }

    async execute({ id }: DeleteModelByIdInputDto): Promise<void> {
        if(!id?.trim()) throw new ValidationError("Id cannot be empty");

        const model = await this.modelRepository.findById(id);
        if(!model) throw new NotFoundError("Material not found");

        model.delete();

        await this.modelRepository.save(model);
    }
}