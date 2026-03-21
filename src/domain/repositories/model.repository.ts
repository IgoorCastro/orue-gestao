// contrato para o repositorio do modelo (tipo de roupa: calça, bermuda, camiseta)
import { Model } from "../entities/model.entity";

export interface ModelRepository {
    create(material: Model): Promise<void>;
    findById(id: string): Promise<Model | null>;
    findByName(name: string): Promise<Model[]>;
    findAll(): Promise<Model[]>;
    existsByName(name: string): Promise<boolean>;
    save(material: Model): Promise<void>;
}