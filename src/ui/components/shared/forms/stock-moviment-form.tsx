"use client";

import { StockMoviment } from "@/src/ui/types/stock-moviment";
import { StockMovimentType, useStockMovimentForm } from "@/src/app/(dashboard)/stock-moviment/hooks/use-stock-moviment-form";
import { StockMovimentService } from "@/src/ui/services/stock-moviment.service";
import { useEffect, useState } from "react";
import { Product } from "@/src/ui/types/product";
import { ProductStockService } from "@/src/ui/services/product-stock.service";
import { ProductStock } from "@/src/ui/types/product-stock";
import { ProductService } from "@/src/ui/services/product.service";
import { Label } from "@/src/ui/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/ui/components/ui/select";
import { Input } from "@/src/ui/components/ui/input";
import { Separator } from "@/src/ui/components/ui/separator";
import { Button } from "@/src/ui/components/ui/button";
import { Save } from "lucide-react";
import { ProductSearchSelect } from "../ui/searchable-select";
import { feedback } from "@/src/ui/lib/feedback";
import { useStockMovimentDependencies } from "@/src/app/(dashboard)/stock-moviment/hooks/use-stock-moviment-dependencies";

type Props = {
  onSuccess: (sm: StockMoviment) => void;
  initialData?: StockMoviment;
};

const psService = new ProductStockService("/productStock");
const productService = new ProductService("/product");
const sm = new StockMovimentService("/stockMoviment");

export function StockMovimentForm({ onSuccess, initialData }: Props) {
  const [avaliableProducts, setAvaliableProducts] = useState<ProductStock[]>([]);
  const [defaultList, setDefaultList] = useState<Product[]>([]);

  // Hook das dependencias
  const { stocks: avaliableStocks, loading } = useStockMovimentDependencies();

  const {
    product,
    selectedProductStock,
    selectedProduct,
    fromStock,
    toStock,
    quantity,
    totalPrice,
    unitPrice,
    type,

    // setters
    setProduct,
    setSelectedProductStock,
    setSelectedProduct,
    setFromStock,
    setToStock,
    setQuantity,
    setTotalPrice,
    setUnitPrice,
    setType,
  } = useStockMovimentForm();

  useEffect(() => {
    // Se nao tiver estoque de origem
    // apresenta todos os produtos
    if (!fromStock) {
      productService.findAll()
        .then((res) => {
          setDefaultList(res.data);
        })
        .catch(console.error);
    }
    psService.findByStock({stockId: fromStock}) // AQUI
      .then((res) => {
        setAvaliableProducts(res.data.map(r => r));
      })
      .catch(console.error);

  }, [fromStock]);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    feedback.loading("Processando entrada de movimentação");

    try {
      const newStockMoviment = await sm.create({
        productStockId: product, fromStockId: fromStock, toStockId: toStock, quantity, totalPrice, unitPrice, type, userId: "7b8dd7eb-f720-4d62-86ee-49711297f4f8"
      });

      feedback.dismiss();
      feedback.success("Entrada de movimentação realizada com sucesso!")
      onSuccess(newStockMoviment); // atualiza tabela
    } catch (error) {
      feedback.dismiss();
      feedback.error(error); // O utilitário já trata a mensagem de erro da API
    }
  };

  function mapType(type: string): string {
    switch (type) {
      case "INBOUND":
        return "Entrada";
      case "OUTBOUND":
        return "Saida";
      case "TRANSFER":
        return "Trasnferencia";
      default:
        return "Desconhecido"
    }
  }

  if (loading) return <p>Carregando...</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Origem e Destino */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider">Do estoque</Label>
          <Select
            value={fromStock}
            onValueChange={(v) => setFromStock(v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sem estoque" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Sem estoque</SelectItem>
              {avaliableStocks.map((value) => (
                <SelectItem key={value.id} value={value.id}>
                  {value.store?.name ? `${value.store.name.toUpperCase()} - ` : ""}
                  {value.name && value.type !== "MAIN" ? value.name.charAt(0).toUpperCase() + value.name.slice(1) : "Main"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider">Para o estoque</Label>
          <Select
            value={toStock}
            onValueChange={(v) => setToStock(v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sem estoque" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Sem estoque</SelectItem>
              {avaliableStocks.map((value) => (
                <SelectItem key={value.id} value={value.id}>
                  {value.store?.name ? `${value.store.name.toUpperCase()} - ` : ""}
                  {value.name && value.type !== "MAIN" ? value.name.charAt(0).toUpperCase() + value.name.slice(1) : "Main"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Seleção de Produto e Info de Estoque */}
      <div className="space-y-2 p-4 bg-muted/20 rounded-lg border">
        <ProductSearchSelect
          label="Produto"
          placeholder="Selecione um produto"
          options={(avaliableProducts.length ? avaliableProducts : defaultList).map((p: any) => ({
            value: p.id,
            label: avaliableProducts.length ? `${p.product?.name} - ${p.product?.size}` : `${p.name} - ${p.size}`,
            data: p,
          }))}
          value={product}
          onChange={(value: string, option: any) => {
            setProduct(value);
            if (avaliableProducts.length) {
              setSelectedProductStock(option?.data ?? null);
              setSelectedProduct(option?.data?.product ?? null);
            } else {
              setSelectedProduct(option?.data ?? null);
            }
            const price = option?.data?.product?.price ?? option?.data?.price ?? 0;
            setUnitPrice(price);
            setTotalPrice(price * quantity);
          }}

        />
        {/* <GenericSelect
        label="Produto"
        placeholder="Selecione um produto"
        options={(avaliableProducts.length ? avaliableProducts : defaultList).map((p: any) => ({
          value: p.id,
          label: avaliableProducts.length ? `${p.product?.name} - ${p.product?.size}` : `${p.name} - ${p.size}`,
          data: p,
        }))}
        value={product}
        onChange={(value, option) => {
          setProduct(value);
          if (avaliableProducts.length) {
            setSelectedProductStock(option?.data ?? null);
            setSelectedProduct(option?.data?.product ?? null);
          } else {
            setSelectedProduct(option?.data ?? null);
          }
          const price = option?.data?.product?.price ?? option?.data?.price ?? 0;
          setUnitPrice(price);
          setTotalPrice(price * quantity);
        }}
      /> */}
        {selectedProductStock && (
          <p className="text-[10px] font-bold uppercase text-muted-foreground ml-1">
            Disponível em estoque: <span className="text-primary">{selectedProductStock.quantity}</span>
          </p>
        )}
      </div>

      {/* Quantidade e Movimentação */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider">Quantidade</Label>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => {
              const qty = Number(e.target.value);
              setQuantity(qty);
              setUnitPrice(selectedProduct?.price ?? 0);
              setTotalPrice(selectedProduct ? qty * selectedProduct.price : 0);
            }}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider">Movimentação</Label>
          <Select value={type} onValueChange={(v) => setType(v as StockMovimentType)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(StockMovimentType).map((value) => (
                <SelectItem key={value} value={value}>
                  {mapType(value)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Valores Financeiros (Read Only) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Valor Unitário</Label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-xs text-muted-foreground">R$</span>
            <Input
              className="pl-8 bg-muted/50"
              value={(selectedProduct?.price ?? 0).toFixed(2)}
              readOnly
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Valor Total</Label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-xs text-muted-foreground">R$</span>
            <Input
              className="pl-8 bg-muted/50 font-bold"
              value={(selectedProduct ? selectedProduct.price * quantity : 0).toFixed(2)}
              readOnly
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className="flex justify-end pt-2">
        <Button type="submit" className="w-full md:w-auto px-10 gap-2 bg-primary hover:bg-primary/90">
          <Save className="h-4 w-4" />
          Salvar Movimentação
        </Button>
      </div>
    </form>
  );
}