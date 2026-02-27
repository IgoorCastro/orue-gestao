// contrato para o repositorio do modelo (tipo de roupa: calça, bermuda, camiseta)
import { Model } from "../entities/model.entity";

export interface ModelRepository {
    save(material: Model): Promise<void>;
    findById(id: string): Promise<Model | null>;
    findByModel(model: string): Promise<Model[]>;
    findAll(): Promise<Model[]>;
}