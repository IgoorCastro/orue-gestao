import { ModelRepository } from "@/src/domain/repositories/model.repository";
import { UuidGenerator } from "@/src/domain/services/uuid-generator.services";
import { MaterialRepository } from "@/src/domain/repositories/material.repository";
import { CreateMaterialOutputDto, CreateMeterialInputDto } from "../dto/material-create.dto";
import { Material } from "@/src/domain/entities/material.entity";

export class CreateMaterialUseCase {
    constructor(
        private materialRepository: MaterialRepository,
        private uuid: UuidGenerator,
    ) { }

    async execute({ name }: CreateMeterialInputDto): Promise<CreateMaterialOutputDto> {
        if(!name?.trim()) throw new Error("Material name cannot be empty");
        const validateMaterial = await this.materialRepository.findByName(name);
        if(validateMaterial) throw new Error("Material is already exists");
        
        const material = Material.create({
            id: this.uuid.generate(),
            name: name,
        })

        await this.materialRepository.create(material);

        return {
            id: material.id,
            name: material.name,
        }
    }
}