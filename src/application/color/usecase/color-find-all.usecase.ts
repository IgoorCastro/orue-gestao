import { ColorRepository } from "@/src/domain/repositories/color.repository";
import { FindColorOutpuDto } from "../dto/color-find.dto";

export class FindColorAllUseCase {
    constructor(private colorRepository: ColorRepository) { }

    async execute(): Promise<FindColorOutpuDto[]> {        
        const colors = await this.colorRepository.findAll();

        return colors.map(color => ({
            id: color.id,
            name: color.name,
        }))
    }
}