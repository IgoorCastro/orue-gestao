import { ModelRepository } from "@/src/domain/repositories/model.repository";

export class FindModelByName {
    constructor(
        private modelRepository: ModelRepository,
    ) { }

    async execute(name: string) {
        if(!name) throw new Error("Name cannot be empty");
        const findedModel = await this.modelRepository.findByName(name);
        if(!findedModel) throw new Error("User not found");

        return findedModel;
    }
}