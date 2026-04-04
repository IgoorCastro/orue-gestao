// usecase para restaurar um usuario 'deleteado

import { ValidationError } from "@/src/domain/errors/validation.error";
import { NotFoundError } from "@/src/domain/errors/not-found.error";
import { ProductComponentRepository } from "@/src/domain/repositories/product-component.repository";
import { RestoreProductComponentByIdInputDto } from "../dto/product-component-restore.dto";

export class RestoreProductComponentByIdUseCase {
    constructor(private readonly productComponentRepository: ProductComponentRepository) { }

    async execute({ id }: RestoreProductComponentByIdInputDto): Promise<void> {
        if(!id?.trim()) throw new ValidationError("Id cannot be empty");

        const pc = await this.productComponentRepository.findById(id);
        if(!pc) throw new NotFoundError("Product component not found");

        pc.restoreDeleted();

        await this.productComponentRepository.save(pc);
    }
}