import { ColorRepository } from "@/src/domain/repositories/color.repository";
import { FindColorByNameInputDto, FindColorOutpuDto } from "../dto/color-find.dto";

export class FindColorByNameUseCase {
    constructor(
        private colorRepository: ColorRepository,
    ) { }

    async execute({ name }: FindColorByNameInputDto): Promise<FindColorOutpuDto[]> {
        if(!name?.trim()) throw new Error("Name cannot be empty");

        const colors = await this.colorRepository.findByName(name);
        return colors.map(color => ({
            id: color.id,
            name: color.name,
        }))
    }
}