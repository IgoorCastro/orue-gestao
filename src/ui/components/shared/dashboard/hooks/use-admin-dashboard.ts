import { BaseServicePaginated } from "@/src/ui/services/base-pagination.service";
import { ProductStockService } from "@/src/ui/services/product-stock.service";
import { ProductService } from "@/src/ui/services/product.service";
import { StockService } from "@/src/ui/services/stock.service";

import { ProductStock } from "@/src/ui/types/product-stock";
import { Stock } from "@/src/ui/types/stock";
import { StockMoviment } from "@/src/ui/types/stock-moviment";
import { useEffect, useMemo, useState } from "react";

const stockService = new StockService("/stock");
const productService = new ProductService("/product");
const productStockService = new ProductStockService("/productStock");
const stockMovimentService = new BaseServicePaginated<StockMoviment>("/stockMoviment");


export function useAdminDashboard() {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [selectedStockId, setSelectedStockId] = useState<string>("");
    const [totalValue, setTotalValue] = useState<number>(0);
    const [totalProducts, setTotalProducts] = useState<number>(0);
    const [totalStocks, setTotalStocks] = useState<number>(0);
    const [totalProductStocks, setTotalProductStocks] = useState<number>(0);
    const [recentMovements, setRecentMovements] = useState<StockMoviment[]>([]);
    const [lowStockItems, setLowStockItems] = useState<ProductStock[]>([]);
    const [currentStockData, setCurrentStockData] = useState<ProductStock[]>([]); // ← Dados atuais de estoque
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    const filteredTitle = selectedStockId ? "Estoque selecionado" : "Geral de todos os estoques";

    // exemplo para filtra mensal em TOP PERFORMANCE
    // filtro para últimos 30 dias
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 30);

    useEffect(() => {
        async function loadBaseData() {
            setLoading(true);
            setError("");

            try {
                const [stockList, productPage, recentMovimentList, productStockPage] = await Promise.all([
                    stockService.findAll(),
                    productService.findAll({ page: 1, limit: 1 }),
                    stockMovimentService.findAll({ limit: 50, page: 1, orderBy: "createdAt:desc", fromDate, toDate }),
                    productStockService.findAll({ page: 1, limit: 1 }),
                ]);

                setStocks(stockList);
                setTotalProducts(productPage.total);
                setTotalStocks(stockList.length);
                setRecentMovements(recentMovimentList.data ?? []);
                setTotalProductStocks(productStockPage.total);

                const globalValue = await productStockService.getTotalValue({});
                setTotalValue(globalValue ?? 0);
            } catch (err) {
                console.error(err);
                setError("Erro ao carregar os dados do dashboard. Tente novamente mais tarde.");
            } finally {
                setLoading(false);
            }
        }

        loadBaseData();
    }, []);

    useEffect(() => {
        async function loadSelectedStockData() {
            setLoading(true);
            setError("");

            try {
                // Sempre busca esses 3 primeiros
                const basePromises = [
                    productStockService.getTotalValue({ stockId: selectedStockId || undefined }),
                    productStockService.findAll({ stockId: selectedStockId || undefined, page: 1, limit: 1 }),
                    productStockService.findAll({ stockId: selectedStockId || undefined, page: 1, limit: 5, orderBy: "quantity:asc" }),
                ];

                let additionalPromises: any[] = [];

                if (selectedStockId) {
                    // Com filtro: busca apenas movimentações do estoque específico
                    additionalPromises = [
                        stockMovimentService.findAll({
                            filterStock: selectedStockId,
                            limit: 10,
                            page: 1,
                            orderBy: "createdAt:desc"
                        })
                    ];
                } else {
                    // Sem filtro: busca mais movimentações E dados atuais de estoque
                    additionalPromises = [
                        stockMovimentService.findAll({ limit: 100, page: 1, orderBy: "createdAt:desc" }),
                        productStockService.findAll({ page: 1, limit: 1000 }) // ← Busca dados atuais de estoque
                    ];
                }

                const [valueResponse, stockSummary, lowStockResponse, ...remaining] = await Promise.all([
                    ...basePromises,
                    ...additionalPromises
                ]);

                // Processa os resultados base (sempre presentes)
                setTotalValue(valueResponse ?? 0);
                setTotalProductStocks((stockSummary as any).total);
                setLowStockItems((lowStockResponse as any).data ?? []);

                if (selectedStockId) {
                    // Com filtro: remaining[0] são as movimentações
                    const stockMovements = remaining[0] as any;
                    setRecentMovements(stockMovements.data ?? []);
                } else {
                    // Sem filtro: remaining[0] = movimentações, remaining[1] = dados atuais de estoque
                    const stockMovements = remaining[0] as any;
                    const currentStockDataResponse = remaining[1] as any;
                    setRecentMovements(stockMovements.data ?? []);
                    setCurrentStockData(currentStockDataResponse.data ?? []);
                }
            } catch (err) {
                console.error(err);
                setError("Erro ao carregar dados do estoque selecionado.");
            } finally {
                setLoading(false);
            }
        }

        loadSelectedStockData();
    }, [selectedStockId]);

    // retorna um array com os melhores items em relação ao 'recentMovements'
    const topProducts = useMemo(() => {
        const stats = new Map<string, { name: string; totalMovimented: number; currentStock: number; size: string }>();

        recentMovements.forEach((movement) => {
            const productName = movement.productStock?.product?.name ?? "Produto sem nome";
            const productSize = movement.productStock?.product?.size ?? "";
            const key = `${productName}|${productSize}`; // ← Chave composta: nome + tamanho
            const current = stats.get(key) ?? { name: productName, totalMovimented: 0, currentStock: 0, size: productSize };

            current.totalMovimented += movement.quantity; // Soma todas as movimentações
            stats.set(key, current);
        });

        // Calcula estoque atual baseado nos dados disponíveis
        stats.forEach((product, key) => {
            const [productName, productSize] = key.split('|');

            if (!selectedStockId && currentStockData.length > 0) {
                // Sem filtro: soma estoques atuais de TODAS as localizações
                const relevantStocks = currentStockData.filter(stock =>
                    stock.product?.name === productName && stock.product?.size === productSize
                );
                product.currentStock = relevantStocks.reduce((sum, stock) => sum + stock.quantity, 0);
            } else if (selectedStockId && currentStockData.length > 0) {
                // Com filtro: soma estoques atuais APENAS do estoque filtrado
                const relevantStocks = currentStockData.filter(stock =>
                    stock.product?.name === productName &&
                    stock.product?.size === productSize &&
                    stock.stockId === selectedStockId
                );
                product.currentStock = relevantStocks.reduce((sum, stock) => sum + stock.quantity, 0);
            }
        });

        return Array.from(stats.entries())
            .map(([key, value]) => ({ key, ...value }))
            .sort((a, b) => b.totalMovimented - a.totalMovimented)
            .slice(0, 5);
    }, [recentMovements, selectedStockId, currentStockData]);

    return {
        // campos
        stocks,
        selectedStockId,
        totalValue,
        totalProducts,
        totalStocks,
        totalProductStocks,
        recentMovements,
        lowStockItems,
        loading,
        error,

        // setters
        setSelectedStockId,

        // utils
        topProducts,
        filteredTitle,
    }
}