import { ValidationError } from "@/src/domain/errors/validation.error";
import { FindMaterialByNameInputDto, FindMaterialOutputDto } from "../dto/material-find.dto";
import { MaterialRepository } from "@/src/domain/repositories/material.repository";

export class FindMaterialByName {
    constructor(
        private materiallRepository: MaterialRepository,
    ) { }

    async execute({ name }: FindMaterialByNameInputDto): Promise<FindMaterialOutputDto[]> {
        if(!name?.trim()) throw new ValidationError("Name cannot be empty");

        const materials = await this.materiallRepository.findByName(name);

        return materials.map(material => ({
            id: material.id,
            name: material.name,
        }));
    }
}