import { ColorRepository } from "@/src/domain/repositories/color.repository";
import { UpdateColorInputDto, UpdateColorOutputDto } from "../dto/color-save-dto";
import { ValidationError } from "@/src/domain/errors/validation.error";
import { NotFoundError } from "@/src/domain/errors/not-found.error";
import { ConflictError } from "@/src/domain/errors/conflict.error";
import normalizeName from "@/src/domain/utils/normalize-name";

export class UpdateColorUseCase {
    constructor(
        private colorRepository: ColorRepository
    ) { }

    async execute({ id, name }: UpdateColorInputDto): Promise<UpdateColorOutputDto> {
        if (!id?.trim()) throw new ValidationError("Id cannot be empty");

        const color = await this.colorRepository.findById(id);
        if (!color) throw new NotFoundError("Color not found");

        if (name === undefined) return {
            id: color.id,
            name: color.name,
        };

        const formattedName = normalizeName(name);

        // verifica se o nome da props é o msm nome em registro
        if (color.name === formattedName) return {
            id: color.id,
            name: color.name,
        };

        // evita duplicidade de registros com o msm nome
        const exists = await this.colorRepository.findByName(formattedName);
        if (exists) throw new ConflictError("Color name already exists");

        color.rename(formattedName);
        

        await this.colorRepository.save(color);

        return {
            id: color.id,
            name: color.name,
        }
    }
}