import { ValidationError } from "@/src/domain/errors/validation.error";
import { NotFoundError } from "@/src/domain/errors/not-found.error";
import { MaterialRepository } from "@/src/domain/repositories/material.repository";
import { DeleteMaterialByIdInputDto } from "../dto/material-delete.dto";

export class DeleteMaterialByIdUseCase {
    constructor(private materialRepository: MaterialRepository) { }

    async execute({ id }: DeleteMaterialByIdInputDto): Promise<void> {
        if(!id?.trim()) throw new ValidationError("Id cannot be empty");

        const color = await this.materialRepository.findById(id);
        if(!color) throw new NotFoundError("Material not found");

        color.delete();

        await this.materialRepository.save(color);
    }
}