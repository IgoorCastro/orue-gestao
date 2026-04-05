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
    name?: string,
    colorIds?: string[];
    materialIds?: string[];
    modelIds?: string[];
    size?: ProductSize;
    type?: ProductType,
    barcode?: string,
    mlProductId?: string,
    price?: {
        gte?: number,
        lte?: number,
    },
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
    size?: ProductSize,
    type: ProductType,
    materialIds: string[],
    modelId: string,
    mlProductId?: string,
    barcode?: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt?: Date,
}>

export type FindProductListOutputDto = Readonly<{
    data: FindProductOutputDto[];
    total: number;
    page: number;
    limit: number;
}>