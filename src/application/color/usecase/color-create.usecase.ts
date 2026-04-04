// usecase para criar uma nova cor
// props esperadas: name

import { ColorRepository } from "@/src/domain/repositories/color.repository";
import { UuidGeneratorServices } from "@/src/domain/services/uuid-generator.services";
import { CreateColorInputDto, CreateColorOutputDto } from "../dto/color-create.dto";
import { Color } from "@/src/domain/entities/color.entity";
import { ValidationError } from "@/src/domain/errors/validation.error";
import { ConflictError } from "@/src/domain/errors/conflict.error";

export class CreateColorUseCase {
    constructor(
        private colorRepository: ColorRepository,
        private uuid: UuidGeneratorServices,
    ) { }

    async execute({ name }: CreateColorInputDto): Promise<CreateColorOutputDto> {
        if(!name?.trim()) throw new ValidationError("Name cannot be empty");
        
        // verifica se já existe um registro com o msm nome
        const existingColor = await this.colorRepository.existsByName(name);
        if(existingColor) throw new ConflictError("Color already exists");

        const color = Color.create({
            id: this.uuid.generate(),
            name,
        });

        await this.colorRepository.save(color);

        return {
            id: color.id,
            name: color.name,
            normalizedName: color.normalizedName,
        }
    }
}