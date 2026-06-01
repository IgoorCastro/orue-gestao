// hook de domínio responsável pela gestão do ciclo de vida dos modelos

import { feedback } from "@/src/ui/lib/feedback";
import { ModelService } from "@/src/ui/services/model.service";
import { Material } from "@/src/ui/types/material";
import { useEffect, useState } from "react";

const modelService =new ModelService("/model");

export function useModel() {
    const [models, setModels] = useState<Material[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshSignal, setRefreshSignal] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        modelService.findAll({ withDeleted: true })
            .then((res) => setModels(res))
            .catch(feedback.error)
            .finally(() => setLoading(false))
    }, [refreshSignal]);

    const handleConfirmdDeactivation = (modelId: string) => {
        setLoading(true);
        feedback.loading("Desativando modelo...");
        modelService.delete(modelId)
            .then(() => {
                feedback.dismiss();
                feedback.success("Modelo desativada!");
                setRefreshSignal(prev => !prev);
            })
            .catch(feedback.error)
            .finally(() => setLoading(false))
    }

    const handleRestoreProduct = (modelId: string) => {
        setLoading(true);
        feedback.loading("Reativando modelo...");
        modelService.restore(modelId)
            .then(() => {
                feedback.dismiss();
                feedback.success("Modelo reativado!");
                setRefreshSignal(prev => !prev);
            })
            .catch(err => {
                feedback.error(err);
                setLoading(false);
            })
    }

    const isDisableModel = (deletedAt?: string) => {
        return !!deletedAt;
    }

    return {
        //campos
        models,
        loading,
        refreshSignal,

        //setters
        setModels,
        setLoading,
        setRefreshSignal,

        // funções
        handleConfirmdDeactivation,
        handleRestoreProduct,
        isDisableModel,
    }
}