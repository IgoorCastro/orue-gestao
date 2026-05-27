"use client";

import { Plus, Trash2, ArrowLeftRight } from "lucide-react";

// Shadcn UI & Custom Components
import { Input } from "@/src/ui/components/ui/input";
import { Label } from "@/src/ui/components/ui/label";
import { Button } from "@/src/ui/components/ui/button";
import { Separator } from "@/src/ui/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/ui/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/ui/components/ui/table";

// Services & Types
import { useTrasnfer } from "./hooks/use-transfer";
import DefaultLoading from "@/src/ui/components/shared/ui/loading-default";
import { ProductSearchSelect } from "@/src/ui/components/shared/ui/searchable-select";
import { useStockMovimentDependencies } from "@/src/app/(dashboard)/stock-moviment/hooks/use-stock-moviment-dependencies";
import { useBarCodeReader } from "@/src/ui/hooks/use-barcode-reader";

export default function TransferAdminPage() {
    // Dependências de estoques (Origem e Destino)
    const {
        stocks: avaliableStocks,
        loading: loadingDependencies
    } = useStockMovimentDependencies();

    const {
        // campos
        items,
        avaliableProductStocks,
        fromStock,
        toStock,
        productStockId,
        quantity,
        loading: loadingService,

        // setters
        setItems,
        setFromStock,
        setToStock,
        setProductStockId,
        setSelectedPS,
        setQuantity,
        setSearchProduct,

        // utils
        handleSubmit,
        handleAddItem,
        removeItem,
        handleBarCodeScanned,
    } = useTrasnfer();

    const { barCode } = useBarCodeReader({
        onBarCodeRead: handleBarCodeScanned,
        enabled: !!fromStock, // só funciona se um estoque foi selecionado
        quantity,
    });

    if (loadingDependencies) return <DefaultLoading />

    return (
        <div className="p-5 space-y-6">
            <div className="">
                <h1 className="text-2xl font-bold">Trasnferência</h1>
                <p className="text-sm text-gray-600">
                    Gerencie o deslocamento de mercadorias entre centros de distribuição ou setores.
                </p>
            </div>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                <div className="flex flex-col items-center lg:items-start gap-2">
                    {/* Definição de Fluxo (Origem -> Destino) */}
                    <div className="flex flex-col lg:flex-row gap-3 lg:items-end justify-between w-full">
                        <div className="w-full md:w-min flex flex-col md:flex-row items-center gap-5 md:gap-7 lg:gap-15">
                            <div className="w-1/2 flex flex-col items-center lg:items-start gap-2">
                                <Label className="truncate text-xs font-bold uppercase tracking-wider text-blue-600">Sair do Estoque (Origem)</Label>
                                <Select value={fromStock} onValueChange={(v) => {
                                    setFromStock(v);
                                    setItems([]);
                                }}>
                                    <SelectTrigger className="border-blue-200">
                                        <SelectValue placeholder="Selecione a origem" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {avaliableStocks.map((v) => (
                                            <SelectItem key={v.id} value={v.id}>
                                                {v.store?.name ? `${v.store.name.toUpperCase()} - ` : ""}
                                                {v.name && v.type !== "MAIN" ? v.name : "Matriz"}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="w-1/2 flex flex-col items-center lg:items-start gap-2">
                                <Label className="truncate text-xs font-bold uppercase tracking-wider text-green-600">Entrar no Estoque (Destino)</Label>
                                <Select value={toStock} onValueChange={setToStock}>
                                    <SelectTrigger className="border-green-200">
                                        <SelectValue placeholder="Selecione o destino" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {avaliableStocks.map((v) => (
                                            <SelectItem key={v.id} value={v.id} disabled={v.id === fromStock}>
                                                {v.store?.name ? `${v.store.name.toUpperCase()} - ` : ""}
                                                {v.name && v.type !== "MAIN" ? v.name : "Matriz"}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        {/* Input para receber entrada do leitor de código de barras */}
                    {/* <Input
                        value={barCode}
                        className="text-center uppercase w-min"
                        readOnly
                        placeholder="Barcode"
                    /> */}
                    </div>
                    {fromStock && (
                        <p className="text-xs text-green-600 font-medium">✓ Leitor de código de barras ativo</p>
                    )}
                </div>

                {/* Seleção do Produto baseada na Origem */}
                <div className="p-4 bg-muted/20 rounded-lg border border-dashed border-blue-400/50 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="md:col-span-2 space-y-2">
                            <ProductSearchSelect
                                label="Produto para Transferir"
                                placeholder={fromStock ? "Buscar produto na origem..." : "Selecione a origem primeiro"}
                                loadingFetch={loadingService}
                                options={avaliableProductStocks.map((ps) => ({
                                    value: ps.id,
                                    label: `${ps.product?.name} - ${ps.product?.size} (Saldo: ${ps.quantity})`,
                                    data: ps,
                                }))}
                                value={productStockId}
                                onSelectedChange={(val: string, opt: any) => {
                                    setProductStockId(val);
                                    setSelectedPS(opt.data);
                                }}
                                onInputChange={(val: string) => {
                                    setSearchProduct(val);
                                }}
                                disabled={!fromStock}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider">Qtd</Label>
                            <Input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                min={1}
                                onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
                            />
                        </div>

                        <Button
                            type="button"
                            onClick={handleAddItem}
                            disabled={!productStockId || !toStock}
                            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white transition-all"
                        >
                            <Plus className="h-4 w-4" />
                            Adicionar
                        </Button>
                    </div>
                </div>
            </form>

            {/* Listagem de Transferências Agendadas */}
            {items.length > 0 && (
                <div className="rounded-md border border-blue-100">
                    <Table>
                        <TableHeader className="bg-blue-50/50">
                            <TableRow>
                                <TableHead className="text-xs uppercase font-bold text-blue-700">Produto</TableHead>
                                <TableHead className="text-xs uppercase font-bold text-center">Quantidade</TableHead>
                                <TableHead className="text-xs uppercase font-bold text-right">Ação</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map((item, index) => (
                                <TableRow key={index} className="hover:bg-blue-50/30">
                                    <TableCell className="font-medium text-sm">
                                        {item.name} <span className="text-muted-foreground text-xs">({item.size})</span>
                                    </TableCell>
                                    <TableCell className="text-center font-bold">
                                        <div className="flex items-center justify-center gap-2">
                                            {item.quantity}
                                            <ArrowLeftRight className="h-3 w-3 text-muted-foreground" />
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => removeItem(index)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            <Separator />

            <div className="flex justify-end pt-2">
                <Button
                    onClick={handleSubmit}
                    disabled={items.length === 0}
                    className="w-full md:w-auto px-10 gap-2 bg-blue-700 hover:bg-blue-800 dark:text-foreground shadow-lg shadow-blue-500/10"
                >
                    <ArrowLeftRight className="h-4 w-4" />
                    Finalizar Transferência ({items.length} itens)
                </Button>
            </div>
        </div>
    );
}