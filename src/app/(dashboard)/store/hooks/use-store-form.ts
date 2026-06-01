import { Store } from "@/src/ui/types/store";
import { useEffect, useState } from "react";

export function useStoreForm(initialData?: Store) {
  const [name, setName] = useState("");

  useEffect(() => {
    initialData && setName(initialData.name.toUpperCase());
  }, [initialData]);

  return {
    // fields
    name,

    // setters
    setName,
  };
}
