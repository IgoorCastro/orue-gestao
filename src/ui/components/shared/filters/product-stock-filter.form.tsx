import { useEffect, useState } from "react"
import { ProductStockFiltersDto } from "@/src/ui/types/product-stock-filters"
import { Button } from "@/src/ui/components/ui/button";
import { GenericSelect } from "../ui/select";
import { useProductStockFilterDependencies } from "@/src/app/(dashboard)/product-stock/hooks/use-product-stock-filter-dependencies";
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs";

type Props = {
    onApply: (filters: any) => void
    onClose: () => void,
    defaultFilter: ProductStockFiltersDto,
}

export function ProductStockFilterForm({ onApply, onClose, defaultFilter }: Props) {
    const [filters, setFilters] = useState<ProductStockFiltersDto>({});

    const { 
        products: avaliableProducts,
        stocks: avaliableStocks,
        loading,
    } = useProductStockFilterDependencies();

    // Efeito para sincronizar os estados locais quando o modal abre ou as dependências carregam
    useEffect(() => {
        if (!loading) setFilters(defaultFilter);
    }, [defaultFilter, loading]);

    function update(key: string, value: any) {
        setFilters(prevs => ({ ...prevs, [key]: value }));
    }

    function handleApply() {
        onApply(filters)
        onClose() // fecha modal
    }

    function handleClear() {
        setFilters({})
    }

    // definir o valor atual para a UI baseado nos dois campos do DTO
    // dependendo do valor atual da UI, o filtro executa uma ação
    const getUIValue = () => {
        if (filters.onlyDeleted) return "only";
        if (filters.withDeleted) return "all";
        return "none";
    };

    // a função que traduz a escolha da UI para o DTO
    const handleStatusChange = (value: string) => {
        if (value === "only") {
            // retorna 'somente deletados'
            update("onlyDeleted", true);
            update("withDeleted", undefined); // ou true, dependendo de como o seu back trata
        } else if (value === "all") {
            // retorna 'com deletados' (ativos + deletados)
            update("onlyDeleted", undefined);
            update("withDeleted", true);
        } else {
            // default: 'sem deletados'
            update("onlyDeleted", undefined);
            update("withDeleted", undefined);
        }
    };

    if (loading) return <p>Carregando...</p>;

    return (
        <div className="flex flex-col gap-3 mt-4">
                <div className="flex flex-col">
                <p className="text-xs pl-1 pb-1">Estoque</p>
                <GenericSelect
                    // Passa o valor atual do estado. Se for limpo, vira "" ou undefined
                    title="Tipo"
                    value={filters.stockId}
                    placeholder="Selecione.."
                    items={avaliableStocks.map(stock => ({
                        label: `${stock.store?.name ? stock.store?.name.toUpperCase() : "Matriz"} - ${stock.name.charAt(0).toUpperCase() + stock.name.slice(1)}`,
                        value: stock.id,
                    }))}
                    onChange={(value) => {
                        update("stockId", value);
                    }}
                />
            </div>

            <div className="flex flex-col">
                <p className="text-xs pl-1 pb-1">Produto</p>
                <GenericSelect
                    // Passa o valor atual do estado. Se for limpo, vira "" ou undefined
                    title="Produto"
                    value={filters.productId}
                    placeholder="Selecione.."
                    items={avaliableProducts.map(product => ({
                        label: `${product.name} - ${product.size}`,
                        value: product.id,
                    }))}
                    onChange={(value) => {
                        update("productId", value);
                    }}
                />
            </div>

            <div className="flex flex-col">
                <p className="text-xs pl-1 pb-1 font-medium text-muted-foreground">Visualização</p>
                <Tabs
                    defaultValue="none"
                    value={getUIValue()}
                    onValueChange={handleStatusChange}
                    className="w-full"
                >
                    <TabsList className="grid w-full grid-cols-3 h-9">
                        <TabsTrigger value="none" className="text-[11px]">
                            Ativos
                        </TabsTrigger>
                        <TabsTrigger value="all" className="text-[11px]">
                            Todos
                        </TabsTrigger>
                        <TabsTrigger value="only" className="text-[11px]">
                            Desativados
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
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