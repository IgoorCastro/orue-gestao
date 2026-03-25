import { ColorRepository } from "@/src/domain/repositories/color.repository";
import { FindColorByNameInputDto, FindColorOutputDto } from "../dto/color-find.dto";
import { ValidationError } from "@/src/domain/errors/validation.error";

export class FindColorByNameUseCase {
    constructor(
        private colorRepository: ColorRepository,
    ) { }

    async execute({ name }: FindColorByNameInputDto): Promise<FindColorOutputDto[]> {
        if(!name?.trim()) throw new ValidationError("Name cannot be empty");

        const colors = await this.colorRepository.findByName(name);
        
        return colors.map(color => ({
            id: color.id,
            name: color.name,
        }))
    }
}