// caso de uso para restaurar uma loja deleteda pelo ID

import { SaveStoreInputDto, SaveStoreOutputDto } from "../dto/store-save.dto";
import { ValidationError } from "@/src/domain/errors/validation.error";
import { NotFoundError } from "@/src/domain/errors/not-found.error";
import normalizeName from "@/src/domain/utils/normalize-name";
import { ConflictError } from "@/src/domain/errors/conflict.error";
import { StoreRepository } from "@/src/domain/repositories/store.repository";

export class UpdateStoreUseCase {
    constructor(
        private storeRepository: StoreRepository,
    ) { }

    async execute(input: SaveStoreInputDto): Promise<SaveStoreOutputDto> {
        console.log("INPUT: ", input)
        if(!input.id?.trim()) throw new ValidationError("Id cannot be empty");

        // validação de existencia da loja
        const store = await this.storeRepository.findById(input.id);
        if(!store) throw new NotFoundError("Stock not found");

        // Validação para update no nome
        if(input.name !== undefined) {
            const formattedName = normalizeName(input.name); // forma padrão que vai para o db
            const exists = await this.storeRepository.findByName(formattedName);
            if(exists.length) throw new ConflictError("Stock name already exists");

            store.rename(input.name);
        }else {
            // remover caso entre mais propriedades para atualizar
            throw new ValidationError("No data to update");
        }

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