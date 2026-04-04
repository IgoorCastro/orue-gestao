import { FindStoreByIdInputDto, FindStoreOutputDto } from "../dto/store-find.dto";
import { StoreRepository } from "@/src/domain/repositories/store.repository";

export class FindStoreByIdUseCase {
    constructor(
        private storeRepository: StoreRepository,
    ) { }

    async execute({ id }: FindStoreByIdInputDto): Promise<FindStoreOutputDto> {
        if(!id?.trim()) throw new Error("Id cannot be empty");

        // busca e validação por id
        const store = await this.storeRepository.findById(id);
        if(!store) throw new Error("Store not found");

        return {
            id: store.id,
            name: store.name,
            createdAt: store.createdAt,
            updatedAt: store.updatedAt,
            deletedAt: store.deletedAt,
        };
    }
}