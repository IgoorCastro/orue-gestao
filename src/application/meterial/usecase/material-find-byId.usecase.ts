import { ModelRepository } from "@/src/domain/repositories/model.repository";

export class FindModelById {
    constructor(
        private modelRepository: ModelRepository,
    ) { }

    async execute(modelId: string) {
        if(!modelId) throw new Error("Model id is required");

        const findedModel = this.modelRepository.findById(modelId);
        if(!findedModel) throw new Error("Model not found");

        return findedModel;
    }
}