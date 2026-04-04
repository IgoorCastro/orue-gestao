// Find de lojas com filtro
// Filtros permitidos: name

import { FindStoreFilteredDto, FindStoreOutputDto } from "../dto/store-find.dto";
import { StoreRepository } from "@/src/domain/repositories/store.repository";

export class FindStoresUseCase {
    constructor(private storeRepository: StoreRepository) { }

    async execute(filters: FindStoreFilteredDto): Promise<FindStoreOutputDto[]> {
        const stores = await this.storeRepository.findMany({
            ...filters,
        });

        return stores.map(s => ({
            id: s.id,
            name: s.name,
            createdAt: s.createdAt,
            updatedAt: s.updatedAt,
            deletedAt: s.deletedAt ?? undefined,
        }))
    }
}