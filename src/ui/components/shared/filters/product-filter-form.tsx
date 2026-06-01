"use client"

import { useEffect, useState } from "react"
import { Button } from "@/src/ui/components/ui/button"
import { Input } from "@/src/ui/components/ui/input"
import { ProductFiltersDto } from "@/src/ui/types/product-filters"
import { GenericSelect } from "../ui/select"
import { ProductType } from "@/src/ui/enum/product-type"
import { ProductSize } from "@/src/ui/enum/product-size"
import { Color } from "@/src/ui/types/color"
import { Material } from "@/src/ui/types/material"
import { Tabs, TabsList, TabsTrigger } from "@/src/ui/components/ui/tabs"
import { MultiSelect } from "@/src/app/(dashboard)/product/components/multi-select"
import { useProductFilterDependencies } from "@/src/app/(dashboard)/product/hooks/use-product-filter-dependencies"
import { PRODUCT_TYPE_LABELS } from "@/src/ui/constants/labels/product-type-labels"
import { PRODUCT_SIZE_LABELS } from "@/src/ui/constants/labels/product-size-labels"

type Props = {
    onApply: (filters: any) => void
    onClose: () => void,
    defaultFilter: ProductFiltersDto,
}

export function ProductFilterForm({ onApply, onClose, defaultFilter = {} }: Props) {
    const [filters, setFilters] = useState<ProductFiltersDto>(defaultFilter);
    const [selectedColors, setSelectedColors] = useState<Color[]>([]);
    const [selectedMaterials, setSelectedMaterials] = useState<Material[]>([]);

    const {
        colors: availableColors,
        materials: availableMaterials,
        loading,
    } = useProductFilterDependencies();

    // 1. Efeito para sincronizar os estados locais quando o modal abre ou as dependências carregam
    useEffect(() => {
        if (!loading) {
            // Sincroniza Cores
            if (defaultFilter.colors) {
                const preSelected = availableColors.filter(c => defaultFilter.colors?.includes(c.id));
                setSelectedColors(preSelected);
            }
            // Sincroniza Materiais
            if (defaultFilter.materials) {
                const preSelected = availableMaterials.filter(m => defaultFilter.materials?.includes(m.id));
                setSelectedMaterials(preSelected);
            }
            // Garante que o estado de filtros interno esteja pareado com o pai
            setFilters(defaultFilter);
        }
    }, [defaultFilter, availableColors, availableMaterials, loading]);

    // Sincroniza o componente de UI com o objeto de filtros do backend
    function handleColorChange(newColors: Color[]) {
        // 1. Atualiza o estado visual (o componente precisa do objeto completo pra renderizar as tags)
        setSelectedColors(newColors);

        // 2. Atualiza o estado 'filters' apenas com os IDs que o backend espera
        update("colors", newColors.map(c => c.id));
    }

    function handleMaterialChange(newMaterials: Material[]) {
        // 1. Atualiza o estado visual
        setSelectedMaterials(newMaterials);

        // 2. Atualiza o estado 'filters' apenas com os IDs
        update("materials", newMaterials.map(m => m.id));
    }

    function update(key: string, value: any) {
        setFilters(prevs => ({ ...prevs, [key]: value }));
    }

    function handleApply() {
        onApply(filters)
        onClose() // fecha modal
    }

    function handleClear() {
        setFilters({})
        setSelectedColors([]);
    }

    // definir o valor atual para a UI baseado nos dois campos do DTO
    // dependendo do valor atual da UI, o filtro executa uma ação
    const getUIValue = () => {
        if (filters.onlyDeleted) return "only";
        if (filters.withDeleted) return "all";
        return "none";
    };

    // 2. A função que traduz a escolha da UI para o DTO
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
                <p className="text-xs pl-1 pb-1 font-medium text-muted-foreground">Nome do produto</p>
                <Input
                    placeholder="Nome do produto"
                    value={filters.name || ""}
                    onChange={(e) => update("name", e.target.value)}
                />
            </div>

            <div className="flex flex-row gap-2">
                <div className="flex flex-col">
                    <p className="text-xs pl-1 pb-1 font-medium text-muted-foreground">Preço mínimo</p>
                    <Input
                        type="number"
                        placeholder="Preço mínimo"
                        value={filters.minPrice ?? ""}
                        onChange={(e) => update("minPrice", e.target.value ? Number(e.target.value) : undefined)}
                    />
                </div>
                <div className="flex flex-col">
                    <p className="text-xs pl-1 pb-1 font-medium text-muted-foreground">Preço máximo</p>
                    <Input
                        type="number"
                        placeholder="Preço máximo"
                        value={filters.maxPrice ?? ""}
                        onChange={(e) => update("maxPrice", e.target.value ? Number(e.target.value) : undefined)}
                    />
                </div>
            </div>

            <div className="flex flex-row gap-2">
                <div className="flex flex-col w-1/2">
                    <p className="text-xs pl-1 pb-1 font-medium text-muted-foreground">Tipo</p>
                    <GenericSelect
                        // Passa o valor atual do estado. Se for limpo, vira "" ou undefined
                        value={filters.type}

                        placeholder="Selecione.."

                        items={(Object.values(ProductType)).map(pt => ({
                            label: PRODUCT_TYPE_LABELS[pt],
                            value: pt,
                        }))}

                        onChange={(value) => update("type", value)}
                        title="Tipo"
                    />
                </div>

                <div className="flex flex-col w-1/2 ">
                    <p className="text-xs pl-1 pb-1 font-medium text-muted-foreground">Tamanho</p>
                    <GenericSelect
                        // Passa o valor atual do estado. Se for limpo, vira "" ou undefined
                        value={filters.size}

                        items={Object.values(ProductSize).map(ps => ({
                            label: PRODUCT_SIZE_LABELS[ps],
                            value: ps,
                        }))}

                        onChange={(value) => update("size", value)}
                        title="Tipo"
                    />
                </div>
            </div>

            <div className="flex flex-col">
                <MultiSelect
                    label="Cores do Produto"
                    items={availableColors} // Lista total vinda do hook
                    selected={selectedColors} // Lista de selecionados
                    setSelected={handleColorChange}
                    getId={(color) => color.id} // Como extrair o ID
                    getLabel={(color) => color.name} // Como extrair o nome (Label)
                />
            </div>

            <div className="flex flex-col">
                <MultiSelect
                    label="Materias"
                    items={availableMaterials} // Lista total vinda do hook
                    selected={selectedMaterials} // Lista de selecionados
                    setSelected={handleMaterialChange}
                    getId={(material) => material.id} // Como extrair o ID
                    getLabel={(material) => material.name} // Como extrair o nome (Label)
                />
            </div>

            <div className="flex flex-row gap-2">
                <div className="flex flex-col w-1/2">
                    <p className="text-xs pl-1 pb-1 font-medium text-muted-foreground">Código de barras</p>
                    <Input
                        placeholder="Código"
                        value={filters.barcode || ""}
                        onChange={(e) => update("barcode", e.target.value)}
                    />
                </div>
                <div className="flex flex-col w-1/2">
                    <p className="text-xs pl-1 pb-1 font-medium text-muted-foreground">Código Mercado Livre</p>
                    <Input
                        placeholder="Código Mercado Livre"
                        value={filters.mlProductId || ""}
                        onChange={(e) => update("mlProductId", e.target.value)}
                    />
                </div>
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