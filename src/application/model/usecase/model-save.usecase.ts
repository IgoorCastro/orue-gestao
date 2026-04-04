import { ModelRepository } from "@/src/domain/repositories/model.repository";
import { SaveModelInputDto, SaveModelOutputDto } from "../dto/model-save.dto";
import { ValidationError } from "@/src/domain/errors/validation.error";
import { NotFoundError } from "@/src/domain/errors/not-found.error";
import { ConflictError } from "@/src/domain/errors/conflict.error";
import normalizeName from "@/src/domain/utils/normalize-name";

export class UpdateModelUseCase {
    constructor(
        private modelRepository: ModelRepository,
    ) { }

    async execute({ id, name }: SaveModelInputDto): Promise<SaveModelOutputDto> {
        if(!id?.trim()) throw new ValidationError("Id cannot be empty");

        const model = await this.modelRepository.findById(id);        
        if(!model) throw new NotFoundError("Model not found");

        const formattedName = normalizeName(name);

        // validação basica do nome
        if(name === undefined || formattedName === model.normalizedName) return {
            id: model.id,
            normalizedName: model.normalizedName,
            name: model.name,
            createdAt: model.createdAt,
            updatedAt: model.updatedAt,
            deletedAt: model.deletedAt,
        }

        // evita duplicidade de registros com o msm nome
        const exists = await this.modelRepository.existsByName(name);
        if (exists) throw new ConflictError("Model name already exists");

        model.rename(name);

        await this.modelRepository.save(model)

        return {
            id: model.id,
            normalizedName: model.normalizedName,
            name: model.name,
            createdAt: model.createdAt,
            updatedAt: model.updatedAt,
            deletedAt: model.deletedAt,
        }
    }
}