// cria uma nova loja no sistema
// lojas serão associadas a estoques
// estoque principal nao precisa de loja vinculada

import { UuidGeneratorServices } from "@/src/domain/services/uuid-generator.services";
import { CreateStoreInputDto, CreateStoreOutputDto } from "../dto/store-create.dto";
import normalizeName from "@/src/domain/utils/normalize-name";
import { ValidationError } from "@/src/domain/errors/validation.error";
import { ConflictError } from "@/src/domain/errors/conflict.error";
import { StoreRepository } from "@/src/domain/repositories/store.repository";
import { Store } from "@/src/domain/entities/store.entity";

export class CreateStoreUseCase {
    constructor(
        private storeRepository: StoreRepository,
        private uuid: UuidGeneratorServices,
    ) { }

    async execute({ name }: CreateStoreInputDto): Promise<CreateStoreOutputDto> {
        if (!name?.trim()) throw new ValidationError("Store name cannot be empty"); // valida nome

        // validação do nome
        const formattedName = normalizeName(name);
        const exists = await this.storeRepository.findByName(formattedName); // procura por estoque com o msm nome
        if (exists.length) throw new ConflictError("Store name already exists");

        const store = Store.create({
            id: this.uuid.generate(),
            name: name,
        });

        await this.storeRepository.save(store);

        return {
            id: store.id,
            name: store.name,
            createdAt: store.createdAt,
            updatedAt: store.updatedAt,
            deletedAt: store.deletedAt,
        }
    }
}