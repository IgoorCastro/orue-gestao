import { FindMaterialByNameInputDto, FindMaterialOutputDto } from "../dto/material-find.dto";
import { MaterialRepository } from "@/src/domain/repositories/material.repository";

export class FindMaterialByName {
    constructor(
        private materiallRepository: MaterialRepository,
    ) { }

    async execute({ name }: FindMaterialByNameInputDto): Promise<FindMaterialOutputDto[]> {
        if(!name?.trim()) throw new Error("Name cannot be empty");

        const materials = await this.materiallRepository.findByName(name);
        if(!materials) throw new Error("User not found");

        return materials.map(material => ({
            id: material.id,
            name: material.name,
        }));
    }
}