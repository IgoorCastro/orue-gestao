import { feedback } from "@/src/ui/lib/feedback";
import { ColorService } from "@/src/ui/services/color.service";
import { MaterialService } from "@/src/ui/services/material.service";
import { Color } from "@/src/ui/types/color";
import { Material } from "@/src/ui/types/material";
import { useEffect, useState } from "react";

const colorService = new ColorService("/color");
const materialService = new MaterialService("/material");

export function useProductFilterDependencies() {
    const [colors, setColors] = useState<Color[]>([]);
    const [materials, setMaterials] = useState<Material[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        Promise.all([
            colorService.findAll(),
            materialService.findAll(),
        ])
            .then(([colors, materials]) => {
                setColors(colors);
                setMaterials(materials);
            })
            .catch(feedback.error)
            .finally(() => setLoading(false));
    }, []);

    return {
        colors,
        materials,
        loading,
    }
}