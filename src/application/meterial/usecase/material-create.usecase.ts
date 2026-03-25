import { UuidGenerator } from "@/src/domain/services/uuid-generator.services";
import { MaterialRepository } from "@/src/domain/repositories/material.repository";
import { CreateMaterialOutputDto, CreateMeterialInputDto } from "../dto/material-create.dto";
import { Material } from "@/src/domain/entities/material.entity";
import { ValidationError } from "@/src/domain/errors/validation.error";
import { ConflictError } from "@/src/domain/errors/conflict.error";

export class CreateMaterialUseCase {
    constructor(
        private materialRepository: MaterialRepository,
        private uuid: UuidGenerator,
    ) { }

    async execute({ name }: CreateMeterialInputDto): Promise<CreateMaterialOutputDto> {
        if(!name?.trim()) throw new ValidationError("Material name cannot be empty");

        const exists = await this.materialRepository.existsByName(name);
        if(exists) throw new ConflictError("Material already exists");
        
        const material = Material.create({
            id: this.uuid.generate(),
            name: name,
        })

        await this.materialRepository.save(material);

        return {
            id: material.id,
            name: material.name,
        }
    }
}