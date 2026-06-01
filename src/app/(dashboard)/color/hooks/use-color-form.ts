import { Color } from "@/src/ui/types/color";
import { useEffect, useState } from "react";

export function useColorForm(initialData?: Color) {
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
