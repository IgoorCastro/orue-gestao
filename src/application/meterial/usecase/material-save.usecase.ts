import { MaterialRepository } from "@/src/domain/repositories/material.repository";
import { StockRepository } from "@/src/domain/repositories/stock.repository";
import { SaveMaterialDto } from "../dto/material-save.dto";

export class UpdateMaterialUseCase {
    constructor(
        private materialRepository: MaterialRepository,
    ) { }

    async execute({ id, name }: SaveMaterialDto): Promise<SaveMaterialDto> {
        const existingMaterial = await this.materialRepository.findById(id);
        if(!existingMaterial) throw new Error("Material not found");

        if(name) existingMaterial.rename(name);

        await this.materialRepository.save(existingMaterial);

        return {
            id: existingMaterial.id,
            name: existingMaterial.name,
        }
    }
}