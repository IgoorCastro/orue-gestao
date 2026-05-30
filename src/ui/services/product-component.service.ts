import { CreateProductComponentDto, ProductComponent } from "../types/product-component";
import { api } from "./api";
import { BaseService } from "./base.service";


export const productComponentService = new BaseService<ProductComponent>("/productComponent");

export class ProductComponentService extends BaseService<ProductComponent> {  
  async create(data: CreateProductComponentDto) {
    const resp = await api.post(this.endpoint, data);
    return resp.data;
  }

  async update(id: string, data: Partial<CreateProductComponentDto>) {
    return api.put(`${this.endpoint}/${id}`, data);
  }

  async delete(id: string) {
    return api.delete(`${this.endpoint}/${id}`);
  }
}