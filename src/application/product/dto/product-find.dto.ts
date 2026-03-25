import { ProductSize } from "@/src/domain/enums/product-size.enum";
import { ProductType } from "@/src/domain/enums/product-type.enum";

export type FindProductByIdInputDto = Readonly<{
    id: string;
}>

export type FindProductByNameInputDto = Readonly<{
    name: string;
}>

export type FindProductBySkuInputDto = Readonly<{
    sku: string;
}>

export type FindProductFilteredDto = Readonly<{
    colorIds?: string[];
    materialIds?: string[];
    modelId?: string;
    size?: ProductSize;
    page?: number;
    limit?: number;
    orderBy?: {
        field: "name" | "price" | "createdAt";
        direction: "asc" | "desc";
    };
}>

export type FindProductOutputDto = Readonly<{
    id: string,
    sku: string,
    name: string,
    price: number,
    colorIds: string[],
    size: ProductSize,
    type: ProductType,
    materialIds: string[],
    modelId: string,
    mlProductId?: string,
    barcode?: string,
}>

export type FindProductListOutputDto = Readonly<{
    data: FindProductOutputDto[];
    total: number;
    page: number;
    limit: number;
}>