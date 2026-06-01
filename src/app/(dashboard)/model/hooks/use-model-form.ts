import { Model } from "@/src/ui/types/model";
import { useEffect, useState } from "react";

export function useModelForm(initialData?: Model) {
  const [name, setName] = useState("");

  useEffect(() => {
    initialData && setName(initialData.name);
  }, [initialData])

  return {
    // fields
    name,

    // setters
    setName,
  };
}
