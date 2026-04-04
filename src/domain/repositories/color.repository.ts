// contrato do repositorio de cores
import { Color } from "../entities/color.entity";

export interface ColorRepository {
    findById(id: string): Promise<Color | null>;
    findByIds(ids: string[]): Promise<Color[]>;
    findByName(name: string): Promise<Color[]>;
    findByNames(name: string[]): Promise<Color[]>;
    // findByNames(names: string[]): Promise<Color[]>;
    findAll(): Promise<Color[]>;
    findMany(filters: { name?: string }): Promise<Color[]>;
    existsByName(name: string): Promise<boolean>;
    save(color: Color): Promise<void>;
}