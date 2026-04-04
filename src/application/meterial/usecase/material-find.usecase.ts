import { UserRole } from "@/src/domain/enums/user-role.enum";
import { ColorRepository } from "@/src/domain/repositories/color.repository";
import { MaterialRepository } from "@/src/domain/repositories/material.repository";
import { UserRepository } from "@/src/domain/repositories/user.repository";

type Input = {
    id?: string;
    name?: string;
};

export class FindMaterialsUseCase {
    constructor(private readonly materialRepository: MaterialRepository) {}
    async execute(input: Input) {
        // caso o find for por ID
        if (input.id) return this.materialRepository.findById(input.id);

        return this.materialRepository.findMany({
            name: input.name,
        });
    }
}