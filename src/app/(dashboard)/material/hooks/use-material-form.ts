import { Material } from "@/src/ui/types/material";
import { useEffect, useState } from "react";

export function useMaterialForm(initialData?: Material) {
  const [name, setName] = useState("");

  useEffect(() => {
    initialData && setName(initialData.name)
  }, [initialData])

  return {
    // fields
    name,

    // setters
    setName,
  };
}
