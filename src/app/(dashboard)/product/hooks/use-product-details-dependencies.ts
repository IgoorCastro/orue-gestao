import { feedback } from "@/src/ui/lib/feedback";
import { ProductComponentService } from "@/src/ui/services/product-component.service";
import { ProductComponent } from "@/src/ui/types/product-component";
import { useEffect, useState } from "react";

const pcService = new ProductComponentService("/productComponent");

export function useProductDetailsDependencies(filter?: { parentId: string }) {
    const [productComponents, setProductComponents] = useState<ProductComponent[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // só faz a request se tiver filtro
        setLoading(true);
        if (filter) {
            pcService.findAll(filter)
                .then((res) => {
                    setProductComponents(res);
                    setLoading(false);
                })
                .catch(feedback.error)
                .finally(() => setLoading(false))
        }else
            setLoading(false);
        
    }, [])

    return {
        productComponents,
        loading,
    }
}