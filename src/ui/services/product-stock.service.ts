import { CreateProductStockDto, FindProductStockInputDto, PaginatedProductStock, ProductStock } from "../types/product-stock";
import { api } from "./api";
import { BaseServicePaginated } from "./base-pagination.service";

export class ProductStockService extends BaseServicePaginated<ProductStock> {

  async findByStock(input: FindProductStockInputDto): Promise<PaginatedProductStock> {
    const { data } = await api.get(this.endpoint, {
      params: { ...input },
    })
    console.log("DATA: ", data)
    return data;
  }

  // retorna o valro total em estoque
  // enviar um stockId para tratar um estoque especifico
  async getTotalValue(filters?: { stockId?: string; productId?: string }): Promise<number> {
    const value = await api.get(`${this.endpoint}/total-value`, {
      params: { ...filters }
    })
    return value.data;
  }

  async create(data: CreateProductStockDto) {
    const resp = await api.post(this.endpoint, data);
    return resp.data;
  }

  // update(id: string, data: Partial<CreateProductStockDto>) {
  //   return api.put(`${this.endpoint}/${id}`, data);
  // }

  delete(id: string) {
    return api.delete(`${this.endpoint}/${id}`);
  }

  restore(id: string) {
    return api.patch(`${this.endpoint}/${id}/restore`);
  }
}