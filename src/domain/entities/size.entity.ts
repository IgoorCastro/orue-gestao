// entidade de tamanho
import { ItemSize } from "../enums/product-size.enum";

export class Size {
    private readonly _id: string;
    private _size: ItemSize;

    constructor(id: string, size: ItemSize) {
        if(!id) throw new Error("Id cannot be empty");
        this.validateSize(size);

        this._id = id;
        this._size = size;
    }

    get size(): ItemSize {
        return this._size;
    }

    changeSize(size: ItemSize): void {
        this.validateSize(size);
        this._size = size;
    }

    private validateSize(size: ItemSize) {
        if (!size || !Object.values(ItemSize).includes(size)) throw new Error("Size is invalid");
    }
}