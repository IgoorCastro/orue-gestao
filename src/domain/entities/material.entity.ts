import capitalizeFirstLetter from "../utils/capitalize-first-letter";

// material do produto (100% algodão / 80% algodão, 20% poliester)
export class Material {
    private readonly _id: string;
    private _name: string;

    constructor(name: string, id: string) {
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
        this._name = capitalizeFirstLetter(name);
    }

    private validateName(name: string): void {
        if(!name || name.trim().length === 0) throw new Error("Material name cannot be empty");
    } 
}