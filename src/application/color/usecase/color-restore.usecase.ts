// usecase para restaurar um usuario 'deleteado

import { ValidationError } from "@/src/domain/errors/validation.error";
import { NotFoundError } from "@/src/domain/errors/not-found.error";
import { ColorRepository } from "@/src/domain/repositories/color.repository";
import { RestoreColorByIdInputDto } from "../dto/color-restore.dto";

export class ColorRestoreByIdUseCase {
    constructor(private readonly colorRepository: ColorRepository) { }

    async execute(input: RestoreColorByIdInputDto) {
        if(!input.id?.trim()) throw new ValidationError("Id cannot be empty");
        console.log("ID: ", input.id)

        const color = await this.colorRepository.findById(input.id);
        if(!color) throw new NotFoundError("Color not found");

        color.restoreDeleted();

        await this.colorRepository.save(color);
    }
}