// Hook para controle de estados UI
// tratar aqui o controle de elementos da pagina

import { Product } from "@/src/ui/types/product";
import { useState } from "react";

export function useProductPageState() {
    const [openCrudModal, setOpenCrudModal] = useState(false);
    const [openFilterModal, setOpenFilterModal] = useState(false);
    const [openItemModal, setOpenItemModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
    
      const openItemDetails = (product: Product): void => {
        setSelectedProduct(product);
        setOpenItemModal(true);
      }
    
      const openEditModal = (product: Product): void => {
        setSelectedProduct(product);
        setOpenCrudModal(true);
      }
    
      // Limpa o estado e abre a modal
      const openCreateProduct = () => {
        setSelectedProduct(undefined);
        setOpenCrudModal(true);
      }

    return {
        openCrudModal,
        openFilterModal,
        openItemModal,
        selectedProduct,

        setOpenCrudModal,
        setOpenFilterModal,
        setOpenItemModal,
        setSelectedProduct,

        openItemDetails,
        openEditModal,
        openCreateProduct,
    };
}