import { ModelRepository } from "@/src/domain/repositories/model.repository";
import { SaveModelDto } from "../dto/model-save.dto";
import { ValidationError } from "@/src/domain/errors/validation.error";
import { NotFoundError } from "@/src/domain/errors/not-found.error";
import { ConflictError } from "@/src/domain/errors/conflict.error";
import normalizeName from "@/src/domain/utils/normalize-name";

export class SaveModelUseCase {
    constructor(
        private modelRepository: ModelRepository,
    ) { }

    async execute({ id, name }: SaveModelDto): Promise<SaveModelDto> {
        if(!id?.trim()) throw new ValidationError("Id cannot be empty");

        const model = await this.modelRepository.findById(id);        
        if(!model) throw new NotFoundError("Model not found");

        if(name === undefined) return {
            id: model.id,
            name: model.name,
        }

        const formattedName = normalizeName(name);

        // verifica se o nome da props é o msm nome em registro
        if(formattedName === model.name) return {
            id: model.id,
            name: model.name,
        }

        // evita duplicidade de registros com o msm nome
        const exists = await this.modelRepository.existsByName(name);
        if (exists) throw new ConflictError("Model name already exists");

        model.rename(name);

        await this.modelRepository.save(model)

        return {
            id: model.id,
            name: model.name,
        }
    }
}