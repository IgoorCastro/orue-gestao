import { ProductService } from "@/src/ui/services/product.service";
import { StockService } from "@/src/ui/services/stock.service";
import { Product } from "@/src/ui/types/product";
import { Stock } from "@/src/ui/types/stock";
import { useEffect, useMemo, useState } from "react";

const productService = new ProductService("/product");
const stockService = new StockService("/stock");

export function useProductStockFilterDependencies() {
    const [products, setProducts] = useState<Product[]>([]);
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        Promise.all([
            productService.findAll({ orderBy: "name: desc" }),
            stockService.findAll({ orderBy: "name: desc" }),
        ])
            .then(([products, stocks]) => {
                setProducts(products.data);
                setStocks(stocks)
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return {
        products,
        stocks,
        loading,
    }
}