import { CreateMaterialDto, Material } from "../types/material";
import { api } from "./api";
import { BaseService } from "./base.service";

export class MaterialService extends BaseService<Material> {
  
  async create(data: CreateMaterialDto) {
    const resp = await api.post(this.endpoint, data);
    return resp.data;
  }

  async update(id: string, data: Partial<CreateMaterialDto>) {
    return api.patch(`${this.endpoint}/${id}`, data);
  }

  async delete(id: string) {
    return api.delete(`${this.endpoint}/${id}`);
  }

  async restore(id: string) {
    return api.patch(`${this.endpoint}/${id}/restore`);
  }
}