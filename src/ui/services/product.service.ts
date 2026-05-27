import { CreateProductDto, Product, UpdateProductDto } from "../types/product";
import { api } from "./api";
import { BaseServicePaginated } from "./base-pagination.service";

export class ProductService extends BaseServicePaginated<Product> {
  
  async create(data: CreateProductDto) {
    const resp = await api.post(this.endpoint, data);
    return resp.data;
  }

  async update(id: string, data: Partial<UpdateProductDto>) {
    return api.patch(`${this.endpoint}/${id}`, data);
  }

  async delete(id: string) {
    return api.delete(`${this.endpoint}/${id}`);
  }

  async restore(id: string) {
    return api.patch(`${this.endpoint}/${id}/restore`)
  }
}