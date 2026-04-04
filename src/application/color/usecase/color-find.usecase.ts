import { ColorRepository } from "@/src/domain/repositories/color.repository";

type Input = {
    id?: string;
    name?: string;
};

export class FindColorsUseCase {
    constructor(private readonly colorRepository: ColorRepository) {}
    async execute(input: Input) {
        // caso o find for por ID
        if (input.id) return this.colorRepository.findById(input.id);

        return this.colorRepository.findMany({
            name: input.name,
        });
    }
}