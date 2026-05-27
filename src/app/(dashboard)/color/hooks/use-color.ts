// hook de domínio responsável pela gestão do ciclo de vida dos materiais

import { feedback } from "@/src/ui/lib/feedback";
import { ColorService } from "@/src/ui/services/color.service";
import { Color } from "@/src/ui/types/color";
import { useEffect, useState } from "react";

const colorService = new ColorService("/color");

export function useColor() {
    const [colors, setColors] = useState<Color[]>([]);
    const [refreshSignal, setRefreshSignal] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        colorService.findAll({ withDeleted: true })
            .then((res) => {
                setColors(res);
                setLoading(false);
            })
            .catch(console.error);
    }, [refreshSignal]);

    const handleConfirmdDeactivation = (colorId: string) => {
        setLoading(true);
        feedback.loading("Desativando cor...");
        colorService.delete(colorId)
            .then(() => {
                feedback.dismiss();
                feedback.success("Cor desativada!");
                setRefreshSignal(prev => !prev);
            })
            .catch(err => {
                feedback.error(err);
                setLoading(false);
            });
    }

    const handleRestoreColor = (colorId: string) => {
        setLoading(true);
        feedback.loading("Reativando cor...");
        colorService.restore(colorId)
            .then(() => {
                feedback.dismiss();
                feedback.success("Cor reativada!");
                setRefreshSignal(prev => !prev);
            })
            .catch(err => {
                feedback.error(err);
                setLoading(false);
            })
    }

    const isDisableColor = (deletedAt?: string) =>  !!deletedAt;

    return {
        // campos
        colors,
        loading,

        // setters
        setRefreshSignal,

        // funções utils
        handleConfirmdDeactivation,
        handleRestoreColor,
        isDisableColor,
    }
}