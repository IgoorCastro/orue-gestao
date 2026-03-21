import { ColorRepository } from "@/src/domain/repositories/color.repository";
import { UpdateColorInputDto, UpdateColorOutuputDto } from "../dto/color-save-dto";

export class UpdateColorUseCase {
    constructor(private colorRepository: ColorRepository) { }

    async execute({ id, name }: UpdateColorInputDto): Promise<UpdateColorOutuputDto> {
        if(!id?.trim()) throw new Error("Id cannot be empty");
        
        const existingColor = await this.colorRepository.findById(id);
        if(!existingColor) throw new Error("Color not found");

        existingColor.rename(name);
        await this.colorRepository.save(existingColor);

        return {
            id: existingColor.id,
            name: existingColor.name,
        }
    }
}