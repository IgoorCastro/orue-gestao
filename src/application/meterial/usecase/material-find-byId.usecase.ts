import { FindMaterialByIdInputDto, FindMaterialOutputDto } from "../dto/material-find.dto";
import { MaterialRepository } from "@/src/domain/repositories/material.repository";

export class FindMaterialByIdUseCase {
    constructor(
        private materialRepository: MaterialRepository,
    ) { }

    async execute({ id }: FindMaterialByIdInputDto): Promise<FindMaterialOutputDto> {
        if(!id?.trim()) throw new Error("Material id is required");

        const material = await this.materialRepository.findById(id);
        if(!material) throw new Error("Material not found");

        return {
            id: material.id,
            name: material.name,
        };
    }
}