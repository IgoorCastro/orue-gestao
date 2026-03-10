import { ModelRepository } from "@/src/domain/repositories/model.repository";

export class FindModelAll {
    constructor(
        private modelRepository: ModelRepository,
    ) {}

    async execute() {
        const findedModel = await this.modelRepository.findAll();
        if(!findedModel) throw new Error("Model not found");

        return findedModel;
    }
}