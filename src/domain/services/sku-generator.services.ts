export interface GenerateSkuInput {
    name: string;
    model: string;
    material: string;
    color: string;
    size: string;
}

export interface SkuGenerator {
    generate(input: GenerateSkuInput): string;
}