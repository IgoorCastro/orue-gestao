// hook responsavel por gerenciar a lista
// de exibição do estoque, ativar, desativar
// e controle de refresh na pagina

import { feedback } from "@/src/ui/lib/feedback";
import { StockService } from "@/src/ui/services/stock.service";
import { Stock } from "@/src/ui/types/stock";
import { useEffect, useState } from "react";

const stockService = new StockService("/stock");

export function useStock() {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // estado de loading
    const [refreshSignal, setRefreshSignal] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        stockService.findAll({ withDeleted: true })
            .then((res) => {
                setStocks(res);
                setLoading(false);
            })
            .catch(console.error);
    }, [refreshSignal]);

    // função para desativar um produto
    const handleConfirmdDeactivation = (productId: string) => {
        setLoading(true);
        feedback.loading("Desativando estoque..")
        stockService.delete(productId)
            .then(() => {
                feedback.dismiss()
                feedback.success("Estoque desativado!");
                setRefreshSignal(prev => !prev);
            })
            .catch(error => {
                feedback.error(error);
                setLoading(false);
            })
    }

    // função para resturar um produto desativado
    const handleRestoreProduct = (productId: string) => {
        setLoading(true);
        feedback.loading("Desativando estoque..")
        stockService.restore(productId)
            .then(() => {
                feedback.dismiss()
                feedback.success("Estoque reativado!");
                setRefreshSignal(prev => !prev);
            })
            .catch(error => {
                feedback.error(error);
                setLoading(false);
            })
    }

    // função para verificar se um estoque está desabilitado
    // caso deletedAt esteja presente não seja null ou undefined
    // esse produto está desativado!
    const isDisabledStock = (deletedAt?: string): boolean => {
        return !!deletedAt;
    }

    return {
        stocks,
        refreshSignal,
        loading,

        setStocks,
        setRefreshSignal,

        handleConfirmdDeactivation,
        handleRestoreProduct,
        isDisabledStock,
    }
}