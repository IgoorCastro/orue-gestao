// retorna toda dependencias necessaria para criar um novo registor de movimento de estoque
// loading disponivel

import { useEffect, useMemo, useState } from "react";
import { Stock } from "@/src/ui/types/stock";
import { StockService } from "@/src/ui/services/stock.service";
import { feedback } from "@/src/ui/lib/feedback";

const stockService = new StockService("/stock");

export function useStockMovimentInboundDependencies() {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        stockService.findAll({ type: "MAIN" })
            .then(setStocks)
            .catch(feedback.error)
            .finally(() => setLoading(false))
    }, []);

    return {
        stocks,
        loading,
    };
}