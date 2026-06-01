"use client";

import { Product } from "@/src/ui/types/product";
import { MultiSelect } from "@/src/app/(dashboard)/product/components/multi-select";
import { useProductForm } from "@/src/app/(dashboard)/product/hooks/use-product-form";

// Shadcn UI
import { Input } from "@/src/ui/components/ui/input";
import { Label } from "@/src/ui/components/ui/label";
import { Button } from "@/src/ui/components/ui/button";
import { Separator } from "@/src/ui/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/ui/components/ui/select";

import { MultiSelectWithQuantity } from "@/src/app/(dashboard)/product/components/multi-select-with-quantity";
import { ConfirmModal } from "../modals/confirm-modal";
import DefaultLoading from "../ui/loading-default";
import { useProductDependencies } from "@/src/app/(dashboard)/product/hooks/use-product-dependencies";
import { ProductType } from "@/src/ui/enum/product-type";
import { ProductSize } from "@/src/ui/enum/product-size";
import { PRODUCT_TYPE_LABELS } from "@/src/ui/constants/labels/product-type-labels";
import { PRODUCT_SIZE_LABELS } from "@/src/ui/constants/labels/product-size-labels";

type Props = {
  onSuccess: (product: Product) => void;
  initialData?: Product;
};

export function ProductForm({ onSuccess, initialData }: Props) {
  const {
    models: avaliableModels,
    colors: availableColors,
    materials: availableMaterials,
    products: avaliableProducts,
    loading
  } = useProductDependencies();

  const {
    name, price, type,
    size, mlProductId, model,
    colors, materials, selectedComponentsProducts,

    setName, setPrice, setType,
    setSize, setMlProductId, setModel,
    setColors, setMaterials, setSelectedComponentsProducts,

    handleSubmit, isUpdate,
  } = useProductForm({ initialData, onSuccess });

  if (loading) return <DefaultLoading />;

  return (
    <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
      {/* Seção Principal */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3 space-y-2">
          <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider">Nome do Produto</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Camiseta Dry-Fit Classic 2026"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price" className="text-xs font-bold uppercase tracking-wider">Preço</Label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-xs text-muted-foreground">R$</span>
            <Input
              id="price"
              type="number"
              className="pl-8"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Características Técnicas */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider">Tamanho</Label>
          {type === ProductType.PRODUCT && (
            <Select value={size} onValueChange={(v) => setSize(v as ProductSize)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ProductSize).map((v) => (
                  <SelectItem key={v} value={v}>
                    {PRODUCT_SIZE_LABELS[v]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider">Tipo</Label>
          <Select value={type} onValueChange={(v) => {
            setType(v as ProductType);
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ProductType).map((v) => (
                <SelectItem key={v} value={v}>{PRODUCT_TYPE_LABELS[v]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider">Modelo</Label>
          {type === ProductType.PRODUCT && (
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {avaliableModels.map((m) => (
                  <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {type === ProductType.PRODUCT
        ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/20 rounded-lg border">
              <MultiSelect
                label="Cores"
                items={availableColors}
                selected={colors}
                setSelected={setColors}
                getId={c => c.id}
                getLabel={c => c.name}
              />
            </div>
            <div className="p-4 bg-muted/20 rounded-lg border">
              <MultiSelect
                label="Materiais"
                items={availableMaterials}
                selected={materials}
                setSelected={setMaterials}
                getId={m => m.id}
                getLabel={m => m.name}
              />
            </div>
          </div>
        )
        : (
          <div className="grid grid-cols-1 gap-4">
            <div className="p-4 bg-muted/20 rounded-lg border">
              <MultiSelectWithQuantity
                label="Produtos"
                items={avaliableProducts.data}
                selected={selectedComponentsProducts}
                setSelected={setSelectedComponentsProducts}
                getId={c => c.id}
                getLabel={c => `${c.name} ${c.size ? " - " + c.size : ""}`}
              />
            </div>
          </div>
        )
      }

      <div className="space-y-2">
        <Label htmlFor="mlId" className="text-xs font-bold uppercase tracking-wider text-yellow-600">Identificação Mercado Livre</Label>
        <Input
          id="mlId"
          value={mlProductId}
          onChange={(e) => setMlProductId(e.target.value)}
          placeholder="MLB..."
        />
      </div>

      <div className="flex justify-end pt-4">
        <ConfirmModal
          title={isUpdate() ? "Confirmar atualização?": "Confirmar registro?"}
          description={isUpdate() ? "Atualizar dados do produto." : "Deseja registrar novo produto."}
          confirmText={isUpdate() ? "Sim, atualizar" : "Sim, registrar"}
          formId="product-form" // id do form para rastreio no componente
        >
          <Button type="button">Salvar Produto</Button>
        </ConfirmModal>
      </div>
    </form>
  );
}