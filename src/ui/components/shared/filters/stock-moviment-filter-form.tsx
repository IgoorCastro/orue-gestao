"use client"

import { useEffect, useState } from "react"
import { Button } from "@/src/ui/components/ui/button"
import { GenericSelect } from "../ui/select"
import { StockMovimentFilteredDto } from "@/src/ui/types/stock-moviment-filters"
import { StockMovimentType } from "@/src/ui/enum/stock-moviment-type"
import { DatePickerWithRange } from "../ui/data-picker-with-ranger"
import { useStockMovimentFilterDependencies } from "../stock-moviment/hooks/use-stock-moviment-filter-dependencies"
import { STOCK_MOVIMENT_TYPE } from "@/src/ui/constants/labels/stock-moviment-type-labels"

type Props = {
    onApply: (filters: any) => void
    onClose: () => void,
    defaultFilter: StockMovimentFilteredDto,
}

export function StockMovimentFilterForm({ onApply, onClose, defaultFilter = {} }: Props) {
    const [filters, setFilters] = useState<StockMovimentFilteredDto>(defaultFilter);

    const {
        stocks: avaliableStocks,
        users: avaliableUsers,
        loading,
    } = useStockMovimentFilterDependencies();

    // 1. Efeito para sincronizar os estados locais quando o modal abre ou as dependências carregam
    useEffect(() => {
        if (!loading) {
            // Garante que o estado de filtros interno esteja pareado com o pai
            setFilters(defaultFilter);
        }
    }, [defaultFilter, loading]);

    function update(key: string, value: any) {
        setFilters(prevs => ({ ...prevs, [key]: value }));
    }

    function handleApply() {
        onApply(filters)
        onClose() // fecha modal
    }

    function handleClear() {
        setFilters({});
    }

    if (loading) return <p>Carregando...</p>;

    return (
        <div className="flex flex-col gap-3 mt-4">
            <div className="flex flex-col">
                <p className="text-xs pl-1 pb-1">Tipo</p>
                <GenericSelect
                    // Passa o valor atual do estado. Se for limpo, vira "" ou undefined
                    value={filters.type}

                    placeholder="Selecione.."

                    items={Object.values(StockMovimentType).map(smt => ({
                        label: STOCK_MOVIMENT_TYPE[smt],
                        value: smt,
                    }))}

                    onChange={(value) => update("type", value)}
                    title="Tipo"
                />
            </div>

            <div className="flex flex-row gap-2">
                <div className="flex flex-col w-1/2">
                    <p className="text-xs pl-1 pb-1">Do estoque</p>
                    <GenericSelect
                        // Passa o valor atual do estado. Se for limpo, vira "" ou undefined
                        value={filters.fromStockId}

                        placeholder="Selecione.."

                        items={avaliableStocks.map(stock => ({
                            label: `${stock.store?.name ? stock.store?.name.toUpperCase() : "Matriz"} - ${stock.name.charAt(0).toUpperCase() + stock.name.slice(1)}`,
                            value: stock.id,
                        }))}

                        onChange={(value) => update("fromStockId", value)}
                        title="Estoques"
                    />
                </div>
                <div className="flex flex-col w-1/2">
                    <p className="text-xs pl-1 pb-1">Para estoque</p>
                    <GenericSelect
                        // Passa o valor atual do estado. Se for limpo, vira "" ou undefined
                        title="Estoques"
                        value={filters.toStockId}
                        placeholder="Selecione.."
                        items={avaliableStocks.map(stock => ({
                            label: `${stock.store?.name ? stock.store?.name.toUpperCase() : "Matriz"} - ${stock.name.charAt(0).toUpperCase() + stock.name.slice(1)}`,
                            value: stock.id,
                        }))}
                        onChange={(value) => update("toStockId", value)}
                    />
                </div>
            </div>
            
            <div className="flex flex-col">
                <p className="text-xs pl-1 pb-1">Usuário</p>
                <GenericSelect
                    // Passa o valor atual do estado. Se for limpo, vira "" ou undefined
                    value={filters.user}

                    placeholder="Selecione.."

                    items={avaliableUsers.map(user => ({
                        label: user.name,
                        value: user.id,
                    }))}

                    onChange={(value) => update("user", value)}
                    title="Usuários"
                />
            </div>

            <div className="flex flex-col">
                <p className="text-xs pl-1 pb-1">Data</p>
                <DatePickerWithRange
                    date={{
                        from: filters.fromDate,
                        to: filters.toDate,
                    }}

                    setDate={(date) => {
                        console.log("date: ", date)
                        setFilters({ ...filters, fromDate: date?.from, toDate: date?.to })
                    }}
                />
            </div>

            <div className="flex justify-between mt-4">
                <Button variant="ghost" onClick={handleClear}>
                    Limpar
                </Button>

                <Button onClick={handleApply}>
                    Aplicar
                </Button>
            </div>
        </div>
    );
}