// hook de domínio responsável pela gestão do ciclo de vida dos materiais

import { feedback } from "@/src/ui/lib/feedback";
import { MaterialService } from "@/src/ui/services/material.service";
import { Material } from "@/src/ui/types/material";
import { useEffect, useState } from "react";

const materialService = new MaterialService("/material");

export function useMaterial() {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshSignal, setRefreshSignal] = useState<boolean>(false);

    useEffect(() => {
        materialService.findAll({ withDeleted: true })
            .then((res) => {
                setMaterials(res);
                setLoading(false);
            })
            .catch(console.error);
    }, [refreshSignal]);

    const handleConfirmdDeactivation = (modelId: string) => {
        setLoading(true);
        feedback.loading("Desativando material...");
        materialService.delete(modelId)
            .then(() => {
                feedback.dismiss();
                feedback.success("Material desativada!");
                setRefreshSignal(prev => !prev);
            })
            .catch(err => {
                feedback.error(err);
                setLoading(false);
            });
    }

    const handleRestoreMaterial = (modelId: string) => {
        setLoading(true);
        feedback.loading("Reativando material...");
        materialService.restore(modelId)
            .then(() => {
                feedback.dismiss();
                feedback.success("Material reativado!");
                setRefreshSignal(prev => !prev);
            })
            .catch(err => {
                feedback.error(err);
                setLoading(false);
            })
    }

    const isDisableMaterial = (deletedAt?: string) => {
        return !!deletedAt;
    }

    return {
        materials,
        loading,
        
        setRefreshSignal,

        handleConfirmdDeactivation,
        handleRestoreMaterial,
        isDisableMaterial,
    }
}