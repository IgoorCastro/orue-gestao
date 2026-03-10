import { ModelRepository } from "@/src/domain/repositories/model.repository";
import { SaveModelDto } from "../dto/model-save.dto";

export class SaveModelUseCase {
    constructor(
        private modelRepository: ModelRepository,
    ) { }

    async execute({ id, name }: SaveModelDto): Promise<SaveModelDto> {
        if(!id) throw new Error("Id cannot be empty");

        const existingModel = await this.modelRepository.findById(id);        
        if(!existingModel) throw new Error("Model not found");

        if(name) existingModel.rename(name);

        return {
            id: existingModel.id,
            name: existingModel.name,
        }
    }
}