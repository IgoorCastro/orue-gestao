import { ValidationError } from "@/src/domain/errors/validation.error";
import { NotFoundError } from "@/src/domain/errors/not-found.error";
import { DeleteProductComponentByIdInputDto } from "../dto/product-component-delete.dto";
import { ProductComponentRepository } from "@/src/domain/repositories/product-component.repository";

export class DeleteProductComponentByIdUseCase {
    constructor(private productComponentRepository: ProductComponentRepository) { }

    async execute({ id }: DeleteProductComponentByIdInputDto): Promise<void> {
        if(!id?.trim()) throw new ValidationError("Id cannot be empty");

        const pc = await this.productComponentRepository.findById(id);
        if(!pc) throw new NotFoundError("Product component not found");

        pc.delete();

        await this.productComponentRepository.save(pc);
    }
}