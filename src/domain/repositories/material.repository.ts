// contrato do repositorio do material do produto
import { Material } from "../entities/material.entity";

export interface MaterialRepository {
    findById(id: string): Promise<Material | null>;
    findByIds(ids: string[]): Promise<Material[]>;
    findByName(name: string): Promise<Material[]>;
    findByNames(name: string[]): Promise<Material[]>;
    // findByNames(ids: string[]): Promise<Material[]>;
    findAll(): Promise<Material[]>;
    findMany(filters: { name?: string }): Promise<Material[]>;
    existsById(id: string): Promise<boolean>; // verifica se existe um material por pesquisa em id no db
    existsByName(name: string): Promise<boolean>; // verifica se existe um material por pesquisa nome no db
    save(material: Material): Promise<void>;
}