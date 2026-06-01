"use client";

import { Input } from "@/src/ui/components/ui/input";
import { Label } from "@/src/ui/components/ui/label";
import { Button } from "@/src/ui/components/ui/button";
import { Separator } from "@/src/ui/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/ui/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/ui/components/ui/table";
import DefaultLoading from "@/src/ui/components/shared/ui/loading-default";
import { ProductSearchSelect } from "@/src/ui/components/shared/ui/searchable-select";
import { Save, Plus, Trash2 } from "lucide-react";
import { useInbound } from "./hooks/use-inbound";
import { useBarCodeReader } from "@/src/ui/hooks/use-barcode-reader";
import { useStockMovimentInboundDependencies } from "./hooks/use-stock-moviment-inbound-dependencies";
import { PRODUCT_SIZE_LABELS } from "@/src/ui/constants/labels/product-size-labels";

export default function InboundManagerPage() {
    const {
        stocks: avaliableStocks,
        loading: loadingDependencies
    } = useStockMovimentInboundDependencies();

    const {
        // campos
        items,
        defaultList,
        toStock,
        productId,
        quantity,
        loading: loadingService,

        // setters
        setToStock,
        setProductId,
        setSearchProduct,
        setSelectedProduct,
        setQuantity,

        handleSubmit,
        handleAddItem,
        removeItem,
        handleBarCodeScanned,
    } = useInbound();

    // Hook do leitor de código de barras
    const { barCode } = useBarCodeReader({
        onBarCodeRead: handleBarCodeScanned,
        enabled: !!toStock, // só funciona se um estoque foi selecionado
        quantity,
    });

    if (loadingDependencies) return <DefaultLoading />

    return (
        <div className="p-5 space-y-6">
            <div className="">
                <h1 className="text-2xl font-bold">Entrada</h1>
                <p className="text-sm text-gray-600">
                    Registre a chegada de mercadorias e atualize o saldo disponível no inventário.
                </p>
            </div>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                {/* Destino Fixo para esta remessa */}
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    <div className="flex flex-col md:flex-row gap-2">
                        <div className="w-full space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-primary">Estoque de Destino</Label>
                        <Select value={toStock} onValueChange={setToStock}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o estoque de entrada" />
                            </SelectTrigger>
                            <SelectContent>
                                {avaliableStocks.map((value) => (
                                    <SelectItem key={value.id} value={value.id}>
                                        {value.name ? "Main - " + value.name.charAt(0).toUpperCase() + value.name.slice(1) : "Matriz"}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {toStock && (
                            <p className="text-xs text-green-600 font-medium">✓ Leitor de código de barras ativo</p>
                        )}
                        </div>
                    </div>
                </div>

                {/* Inputs do Produto atual */}
                <div className="p-4 bg-muted/20 rounded-lg border border-dashed border-green-500/50 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="md:col-span-2">
                            <ProductSearchSelect
                                label="Produto para Entrada"
                                placeholder="Pesquisar produto..."
                                loadingFetch={loadingService}
                                options={defaultList.map((p) => ({
                                    value: p.id,
                                    label: `${p.name} ${p.size ? ' - ' + PRODUCT_SIZE_LABELS[p.size] : ''}`,
                                    data: p,
                                }))}
                                value={productId}
                                onSelectedChange={(val: string, opt: any) => {
                                    setProductId(val);
                                    setSelectedProduct(opt.data);
                                }}
                                onInputChange={(val: string) => {
                                    setSearchProduct(val);
                                }}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider">Qtd</Label>
                            <Input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
                            />
                        </div>

                        <Button
                            type="button"
                            onClick={handleAddItem}
                            variant="outline"
                            className="gap-2 bg-green-600 hover:bg-green-700 text-white hover:text-white transition-all"
                        >
                            <Plus className="h-4 w-4" />
                            Adicionar
                        </Button>
                    </div>
                </div>
            </form>

            {/* Lista de Itens a serem salvos */}
            {items.length > 0 && (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="text-xs uppercase font-bold">Produto</TableHead>
                                <TableHead className="text-xs uppercase font-bold text-center">Qtd</TableHead>
                                {/* <TableHead className="text-xs uppercase font-bold text-right">Unitário</TableHead> */}
                                <TableHead className="text-xs uppercase font-bold text-right">Unitário</TableHead>
                                <TableHead className="text-xs uppercase font-bold text-right"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium text-sm">
                                        {item.name} <span className="text-muted-foreground text-xs">({item.size})</span>
                                    </TableCell>
                                    <TableCell className="text-center">{item.quantity}</TableCell>
                                    {/* <TableCell className="text-right text-xs text-muted-foreground">
                                        R$ {item.unitPrice.toFixed(2)}
                                    </TableCell> */}
                                    <TableCell className="text-right text-xs text-muted-foreground">
                                        R$ {item.unitPrice.toFixed(2)}
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

            {/* Botão Final que salva tudo */}
            <div className="flex justify-end pt-2">
                <Button
                    onClick={handleSubmit}
                    disabled={items.length === 0}
                    className="w-full md:w-auto px-10 gap-2 bg-green-700 hover:bg-green-800 dark:text-foreground shadow-xl shadow-green-500/5"
                >
                    <Save className="h-4 w-4" />
                    Finalizar Entrada ({items.length} itens)
                </Button>
            </div>
        </div>
    );
}