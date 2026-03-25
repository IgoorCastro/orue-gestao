import { ProductComponentRepository } from "@/src/domain/repositories/product-component.repository";
import { FindProductComponentOutputDto } from "../dto/product-component-find.dto";

export class FindProductComponentAllUseCase {
    constructor(
        private productComponentRepository: ProductComponentRepository,
    ) { }

    async execute(): Promise<FindProductComponentOutputDto[]> {
        const existingPc = await this.productComponentRepository.findAll();

        return existingPc.map(pc => ({
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