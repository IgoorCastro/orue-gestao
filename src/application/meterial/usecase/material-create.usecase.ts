import { ModelRepository } from "@/src/domain/repositories/model.repository";
import { UuidGenerator } from "@/src/domain/services/uuid-generator.services";
import { Model } from "@/src/domain/entities/model.entity";
import { MaterialRepository } from "@/src/domain/repositories/material.repository";
import { CreateModelInputDto, CreateModelOutputDto } from "../../model/dto/model-create.dto";
import { CreateMaterialOutputDto, CreateMeterialInputDto } from "../dto/material-create.dto";
import { Material } from "@/src/domain/entities/material.entity";

export class CreateMaterialUseCase {
    constructor(
        private materialRepository: MaterialRepository,
        private uuid: UuidGenerator,
    ) { }

    async execute({ name }: CreateMeterialInputDto): Promise<CreateMaterialOutputDto> {
        if(!name) throw new Error("Material name cannot be empty");
        const validateMaterial = await this.materialRepository.findByName(name);
        if(validateMaterial) throw new Error("Material is already exists")
        
        const newMaterial = new Material(
            this.uuid.generate(),
            name,
        );

        await this.materialRepository.create(
            newMaterial
        );

        return {
            id: newMaterial.id,
            name: newMaterial.name,
        }
    }
}