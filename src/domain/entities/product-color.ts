// entidade de relação entre produtos e cores

type ProductColorProps = Readonly<{
    id: string, productId: string, colorId: string,
}>

export class ProductColor {
    private readonly _id: string;
    private _productId: string;
    private _colorId: string;

    constructor(props: ProductColorProps) {
        if(!props.id?.trim()) throw new Error("Id cannot be empty");
        this.validateProductId(props.productId);
        this.validateColorId(props.colorId);

        this._id = props.id;
        this._productId = props.productId;
        this._colorId = props.colorId;
    }

    get id(): string {
        return this._id;
    }

    get productId(): string {
        return this._productId;
    }

    // talvez nunca seja usado!
    changeProductId(productId: string): void {
        if(productId === this._productId) return;
        this.validateProductId(productId);
        this._productId = productId;
    }

    get colorId(): string {
        return this._colorId;
    }

    changeColorId(colorId: string): void {
        if(colorId === this._colorId) return;
        this.validateColorId(colorId);

        this._colorId = colorId;
    }

    private validateProductId(productId: string): void {
        if(!productId?.trim()) throw new Error("Product Id cannot be empty");
    }

    private validateColorId(color: string): void {
        if(!color?.trim()) throw new Error("Color Id cannot be empty");
    }
}