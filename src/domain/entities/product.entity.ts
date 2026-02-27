// entidade do produto
// barcode podera sera adicionado
// em um segundo momento

type ProductProps = {
    id: string, sku: string, name: string,
    price: number, colorId: string, sizeId: string,
    materialId: string, modelId: string, mlProductId?: string,
    barcode?: string
}

export class Product {
    public readonly _id: string;
    private readonly _sku: string;
    private _name: string;
    private _price: number;
    private _colorId: string;
    private _sizeId: string;
    private _materialId: string;
    private _modelId: string;
    private _mlProductId?: string; // vínculo futuro com ML
    private _barcode?: string;

    constructor( props: ProductProps ) {
        if(!props.id) throw new Error("Id cannot be empty")
        this.validateSku(props.sku);
        this.validateColor(props.colorId);
        this.validateSize(props.sizeId);
        this.validateMaterial(props.materialId);
        this.validateModel(props.modelId);
        this.validateName(props.name);
        this.validatePrice(props.price);
        this.validateSku(props.sku);

        this._id = props.id;
        this._sku = props.sku;
        this._name = props.name;
        this._price = props.price;
        this._colorId = props.colorId;
        this._sizeId = props.sizeId;
        this._materialId = props.materialId;
        this._modelId = props.modelId;
        this._mlProductId = props.mlProductId;
        this._barcode = props.barcode;
    }

    get id(): string {
        return this._id;
    }

    get sku(): string {
        return this._sku;
    }

    get name(): string {
        return this._name;
    }

    rename(name: string): void {
        this.validateName(name);
        this._name = name;
    }

    get price(): number {
        return this._price;
    }

    changePrice(price: number): void {
        this.validatePrice(price);
        this._price = price;
    }

    get colorId(): string {
        return this._colorId;
    }

    changeColor(colorId: string): void {
        this.validateColor(colorId);
        this._colorId = colorId;
    }

    get sizeId(): string {
        return this._sizeId;
    }

    changeSize(sizeId: string): void {
        this.validateSize(sizeId);
        this._sizeId = sizeId;
    }

    get materialId(): string {
        return this._materialId;
    }

    changeMaterial(materialId: string): void {
        this.validateMaterial(materialId);
        this._materialId = materialId;
    }

    get modelId(): string {
        return this._modelId;
    }

    changeModel(modelId: string): void {
        this.validateModel(modelId);
        this._modelId = modelId;
    }

    get mlProductId(): string | undefined {
        return this._mlProductId;
    }

    changeMlProductId(mlProductId: string) {
        this.validateMlProductId(mlProductId);
        this._mlProductId = mlProductId;
    }

    get barcode(): string | undefined {
        return this._barcode;
    }

    changeBarcode(barcode: string): void {
        this.validateBarCode(barcode);
        this._barcode = barcode;
    }

    private validatePrice(price: number): void {
        if (price < 0 || !Number.isFinite(price)) throw new Error("Price cannot be negative");
    }

    private validateName(name: string): void {
        if (!name|| name.trim().length === 0) throw new Error("Name cannot be empty");
    }

    private validateSku(sku: string): void {
        if (!sku || sku.trim().length === 0) throw new Error("Sku cannot be empty");
    }

    private validateColor(colorId: string): void {
        if (!colorId || colorId.trim().length === 0) throw new Error("Color cannot be empty");
    }

    private validateSize(size: string): void {
        if (!size || size.trim().length === 0) throw new Error("Color cannot be empty");
    }

    private validateMaterial(material: string): void {
        if (!material || material.trim().length === 0) throw new Error("Material cannot be empty");
    }

    private validateModel(model: string): void {
        if (!model || model.trim().length === 0) throw new Error("Model cannot be empty");
    }

    private validateMlProductId(mlProductId: string): void {
        if (!mlProductId || mlProductId.trim().length === 0) throw new Error("ID Mercado Livre is invalid");
    }

    private validateBarCode(barcode: string): void {
        if (!barcode || barcode.trim().length === 0) throw new Error("Barcode cannot be empty");
    }
}