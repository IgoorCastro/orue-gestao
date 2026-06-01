import { ProductSize } from "../enum/product-size";
import { ProductType } from "../enum/product-type";
import { Color } from "./color";
import { Material } from "./material";

export type ProductColor = Readonly<{
    id: string,
    productId: string,
    colorId: string,

    color: Color;
}>;

export type ProductMaterial = Readonly<{
    id: string,
    productId: string,
    materialId: string,

    material: Material,
}>;

export type Product = {
    id: string;
    name: string;
    type: ProductType;
    price: number;
    size?: ProductSize;

    modelId?: string;
    materialIds?: string[];
    colorIds?: string[];
    mlProductId?: string;

    productColor: ProductColor[],
    productMaterial: ProductMaterial[],

    sku?: string;
    barcode: string;

    createdAt?: string; // importante!
    updatedAt?: string;
    deletedAt?: string;
};

export type PaginatedProduct = {
    data: Product[],    

    page: number,
    limit: number,
    total: number,
}

export type CreateProductDto = {
    name: string;
    type: string; // ou enum depois
    price: number;
    size?: string;

    modelId?: string;
    materialIds?: string[];
    colorIds?: string[];
    mlProductId?: string;

    sku?: string;
    barcode?: string;

    createdAt?: string; // importante!
    updatedAt?: string;
    deletedAt?: string;
};

export type UpdateProductDto = {
    id: string,
    name: string;
    type: string; // ou enum depois
    price: number;
    size?: string;

    modelId?: string;
    materialIds?: string[];
    colorIds?: string[];
    mlProductId?: string;

    sku?: string;
    barcode?: string;

    createdAt: string; // importante!
    updatedAt: string;
    deletedAt?: string;
};