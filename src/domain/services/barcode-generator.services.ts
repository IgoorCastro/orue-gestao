export interface BarcodeGeneratorService {
    generate(): Promise<string>;
}