// retorna toda dependencias necessaria para criar um novo registor de movimento de estoque
// loading disponivel

import { useEffect, useMemo, useState } from "react";
import { Stock } from "@/src/ui/types/stock";
import { StockService } from "@/src/ui/services/stock.service";

const stockService = new StockService("/stock");

export function useStockMovimentDependencies() {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        stockService.findAll()
            .then(setStocks)
            .catch(console.error)
            .finally(() => setLoading(false))
    }, []);

    return {
        stocks,
        loading,
    };
}