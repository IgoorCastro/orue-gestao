// contrato do repositorio de cores
import { Color } from "../entities/color.entity";

export interface ColorRepository {
    create(color: Color): Promise<void>;
    findById(id: string): Promise<Color | null>;
    findByName(name: string): Promise<Color[]>;
    findAll(): Promise<Color[]>;
    save(color: Color): Promise<void>;
}