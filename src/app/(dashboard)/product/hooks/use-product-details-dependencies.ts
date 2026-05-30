import { ProductComponentService } from "@/src/ui/services/product-component.service";
import { ProductComponent } from "@/src/ui/types/product-component";
import { useEffect, useMemo, useState } from "react";

const pcService = new ProductComponentService("/productComponent");

export function useProductDetailsDependencies(filter?: { parentId: string }) {
    const [productComponents, setProductComponents] = useState<ProductComponent[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // só faz a request se tiver filtro
        if (filter) {
            async function load() {
                const pcs = await pcService.findAll(filter);

                setProductComponents(pcs);
                setLoading(false);
            }
            load();
        } else
            setLoading(false)
    }, [])

    return {
        productComponents,
        loading,
    }
}