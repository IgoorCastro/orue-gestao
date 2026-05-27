import { feedback } from "@/src/ui/lib/feedback";
import { ProductStockService } from "@/src/ui/services/product-stock.service";
import { PaginatedProductStock } from "@/src/ui/types/product-stock";
import { ProductStockFiltersDto } from "@/src/ui/types/product-stock-filters";
import { useEffect, useState } from "react";

const productStockService = new ProductStockService("/productStock");

export function useProductStock() {
    const [productStock, setProductStock] = useState<PaginatedProductStock>({ data: [], limit: 0, page: 0, total: 0 });
    const [searchFilters, setSearchFilters] = useState<ProductStockFiltersDto>({});
    const [totalStockValue, setTotalStockValue] = useState<number>(0);

    const [refreshSignal, setRefreshSignal] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [psList, psTotalValue] = await Promise.all([
                    productStockService.findAll(searchFilters),
                    productStockService.getTotalValue({ productId: searchFilters.productId, stockId: searchFilters.stockId }),
                ])

                setProductStock(psList);
                setTotalStockValue(psTotalValue);

                setLoading(false);
            } catch (err) {
                console.log("Fetch useProductStock error: ", err)
            }
        }

        load();
    }, [searchFilters, refreshSignal]);

    // função para remover filtros individuais (específica)
    const handleRemoveFilter = (key: keyof ProductStockFiltersDto, value?: any) => {
        setSearchFilters((prev) => {
            const next = { ...prev };

            if (Array.isArray(next[key])) {
                // Remove apenas o item do array
                // next[key] = (next[key] as string[]).filter((v) => v !== value);
                (next[key] as string[]) = (next[key] as string[]).filter((v) => v !== value);
                // Se o array ficou vazio, removemos a chave para manter o objeto limpo
                // if (next[key].length === 0) delete next[key];                
                if ((next[key] as string[]).length === 0) delete next[key];
            } else {
                // Remove a chave inteira (name, size, minPrice, etc)
                delete next[key];
            }

            return { ...next };
        });
    };

    // função para resetar tudo (genérica)
    const handleClearFilters = () => {
        setSearchFilters({}); // Reseta para um objeto vazio
    };

    // calcula o valor total 'em reais' de um produto
    // em estoque 
    // retorna uma string formatada do valor
    const calcTotalProductValueInStock = ({ quantity, unitPrice }: { quantity: number, unitPrice: number }): string => {
        const value = quantity === 1 ? unitPrice : unitPrice * quantity;

        return formatNumberBRL(value);
    }

    const formatNumberBRL = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value);
    }

    const handleConfirmdDeactivation = (psId: string) => {
            console.log("psId: ", psId)
            setLoading(true);
            feedback.loading("Desativando produto no estoque...");
            productStockService.delete(psId)
                .then(() => {
                    feedback.dismiss();
                    feedback.success("Produto em estoque desativado!");
                    setRefreshSignal(prev => !prev);
                })
                .catch(err => {
                    feedback.error(err);
                    setLoading(false);
                });
        }
    
        const handleRestoreProductStock = (psId: string) => {
            console.log("psId: ", psId)
            setLoading(true);
            feedback.loading("Reativando cor...");
            productStockService.restore(psId)
                .then(() => {
                    feedback.dismiss();
                    feedback.success("Produto em estoque reativado!");
                    setRefreshSignal(prev => !prev);
                })
                .catch(err => {
                    feedback.error(err);
                    setLoading(false);
                })
        }

    const isDisableProductStock = (deletedAt?: string) =>  !!deletedAt;

    return {
        productStock: productStock.data,
        total: productStock.total,
        page: productStock.page,
        limit: productStock.limit,
        totalPages: productStock?.total && productStock?.limit
            ? Math.ceil(productStock.total / productStock.limit)
            : 1,
        searchFilters,
        totalStockValue,
        loading,

        setSearchFilters,
        setRefreshSignal,
        
        handleRemoveFilter,
        handleClearFilters,
        calcTotalProductValueInStock,
        formatNumberBRL,
        handleConfirmdDeactivation,
        handleRestoreProductStock,
        isDisableProductStock,
    }
}