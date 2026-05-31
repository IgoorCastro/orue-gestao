// Mapeamento para exibição
// dos tipos de produtos

import { ProductType } from "../../enum/product-type";

export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
    PRODUCT : "Produto`",
    KIT : "Kit",
    PACKAGE : "Pacote",
}