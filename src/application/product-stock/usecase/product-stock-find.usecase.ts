// Find em composição de produtos com filtro

import { ProductSize } from "@/src/domain/enums/product-size.enum";
import { FindProductStockFilteredDto, FindProductStockListOutputDto, FindProductStockOutputDto } from "../dto/product-stock-find.dto";
import { ProductStockRepository } from "@/src/domain/repositories/product-stock.repository";
import { StockType } from "@/generated/prisma/enums";
import { ProductStock } from "@/src/domain/entities/product-stock.entity";

export class FindProductStocksUseCase {
    constructor(private productStockRepository: ProductStockRepository) { }

    async execute(filters: FindProductStockFilteredDto): Promise<FindProductStockListOutputDto> {
        const page = filters.page && filters.page > 0 ? filters.page : 1;
        const limit = filters.limit && filters.limit > 0 ? filters.limit : 10;

        const { data, total } = await this.productStockRepository.findMany({
            ...filters,
            page,
            limit,
        });

        return {
            data: data.map(ps => this.toOutput(ps)),
            total,
            page,
            limit,
        }
    }

    private  toOutput(ps: ProductStock): FindProductStockOutputDto {
        return {
            id: ps.id,
            productId: ps.productId,
            stockId: ps.stockId,
            quantity: ps.quantity,
            createdAt: ps.createdAt,
            updatedAt: ps.updatedAt,
            deletedAt: ps.deletedAt,

            product: ps.product
                ? {
                    id: ps.product.id,
                    name: ps.product.name,
                    price: ps.product.price,
                    barcode: ps.product.barcode,
                    size: ps.product.size as ProductSize,
                    sku: ps.product.sku,
                    type: ps.product.type,
                    colorsName: ps.product.productColor?.map(ps => ps.color.name)
                }
                : undefined,
                
            stock: ps.stock
                ? {
                    id: ps.stock.id,
                    name: ps.stock.name,
                    type: ps.stock.type as StockType,
                    store: ps.stock.store,
                }
                : undefined,
        }
    }
}