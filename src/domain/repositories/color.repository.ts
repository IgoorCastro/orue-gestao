// contrato do repositorio de cores
import { Color } from "../entities/color.entity";

export interface ColorRepository {
    save(color: Color): Promise<void>;
    findById(id: string): Promise<Color | null>;
    findByColor(color: string): Promise<Color[]>;
    findAll(): Promise<Color[]>;
}