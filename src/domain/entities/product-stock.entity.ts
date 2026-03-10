// Entidade do item presente em um estoque

type ProductStockProps = {
    id: string,
    stockId: string,
    productId: string,
    quantity: number,
}

export class ProductStock {
    private readonly _id: string;
    private _stockId: string;
    private _productId: string;
    private _quantity: number;

    constructor({ id, productId, quantity, stockId }: ProductStockProps) {
        if(!id) throw new Error("Id cannot be empty");
        if(!stockId) throw new Error("Stock id cannot be empty");
        this.validateProductId(productId);
        this.validateQuantity(quantity);

        this._id = id;
        this._productId = productId;
        this._stockId = stockId;
        this._quantity = quantity;
    }

    get id(): string {
        return this._id;
    }

    get stockId(): string {
        return this._stockId;
    }

    changeStockId(id: string): void {
        this.validateStockId(id);
        this._stockId = id;
    }

    get productId(): string {
        return this._productId;
    }

    changeProductId(id: string): void {
        this.validateProductId(id);
        this._productId = id;
    }

    get quantity(): number {
        return this._quantity;
    };

    increase(amount: number): void {
        this.validateQuantity(amount);
        this._quantity += amount;
    }

    decrease(amount: number): void {
        this.validateQuantity(amount);
        if (this.quantity < 1) throw new Error("Insufficient stock")
        this._quantity -= amount;
    }

    private validateQuantity(quantity: number): void {
        if (!Number.isSafeInteger(quantity) || quantity < 0) throw new Error("Invalid quantity");
    }

    private validateProductId(productId: string): void {
        if(!productId || productId.trim().length === 0) throw new Error("Product id cannot be empty");
    }

    private validateStockId(stockId: string): void {
        if(!stockId || stockId.trim().length === 0) throw new Error("Stock id cannot be empty");
    }
}