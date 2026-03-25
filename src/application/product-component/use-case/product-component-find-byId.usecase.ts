import { ProductComponentRepository } from "@/src/domain/repositories/product-component.repository";
import { FindProductComponentByIdInputDto, FindProductComponentOutputDto } from "../dto/product-component-find.dto";
import { ValidationError } from "@/src/domain/errors/validation.error";
import { NotFoundError } from "@/src/domain/errors/not-found.error";

export class FindProductComponentByIdUseCase {
    constructor(
        private productComponentRepository: ProductComponentRepository,
    ) { }

    async execute(input: FindProductComponentByIdInputDto): Promise<FindProductComponentOutputDto> {
        if (!input.id?.trim()) throw new ValidationError("Id cannot be empty");

        const pc = await this.productComponentRepository.findById(input.id);
        if (!pc) throw new NotFoundError("Product component not found");

        return {
            id: pc.id,
            parentProductId: pc.parentProductId,
            componentProductId: pc.componentProductId,
            quantity: pc.quantity,
            createdAt: pc.createdAt,
            updatedAt: pc.updatedAt,
            deletedAt: pc.deletedAt,
        };
    }
}