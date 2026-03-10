import capitalizeFirstLetter from "../utils/capitalize-first-letter";

// entidade de cores do produto (amarelo, verde, azul..)
type ColorProps = {
    id: string,
    name: string,
}

export class Color{ 
    private readonly _id: string;
    private _name: string;

    constructor({ id, name }: ColorProps) {
        if(!id) throw new Error("Id cannot be empty");
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
        if(!name || name.trim().length === 0) throw new Error("Color name cannot be empty");
    }
}