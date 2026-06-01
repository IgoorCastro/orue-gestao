import { StockMovimentType } from "@/src/ui/enum/stock-moviment-type";
import { Product } from "@/src/ui/types/product";
import { ProductStock } from "@/src/ui/types/product-stock";
import { StockMoviment } from "@/src/ui/types/stock-moviment";
import { useEffect, useState } from "react";

export function useStockMovimentForm(initialData?: StockMoviment) {
  const [product, setProduct] = useState("");
  const [selectedProductStock, setSelectedProductStock] = useState<ProductStock | null>(null);  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [fromStock, setFromStock] = useState("");
  const [toStock, setToStock] = useState("");  
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [unitPrice, setUnitPrice] = useState(0);
  const [type, setType] = useState<StockMovimentType>(StockMovimentType.TRANSFER);

  useEffect(() => {initialData && mapData(initialData);
  }, [initialData])

  const mapData = (sm: StockMoviment): void => {
    setProduct(sm.productStock.product.id);
    setSelectedProduct(sm.productStock.product);
    setSelectedProductStock(sm.productStock);
    setFromStock(sm.fromStockId ?? "");
    setToStock(sm.toStockId ?? "");
    setQuantity(sm.quantity);
    setTotalPrice(sm.totalPrice);
    setUnitPrice(sm.unitPrice);
    setType(sm.type as StockMovimentType);
  }

  return {
    // fields
    product,
    selectedProductStock,
    selectedProduct,
    fromStock,
    toStock,
    quantity,
    totalPrice,
    unitPrice,
    type,

    // setters
    setProduct,
    setSelectedProductStock,
    setSelectedProduct,
    setFromStock,
    setToStock,
    setQuantity,
    setTotalPrice,
    setUnitPrice,
    setType,
  };
}