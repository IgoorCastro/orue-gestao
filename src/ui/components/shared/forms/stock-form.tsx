"use client";

import { Stock } from "@/src/ui/types/stock";
import { Label } from "@/src/ui/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/ui/components/ui/select";
import { Separator } from "@/src/ui/components/ui/separator";
import { Button } from "@/src/ui/components/ui/button";
import { Save } from "lucide-react";
import { Input } from "@/src/ui/components/ui/input";
import { ConfirmModal } from "../modals/confirm-modal";
import DefaultLoading from "../ui/loading-default";
import { useStockDependencies } from "@/src/app/(dashboard)/stock/hooks/use-stock-dependencies";
import { useStockForm } from "@/src/app/(dashboard)/stock/hooks/use-stock-form";
import { GenericSelect } from "@/src/app/(dashboard)/product/components/select-list";
import { StockType } from "@/src/ui/enum/stock-type";
import { STOCK_TYPE_LABELS } from "@/src/ui/constants/labels/stock-type-labels";

type Props = {
  onSuccess: () => void;
  initialData?: Stock;
};

export function StockForm({ onSuccess, initialData }: Props) {
  // hook das dependencias necessarias para exibição no form
  const {
    stores: avaliableStores,
    loading,
  } = useStockDependencies();

  // hook das funções de gestão das inputs e envios
  const {
    name,
    type,
    storeId,

    setName,
    setType,
    setStoreId,

    handleSubmit,
  } = useStockForm({ initialData, onSuccess });

  if (loading) return <DefaultLoading />;

  return (
    <form id="stock-form" onSubmit={handleSubmit} className="space-y-6">
      {/* Seção Principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-1 space-y-2">
          <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider truncate">
            Nome do estoque
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Ex: Depósito Central"
            value={name ? name[0].toUpperCase() + name.slice(1) : ""}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="md:col-span-1 space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider">
            Tipo de estoque
          </Label>
          <Select
            value={type}
            onValueChange={(v) => setType(v as StockType)}
          >
            <SelectTrigger className="min-w-24">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(StockType).map((value) => (
                <SelectItem key={value} value={value}>
                  {STOCK_TYPE_LABELS[value]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Vínculo com Loja */}
      <div className="grid grid-cols-1 gap-4 max-w-full">
        <GenericSelect
          label="Loja Vinculada"
          placeholder="Selecione a loja"
          options={avaliableStores.map((p) => ({
            value: p.id,
            label: p.name.toUpperCase(),
            data: p,
          }))}
          value={storeId}
          onChange={(value) => setStoreId(value)}
        />
      </div>

      <Separator />

      {/* Ação Final */}
      <div className="flex justify-end pt-4">
        <ConfirmModal
          title={initialData ? "Confirmar atualização?" : "Confirmar registro?"}
          description="Atualizar dados do produto."
          confirmText="Sim, atualizar"
          formId="stock-form" // id do form para rastreio no componente
        >
          <Button type="button" className="w-full md:w-auto px-8 gap-2 bg-primary hover:bg-primary/90">
            <Save className="h-4 w-4" />
            Salvar
          </Button>
        </ConfirmModal>

      </div>
    </form>
  );
}