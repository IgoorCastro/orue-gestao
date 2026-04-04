// contrato para o repositorio do modelo (tipo de roupa: calça, bermuda, camiseta)
import { Model } from "../entities/model.entity";

export interface ModelRepository {
    findById(id: string): Promise<Model | null>;
    findByName(name: string): Promise<Model[]>;    
    findByNames(names: string[]): Promise<Model[]>;
    findAll(): Promise<Model[]>;
    findMany(filters: { name?: string }): Promise<Model[]>;
    existsByName(name: string): Promise<boolean>;
    save(model: Model): Promise<void>;
}