// usecase para restaurar uma loja 'deleteada'

import { ValidationError } from "@/src/domain/errors/validation.error";
import { NotFoundError } from "@/src/domain/errors/not-found.error";
import { RestoreStoreByIdInputDto } from "../dto/store-restore.dto";
import { StoreRepository } from "@/src/domain/repositories/store.repository";

export class RestoreStoreByIdUseCase {
    constructor(private readonly storeRepository: StoreRepository) { }

    async execute({ id }: RestoreStoreByIdInputDto): Promise<void> {
        if(!id?.trim()) throw new ValidationError("Id cannot be empty");

        const store = await this.storeRepository.findById(id);
        if(!store) throw new NotFoundError("Store not found");

        store.restoreDeleted();

        await this.storeRepository.save(store);
    }
}