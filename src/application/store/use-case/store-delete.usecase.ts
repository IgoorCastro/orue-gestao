import { ValidationError } from "@/src/domain/errors/validation.error";
import { NotFoundError } from "@/src/domain/errors/not-found.error";
import { StoreRepository } from "@/src/domain/repositories/store.repository";
import { DeleteStoreByIdInputDto } from "../dto/store-delete.dto";

export class DeleteStoreByIdUseCase {
    constructor(private storeRepository: StoreRepository) { }

    async execute({ id }: DeleteStoreByIdInputDto): Promise<void> {
        if(!id?.trim()) throw new ValidationError("Id cannot be empty");

        // busca e validaoção por id
        const store = await this.storeRepository.findById(id);
        if(!store) throw new NotFoundError("Store not found");

        store.delete();

        await this.storeRepository.save(store);
    }
}