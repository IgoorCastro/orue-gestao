// retorna toda dependencia necessaria para criar um novo produto
// loading disponivel

import { useEffect, useState } from "react";
import { ModelService } from "@/src/ui/services/model.service";
import { ColorService } from "@/src/ui/services/color.service";
import { MaterialService } from "@/src/ui/services/material.service";
import { Model } from "@/src/ui/types/model";
import { Color } from "@/src/ui/types/color";
import { Material } from "@/src/ui/types/material";
import { PaginatedProduct } from "@/src/ui/types/product";
import { ProductService } from "@/src/ui/services/product.service";
import { feedback } from "@/src/ui/lib/feedback";

const colorService = new ColorService("/color");
const materialService = new MaterialService("/material");
const modelService = new ModelService("/model");
const productService = new ProductService("/product");

export function useProductDependencies() {
    const [models, setModels] = useState<Model[]>([]); // modelos
    const [colors, setColors] = useState<Color[]>([]); // cores
    const [materials, setMaterials] = useState<Material[]>([]); // materiais
    const [products, setProducts] = useState<PaginatedProduct>({ data: [], limit: 0, page: 0, total: 0 }); // produtos com paginação
    const [loading, setLoading] = useState(true); // loading dos dados


    useEffect(() => {
        async function load() {
            try {
                const [modelsRes, colorsRes, materialsRes, productRes] = await Promise.all([
                    modelService.findAll(),
                    colorService.findAll(),
                    materialService.findAll(),
                    productService.findAll(),
                ]);
                
                setModels(modelsRes);
                setColors(colorsRes);
                setMaterials(materialsRes);
                setProducts(productRes);
            } catch {
                feedback.error
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    return {
        models,
        colors,
        materials,
        products,
        loading,
    };
}