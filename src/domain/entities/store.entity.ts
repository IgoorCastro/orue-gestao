import capitalizeFirstLetter from "../utils/capitalize-first-letter";

// entidade da loja
export class Store {
    private readonly _id: string;
    private _name: string;

    constructor(id: string, name: string) {
        if(!id) throw new Error("Id is required");
        this.validateName(name);

        this._id = id;
        this._name = capitalizeFirstLetter(name);
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    rename(name: string): void {
        this.validateName(name);
        this._name = name;
    }

    private validateName(name: string) {
        if (!name || name.trim().length === 0) throw new Error("Name cannot be empty")
    }
}