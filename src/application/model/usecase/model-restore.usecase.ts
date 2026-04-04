// usecase para restaurar um usuario 'deleteado

import { ValidationError } from "@/src/domain/errors/validation.error";
import { NotFoundError } from "@/src/domain/errors/not-found.error";
import { RestoreModelByIdInputDto } from "../dto/material-restore.dto";
import { ModelRepository } from "@/src/domain/repositories/model.repository";

export class RestoreModelByIdUseCase {
    constructor(private readonly modelRepository: ModelRepository) { }

    async execute({ id }: RestoreModelByIdInputDto) {
        if(!id?.trim()) throw new ValidationError("Id cannot be empty");

        const model = await this.modelRepository.findById(id);
        if(!model) throw new NotFoundError("Model not found");

        model.restoreDeleted();

        await this.modelRepository.save(model);
    }
}