import { ValidationError } from "@/src/domain/errors/validation.error";
import { FindMaterialByIdInputDto, FindMaterialOutputDto } from "../dto/material-find.dto";
import { MaterialRepository } from "@/src/domain/repositories/material.repository";
import { NotFoundError } from "@/src/domain/errors/not-found.error";

export class FindMaterialByIdUseCase {
    constructor(
        private materialRepository: MaterialRepository,
    ) { }

    async execute({ id }: FindMaterialByIdInputDto): Promise<FindMaterialOutputDto> {
        if(!id?.trim()) throw new ValidationError("Material id is required");

        const material = await this.materialRepository.findById(id);
        if(!material) throw new NotFoundError("Material not found");

        return {
            id: material.id,
            name: material.name,
        };
    }
}