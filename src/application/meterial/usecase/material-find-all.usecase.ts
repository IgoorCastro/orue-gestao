import { FindMaterialOutputDto } from "../dto/material-find.dto";
import { MaterialRepository } from "@/src/domain/repositories/material.repository";

export class FindMateriallAllUseCase {
    constructor(
        private materialRepository: MaterialRepository,
    ) {}

    async execute(): Promise<FindMaterialOutputDto[]> {
        const materials = await this.materialRepository.findAll();
        if(!materials) throw new Error("Material not found");

        return materials.map(material => ({
            id: material.id,
            name: material.name,
        }))
    }
}