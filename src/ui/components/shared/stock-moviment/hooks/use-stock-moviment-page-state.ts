import { useState } from "react";

export function useStockMovimentPageState() {    
  const [openFilterModal, setOpenFilterModal] = useState(false);

  return {
    openFilterModal,

    setOpenFilterModal,
  }
}