import { ModelRepository } from "@/src/domain/repositories/model.repository";
import { UuidGenerator } from "@/src/domain/services/uuid-generator.services";
import { CreateModelInputDto, CreateModelOutputDto } from "../dto/model-create.dto";
import { Model } from "@/src/domain/entities/model.entity";

export class CreateModelUseCase {
    constructor(
        private modelRepository: ModelRepository,
        private uuid: UuidGenerator,
    ) { }

    async execute({ name }: CreateModelInputDto): Promise<CreateModelOutputDto> {
        // model precisa de um nome para ser criado
        if(!name?.trim()) throw new Error("Model cannot be empty");
        const existingModel = await this.modelRepository.existsByName(name);
        if(existingModel) throw new Error("Model already exists");
        
        const model = Model.create({
            id: this.uuid.generate(),
            name: name,
        })

        await this.modelRepository.create(model);

        return {
            id: model.id,
            name: model.name,
        }
    }
}