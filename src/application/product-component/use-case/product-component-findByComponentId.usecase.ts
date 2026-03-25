import { ProductComponentRepository } from "@/src/domain/repositories/product-component.repository";
import { FindProductComponentByComponentInputDto, FindProductComponentOutputDto } from "../dto/product-component-find.dto";
import { ValidationError } from "@/src/domain/errors/validation.error";

export class FindProductComponentByComponentIdUseCase {
    constructor(
        private productComponentRepository: ProductComponentRepository,
    ) { }

    async execute(input: FindProductComponentByComponentInputDto): Promise<FindProductComponentOutputDto[]> {
        if(!input.componentId?.trim()) throw new ValidationError("Component product id cannot be empty");

        const existingPp = await this.productComponentRepository.findByComponentProductId(input.componentId);

        return existingPp.map(pc => ({
            id: pc.id,
            parentProductId: pc.parentProductId,
            componentProductId: pc.componentProductId,
            quantity: pc.quantity,
            createdAt: pc.createdAt,
            updatedAt: pc.updatedAt,
            deletedAt: pc.deletedAt,
        }));
    }
}