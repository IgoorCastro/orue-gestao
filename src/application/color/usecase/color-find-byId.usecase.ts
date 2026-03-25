import { ColorRepository } from "@/src/domain/repositories/color.repository";
import { FindColorByIdInputDto, FindColorOutputDto } from "../dto/color-find.dto";
import { ValidationError } from "@/src/domain/errors/validation.error";

export class FindColorByIdUseCase {
    constructor(private colorRepository: ColorRepository) { }

    async execute({ id }: FindColorByIdInputDto): Promise<FindColorOutputDto> {
        if(!id?.trim()) throw new ValidationError("Id cannot be empty");
        
        const color = await this.colorRepository.findById(id);
        if(!color) throw new Error("Color not found");

        return {
            id: color.id,
            name: color.name,
        };
    }
}