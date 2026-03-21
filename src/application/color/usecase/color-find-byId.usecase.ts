import { ColorRepository } from "@/src/domain/repositories/color.repository";
import { FindColorByIdInputDto, FindColorOutpuDto } from "../dto/color-find.dto";

export class FindColorByIdUseCase {
    constructor(private colorRepository: ColorRepository) { }

    async execute({ id }: FindColorByIdInputDto): Promise<FindColorOutpuDto> {
        if(!id?.trim()) throw new Error("Id cannot be empty");
        
        const color = await this.colorRepository.findById(id);
        if(!color) throw new Error("Color not found");

        return {
            id: color.id,
            name: color.name,
        };
    }
}