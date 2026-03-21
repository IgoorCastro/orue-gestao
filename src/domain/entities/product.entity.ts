// entidade do produto
// barcode podera sera adicionado
// em um segundo momento

import { ProductType } from "../enums/product-type.enum";
import capitalizeFirstLetter from "../utils/capitalize-first-letter";
import normalizeName from "../utils/normalize-name";
import { ProductColor } from "./product-color";
import { ProductMaterial } from "./product-material";
import { ProductSize } from "../enums/product-size.enum";

type ProductProps = Readonly<{
    id: string,
    sku: string,
    name: string,
    price: number,
    size: ProductSize,
    modelId: string,
    mlProductId?: string,
    barcode?: string,
    type: ProductType,
    createdAt: Date,
    updatedAt: Date,
    deletedAt?: Date,
}>

export class Product {
    private readonly _id: string;
    private _sku: string;
    private _name: string;
    private _type: ProductType;
    private _price: number;
    private _size: ProductSize;
    private _modelId: string;
    private _materials: ProductMaterial[];
    private _colors: ProductColor[];
    private _mlProductId?: string; // vínculo futuro com ML
    private _barcode?: string;
    private _createdAt: Date;
    private _updatedAt: Date;
    private _deletedAt?: Date;

    private constructor(props: ProductProps) {
        if (!props.id?.trim()) throw new Error("Id cannot be empty");
        this.validateSize(props.size);
        this.validateModel(props.modelId);
        Product.validateName(props.name);
        this.validatePrice(props.price);
        this.validateSku(props.sku);
        this.validateType(props.type);
        if (props.barcode !== undefined) this.validateBarCode(props.barcode);

        this._id = props.id;
        this._name = props.name;
        this._price = props.price;
        this._type = props.type;
        this._sku = props.sku;
        this._barcode = props.barcode;
        this._size = props.size;
        this._modelId = props.modelId;
        this._materials = [];
        this._colors = [];
        this._mlProductId = props.mlProductId;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
        this._deletedAt = props.deletedAt;
    }

    static create(props: {
        id: string,
        name: string,
        price: number,
        type: ProductType,
        sku: string,
        barcode?: string,
        size: ProductSize,
        modelId: string,
        mlProductId?: string,
    }): Product {
        const now = new Date();

        return new Product({
            id: props.id,
            name: Product.formatName(props.name),
            price: props.price,
            type: props.type,
            sku: props.sku,
            barcode: props.barcode,
            size: props.size,
            modelId: props.modelId,
            mlProductId: props.mlProductId,
            createdAt: now,
            updatedAt: now,
            deletedAt: undefined,
        });
    }

    static restore(props: ProductProps & { colors: ProductColor[], materials: ProductMaterial[] }): Product {
        const product = new Product(props);

        product._colors = props.colors;
        product._materials = props.materials;

        return product;
    }

    get id(): string {
        return this._id;
    }

    get sku(): string {
        return this._sku;
    }

    changeSku(sku: string): void {
        if (sku === this._sku) return;
        this.validateSku(sku);

        this._sku = sku;
        this.touch();
    }

    get name(): string {
        return this._name;
    }

    rename(name: string): void {
        const formattedName = Product.formatName(name);
        if (formattedName === this._name) return;

        this._name = formattedName;
        this.touch();
    }

    get price(): number {
        return this._price;
    }

    changePrice(price: number): void {
        if (price === this.price) return;
        this.validatePrice(price);

        this._price = price;
        this.touch();
    }

    get type(): ProductType {
        return this._type;
    }


    changeType(type: ProductType): void {
        if (type === this.type) return;
        this.validateType(type);

        this._type = type;
        this.touch();
    }

    get size(): ProductSize {
        return this._size;
    }

    changeSize(size: ProductSize): void {
        if (size === this.size) return;
        this.validateSize(size);

        this._size = size;
        this.touch();
    }

    get modelId(): string {
        return this._modelId;
    }

    changeModel(modelId: string): void {
        if (modelId === this.modelId) return;
        this.validateModel(modelId);

        this._modelId = modelId;
        this.touch();
    }

    get mlProductId(): string | undefined {
        return this._mlProductId;
    }

    changeMlProductId(mlProductId: string) {
        if (mlProductId === this.mlProductId) return;
        this.validateMlProductId(mlProductId);

        this._mlProductId = mlProductId;
        this.touch();
    }

    get barcode(): string | undefined {
        return this._barcode;
    }

    changeBarcode(barcode?: string): void {
        if (barcode === this._barcode) return;

        // adicionar um novo barcode
        if (barcode !== undefined) this.validateBarCode(barcode);

        // remove o barcode atual 'barcode undefined'
        this._barcode = barcode;
        this.touch();
    }

    get colors(): ProductColor[] {
        return [...this._colors];
    }

    addColor(input: { id: string; colorId: string }): void {
        if (!input.colorId?.trim()) throw new Error("Color id cannot be empty");
        // evita duplicidade
        if (this._colors.some(color => color.colorId === input.colorId)) throw new Error("Color already exists");

        this._colors.push(new ProductColor({
            id: input.id,
            productId: this._id,
            colorId: input.colorId,
        }));

        this.touch();
    }

    removeColor(colorId: string): void {
        // salva o tamanho inicial
        const initialLength = this._colors.length;

        this._colors = this._colors.filter(color => color.colorId !== colorId);

        // se tiver alteração no tamanho inicial, touch!
        if (this._colors.length !== initialLength) this.touch();
    }

    get materials(): ProductMaterial[] {
        return [...this._materials];
    }

    addMaterial(input: { id: string; materialId: string }): void {
        if (!input.materialId?.trim()) throw new Error("Material id cannot be empty");
        // evita duplicidade
        if (this._materials.some(material => material.materialId === input.materialId)) throw new Error("Material already exists");

        this._materials.push(new ProductMaterial({
            id: input.id,
            productId: this._id,
            materialId: input.materialId,
        }));

        this.touch();
    }

    removeMaterial(materialId: string): void {
        // salva o tamanho inicial
        const initialLength = this._materials.length;

        this._materials = this._materials.filter(material => material.materialId !== materialId);

        // se tiver alteração no tamanho inicial, touch!
        if (this._materials.length !== initialLength) this.touch();
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    get deletedAt(): Date | undefined {
        return this._deletedAt;
    }

    private validatePrice(price: number): void {
        if (price < 0 || !Number.isFinite(price)) throw new Error("Invalid price");
    }

    private static validateName(name: string): void {
        if (!name?.trim()) throw new Error("Name cannot be empty");
    }

    private validateSku(sku: string): void {
        if (!sku?.trim()) throw new Error("Sku cannot be empty");
    }

    private validateSize(size: ProductSize): void {        
        if (!Object.values(ProductSize).includes(size)) throw new Error("Product size is invalid");
    }

    private validateModel(model: string): void {
        if (!model?.trim()) throw new Error("Model cannot be empty");
    }

    private validateMlProductId(mlProductId: string): void {
        if (!mlProductId?.trim()) throw new Error("ID Mercado Livre is invalid");
    }

    private validateBarCode(barcode: string): void {
        if (!barcode?.trim()) throw new Error("Barcode cannot be empty");
    }

    private validateType(type: ProductType): void {
        if (!Object.values(ProductType).includes(type)) throw new Error("Product type is invalid");
    }

    private static formatName(name: string): string {
        const normalized = normalizeName(name);
        Product.validateName(normalized);

        return capitalizeFirstLetter(normalized);
    }

    private touch(): void {
        this._updatedAt = new Date();
    }
}