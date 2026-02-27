// entidade do estoque
import { StockType } from "../enums/stock-type.enum";

export class Stock {
    private readonly _id: string;
    private readonly _storeId?: string;
    private _name: string;
    private _isActive: boolean;
    private _type: StockType;

    constructor(id: string, name: string, isActive: boolean = true, type: StockType, storeId?: string) { 
        if(!id) throw new Error("Id cannot be empty");
        this.validateName(name);
        this.validateType(type, storeId);

        this._id = id;
        this._name = name;
        this._isActive = isActive;
        this._type = type;
        this._storeId = storeId;
    }

    get id(): string {
        return this._id;
    }

    get storeId(): string | undefined {
        return this._storeId;
    }

    get name(): string {
        return this._name;
    }

    rename(name: string): void {
        this.validateName(name);
        this._name = name;
    }

    isActive(): boolean {
        return this._isActive;
    }

    activate(): void {
        if(this._isActive) return;
        this._isActive = true;
    }

    deactivate(): void {
        if(!this._isActive) return;
        this._isActive = false;
    }

    isMainStock(): boolean {
        return this._type === StockType.MAIN;
    }

    get type(): StockType {
        return this._type;
    }

    changeType(type: StockType): void {
        this._type = type;
    }

    private validateName(name: string): void {
        if(!name || name.trim().length === 0) throw new Error("Name is invalid");
    }

    private validateType(type: StockType, storeId?: string): void {
        // apenas 2 tipos de estoque
        if(Object.values(StockType).includes(type)) throw new Error("Stock type is invalid");
        // stoque de loja precisa ter a referencia da mesma
        if(type === StockType.STORE && !storeId) throw new Error("Store stock must have storeId")
    }
}