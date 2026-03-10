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
        if(!name) throw new Error("Model cannot be empty");
        const validateModel = await this.modelRepository.findByName(name);
        if(validateModel) throw new Error("Model is already exists")
        
        const newModel = new Model(
            this.uuid.generate(),
            name,
        );

        await this.modelRepository.create(newModel);

        return {
            id: newModel.id,
            name: newModel.name,
        }
    }
}