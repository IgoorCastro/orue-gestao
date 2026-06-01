"use client";

// Shadcn UI, Custom Components e Icons
import { Input } from "@/src/ui/components/ui/input";
import { Label } from "@/src/ui/components/ui/label";
import { Button } from "@/src/ui/components/ui/button";
import { Separator } from "@/src/ui/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/ui/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/ui/components/ui/table";
import DefaultLoading from "@/src/ui/components/shared/ui/loading-default";
import { ProductSearchSelect } from "@/src/ui/components/shared/ui/searchable-select";
import { Plus, Trash2, ArrowUpRight } from "lucide-react";

// Services, Types e Hooks
import { useOutbound } from "./hooks/use-outbound";
import { useBarCodeReader } from "@/src/ui/hooks/use-barcode-reader";
import { useStockMovimentDependencies } from "../stock-moviment/hooks/use-stock-moviment-dependencies";
import { StockType } from "@/src/ui/enum/stock-type";
import { capitalizeFirstLetter } from "@/src/ui/utils/capitalize-first-letter";
import { PRODUCT_SIZE_LABELS } from "@/src/ui/constants/labels/product-size-labels";

export default function OutboundAdminPage() {

    // Dependências de estoque (Origem)
    const {
        stocks: avaliableStocks,
        loading: loadingDependencies
    } = useStockMovimentDependencies();

    const {
        // campos
        items,
        avaliableProductStocks,
        fromStock,
        productStockId,
        quantity,
        loading: loadingService,

        setItems,
        setFromStock,
        setProductStockId,
        setSelectedPS,
        setSearchProduct,
        setQuantity,

        // utils
        handleSubmit,
        handleAddItem,
        removeItem,
        handleBarCodeScanned,
    } = useOutbound();

    const { barCode } = useBarCodeReader({
        onBarCodeRead: handleBarCodeScanned,
        enabled: !!fromStock, // só funciona se um estoque foi selecionado
        quantity,
    });


    if (loadingDependencies) return <DefaultLoading />

    return (
        <div className="p-5 space-y-6">
            <div className="">
                <h1 className="text-2xl font-bold">Saída</h1>
                <p className="text-sm text-gray-600">
                    Registre a retirada de itens para pedidos de venda ou consumo interno.
                </p>
            </div>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                {/* Origem da Saída */}
                <div className="flex flex-col md:flex-row gap-2 items-center">
                    <div className="w-full space-y-2">
                        <Label className="text-xs font-bold uppercase tracking-wider text-destructive">Estoque de Origem (Saída)</Label>
                        <Select value={fromStock} onValueChange={(v) => {
                            setFromStock(v);
                            setItems([]); // Limpa o carrinho se mudar o estoque de origem para evitar conflito
                        }}>
                            <SelectTrigger className="border-destructive/20">
                                <SelectValue placeholder="Selecione de onde o produto vai sair" />
                            </SelectTrigger>
                            <SelectContent>
                                {avaliableStocks.map((value) => (
                                    <SelectItem key={value.id} value={value.id}>
                                        {value.store?.name ? `${value.store.name.toUpperCase()} - ` : ""}
                                        {value.name && value.type !== StockType.MAIN ? capitalizeFirstLetter(value.name) : "Matriz"}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {fromStock && (
                            <p className="text-xs text-green-600 font-medium">✓ Leitor de código de barras ativo</p>
                        )}
                    </div>
                </div>

                { }
                <div className="p-4 bg-muted/20 rounded-lg border border-dashed border-destructive/30 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="md:col-span-2 space-y-2">
                            <ProductSearchSelect
                                label="Produto em Estoque"
                                placeholder={fromStock ? "Pesquisar produto disponível..." : "Selecione um estoque primeiro"}
                                loadingFetch={loadingService}
                                options={avaliableProductStocks.map((ps) => ({
                                    value: ps.id,
                                    label: `${ps.product?.name}  ${ps.product.size ? ' - ' + PRODUCT_SIZE_LABELS[ps.product.size] : ""} (Disponível: ${ps.quantity})`,
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
                            <Label className="text-xs font-bold uppercase tracking-wider">Qtd Saída</Label>
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
                            variant="outline"
                            disabled={!productStockId}
                            className="gap-2 border-destructive bg-destructive/70 hover:bg-destructive/90 text-white hover:text-white transition-all"
                        >
                            <Plus className="h-4 w-4" />
                            Adicionar
                        </Button>
                    </div>
                </div>
            </form>

            {/* Tabela de Conferência de Saída */}
            {items.length > 0 && (
                <div className="rounded-md border border-destructive/10">
                    <Table>
                        <TableHeader className="bg-destructive/5">
                            <TableRow>
                                <TableHead className="text-xs uppercase font-bold text-destructive">Produto para Saída</TableHead>
                                <TableHead className="text-xs uppercase font-bold text-center">Qtd</TableHead>
                                <TableHead className="text-xs uppercase font-bold text-right">Unitário</TableHead>
                                <TableHead className="text-xs uppercase font-bold text-right"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map((item, index) => (
                                <TableRow key={index} className="hover:bg-destructive/5">
                                    <TableCell className="font-medium text-sm">
                                        {item.name} <span className="text-muted-foreground text-xs">({item.size})</span>
                                    </TableCell>
                                    <TableCell className="text-center font-bold">{item.quantity}</TableCell>
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

            <div className="flex justify-end pt-2">
                <Button
                    onClick={handleSubmit}
                    disabled={items.length === 0}
                    className="w-full md:w-auto px-10 gap-2 bg-destructive/90 hover:bg-destructive/80 text-white dark:text-foreground shadow-xl shadow-destructive/4"
                >
                    <ArrowUpRight className="h-4 w-4" />
                    Finalizar Saída ({items.length} itens)
                </Button>
            </div>
        </div>
    );
}