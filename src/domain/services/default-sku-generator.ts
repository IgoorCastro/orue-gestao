import { GenerateSkuInput, SkuGenerator } from "./sku-generator.services";

export class DefaultSkuGenerator implements SkuGenerator {
    generate({ name, model, material, size, color }: GenerateSkuInput): string {
        const part = (value: string) =>
            value.substring(0, 3).toUpperCase();

        return `${part(name)}-${part(model)}-${part(material)}-${size.toUpperCase()}`;
    }
}