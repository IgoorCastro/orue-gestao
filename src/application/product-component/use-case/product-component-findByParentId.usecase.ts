import { ProductComponentRepository } from "@/src/domain/repositories/product-component.repository";
import { FindProductComponentByParentIdInputDto, FindProductComponentOutputDto } from "../dto/product-component-find.dto";
import { ValidationError } from "@/src/domain/errors/validation.error";
import { NotFoundError } from "@/src/domain/errors/not-found.error";

export class FindProductComponentByParentIdUseCase {
    constructor(
        private productComponentRepository: ProductComponentRepository,
    ) { }

    async execute(input: FindProductComponentByParentIdInputDto): Promise<FindProductComponentOutputDto[]> {
        if(!input.parentId?.trim()) throw new ValidationError("Parent product id cannot be empty");

        const existingPp = await this.productComponentRepository.findByParentProductId(input.parentId);
        if(!existingPp) throw new NotFoundError("Product component not found");

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