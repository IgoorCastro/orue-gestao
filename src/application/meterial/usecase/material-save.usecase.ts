import { MaterialRepository } from "@/src/domain/repositories/material.repository";
import { SaveMaterialInputDto, SaveMaterialOutputDto } from "../dto/material-save.dto";
import { ValidationError } from "@/src/domain/errors/validation.error";
import { NotFoundError } from "@/src/domain/errors/not-found.error";
import { ConflictError } from "@/src/domain/errors/conflict.error";
import normalizeName from "@/src/domain/utils/normalize-name";

export class UpdateMaterialUseCase {
    constructor(
        private materialRepository: MaterialRepository,
    ) { }

    async execute({ id, name }: SaveMaterialInputDto): Promise<SaveMaterialOutputDto> {
        if(!id?.trim()) throw new ValidationError("Id cannot be empty");

        const material = await this.materialRepository.findById(id);
        if(!material) throw new NotFoundError("Material not found");

        if(name === undefined) return {
            id: material.id,
            name: material.name,
            normalizedName: material.normalizedName,
        }

        const formattedName = normalizeName(name);

        // verifica se o nome da props é o msm nome em registro
        if(formattedName === material.name) return {
            id: material.id,
            name: material.name,
            normalizedName: material.normalizedName,
        }

        // evita duplicidade de registros com o msm nome
        const exists = await this.materialRepository.existsByName(name);
        if (exists) throw new ConflictError("Material already exists");

        material.rename(name);

        await this.materialRepository.save(material);

        return {
            id: material.id,
            name: material.name,
            normalizedName: material.normalizedName,
        }
    }
}