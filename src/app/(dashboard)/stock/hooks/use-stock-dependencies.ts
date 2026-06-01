// retorna toda dependencia necessaria para criar um novo produto
// loading disponivel

import { useEffect, useState } from "react";

import { Store } from "@/src/ui/types/store";
import { StoreService } from "@/src/ui/services/store.service";

const storeService = new StoreService("/store");

export function useStockDependencies() {
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        storeService.findAll()
            .then(res => setStores(res))
            .catch(console.error)
            .finally(() => setLoading(false))
    }, []);

    return {
        stores,
        loading,
    };
}