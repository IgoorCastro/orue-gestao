import { ProductRepository } from "@/src/domain/repositories/product.repository";
import { SaveProductInputDto, SaveProductOutputDto } from "../dto/product-save.dto";
import { SkuGeneratorService } from "@/src/domain/services/sku-generator.services";

export class SaveProductUseCase {
    constructor(
        private productRepository: ProductRepository,
        private skuGen: SkuGeneratorService,
    ) { }

    async execute(input: SaveProductInputDto): Promise<SaveProductOutputDto> {
        const { colorId, id, materialId, modelId, name, price, sizeId, barcode, mlProductId } = input;
        let shouldRecalculateSku = false; // controle para gerar novo sku

        const existingProduct = await this.productRepository.findById(id);
        if (!existingProduct) throw new Error("Product not found");

        if (price) existingProduct.changePrice(price);
        if (barcode) existingProduct.changeBarcode(barcode);
        if (mlProductId) existingProduct.changeMlProductId(mlProductId);

        if (colorId) {
            existingProduct.changeColor(colorId);
            shouldRecalculateSku = true;
        }
        if (materialId) {
            existingProduct.changeMaterial(materialId);
            shouldRecalculateSku = true;
        }
        if (modelId) {
            existingProduct.changeModel(modelId);
            shouldRecalculateSku = true;
        }
        if (name) {
            existingProduct.rename(name);
            shouldRecalculateSku = true;
        }
        if (sizeId) {
            existingProduct.changeSize(sizeId)
            shouldRecalculateSku = true;
        };

        // alterar sku sempre que houver alteração
        // em suas propriedades
        if (shouldRecalculateSku)
            existingProduct.changeSku(this.skuGen.generate({
                name,
                model: existingProduct.name,
                material: existingProduct.materialId,
                size: existingProduct.sizeId,
                color: existingProduct.name,
            }));

        await this.productRepository.save(existingProduct);

        return {
            id: existingProduct.id,
            colorId: existingProduct.colorId,
            materialId: existingProduct.materialId,
            modelId: existingProduct.modelId,
            name: existingProduct.name,
            price: existingProduct.price,
            sizeId: existingProduct.sizeId,
            sku: existingProduct.sku,
            barcode: existingProduct.barcode,
            mlProductId: existingProduct.mlProductId,
        }
    }
}