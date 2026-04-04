// gera o SKU padronizado
// exemplo: 
// nome: Camiseta Dry Fit
// modelo: Camiseta
// material: Algodão, Poliester
// tamanho: P
// cor: Preto 
// resultado: CAM/DRY/FIT-CAM-ALG/POL-P-PRE
import { GenerateSkuInput, SkuGeneratorService } from "./sku-generator.services";

export class DefaultSkuGenerator implements SkuGeneratorService {
    generate({ name, model, material, size, color, type }: GenerateSkuInput): string {

        const part = (value: string) =>
            value.substring(0, 3).toUpperCase();

        const splitAndFormat = (value: string) =>
            value
                .split(" ")
                .map(part)
                .join("/");

        const skuName = splitAndFormat(name);      // CAM/DRY/FIT
        const skuModel = part(model);              // CAM

        const skuMaterial = material
            .map(part)
            .join("/");                           // ALG/POL

        const skuColor = color
            .map(part)
            .join("/");                           // PRE

        return `${skuName}-${skuModel}-${skuMaterial}-${skuColor}-${size ? size.toUpperCase() : type}`;
    }
}