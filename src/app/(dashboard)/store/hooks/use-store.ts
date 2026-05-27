// hook de domínio responsável pela gestão do ciclo de vida das lojas

import { feedback } from "@/src/ui/lib/feedback";
import { StoreService } from "@/src/ui/services/store.service";
import { Store } from "@/src/ui/types/store";
import { useEffect, useState } from "react";

const storeService = new StoreService("/store");

export function useStore() {
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshSignal, setRefreshSignal] = useState<boolean>(false);

    useEffect(() => {
        storeService.findAll({ withDeleted: true })
            .then((res) => {
                setStores(res);
                setLoading(false)
            })
            .catch(console.error);
    }, [refreshSignal]);

    const handleConfirmdDeactivation = (storeId: string) => {
        setLoading(true);
        feedback.loading("Desativando loja...");
        storeService.delete(storeId)
            .then(() => {
                feedback.dismiss();
                feedback.success("Loja desativada!");
                setRefreshSignal(prev => !prev);
            })
            .catch(error => {
                feedback.error(error)
                setLoading(false);
            })
    }

    const handleRestoreProduct = (storeId: string) => {
        setLoading(true);
        feedback.loading("Reativando loja...");
        storeService.restore(storeId)
            .then(() => {
                feedback.dismiss();
                feedback.success("Loja reativada!");
                setRefreshSignal(prev => !prev);
            })
            .catch(error => {
                feedback.error(error);
                setLoading(false);
            })
    }

    const isDisableStore = (deletedAt?: string) => {
        return !!deletedAt;
    }

    return {
        // campos/ fields
        stores,
        loading,

        setRefreshSignal,

        handleConfirmdDeactivation,
        handleRestoreProduct,
        isDisableStore,
    }
}