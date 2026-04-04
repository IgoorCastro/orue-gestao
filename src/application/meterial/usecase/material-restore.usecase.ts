// usecase para restaurar um usuario 'deleteado

import { ValidationError } from "@/src/domain/errors/validation.error";
import { NotFoundError } from "@/src/domain/errors/not-found.error";
import { MaterialRepository } from "@/src/domain/repositories/material.repository";
import { RestoreMaterialByIdInputDto } from "../dto/material-restore.dto";

export class MaterialRestoreByIdUseCase {
    constructor(private readonly materialRepository: MaterialRepository) { }

    async execute({ id }: RestoreMaterialByIdInputDto) {
        if(!id?.trim()) throw new ValidationError("Id cannot be empty");

        const material = await this.materialRepository.findById(id);
        if(!material) throw new NotFoundError("Material not found");

        material.restoreDeleted();

        await this.materialRepository.save(material);
    }
}