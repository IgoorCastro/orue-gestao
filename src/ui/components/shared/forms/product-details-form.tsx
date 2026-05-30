import { Product } from "@/src/ui/types/product";
import { Separator } from "@/src/ui/components/ui/separator";
import { Label } from "@/src/ui/components/ui/label";
import { format } from "date-fns";
import { ProductType } from "@/src/ui/enum/product-type";
import DefaultLoading from "../ui/loading-default";
import { useProductDetailsDependencies } from "@/src/app/(dashboard)/product/hooks/use-product-details-dependencies";
import { ProductPrintAction } from "@/src/app/(dashboard)/product/components/product-print-action";

type ProductDetailsFormProps = {
  product: Product;
};

export function ProductDetailsForm({ product }: ProductDetailsFormProps) {
  const {
    productComponents: avaliableCompositions,
    loading
  } = useProductDetailsDependencies(product.type === "PRODUCT" ? undefined : { parentId: product.id });

  // Helper para campos de exibição
  const InfoField = ({ label, value }: { label: string; value?: string | number | null }) => (
    <div className="flex flex-col space-y-1">
      <Label className="text-xs text-muted-foreground uppercase font-bold">{label}</Label>
      <div className="text-sm font-medium">{value || "---"}</div>
    </div>
  );

  if (loading) return (<DefaultLoading />);

  return (
    <div className="space-y-6 w-full">
      <div className="flex justify-between items-center sm:gap-10 border-b pb-4">
      <h2 className="text-lg font-semibold uppercase tracking-wider truncate w-full">Ficha do Produto</h2>
      <div className="w-full flex flex-row gap-5 items-center justify-end">
        <ProductPrintAction product={product} compositions={avaliableCompositions} />
        <div className="w-min flex flex-row gap-3 items-center justify-center mr-1">
          <Label className="text-xs text-muted-foreground uppercase font-bold mt-0.5">{product.deletedAt ? "Desativo" : "Ativo"}</Label>
          {product.deletedAt
            ? <span className="h-2 w-2 animate-ping rounded-full bg-red-400 opacity-75" />
            : <span className="h-2 w-2 animate-ping rounded-full bg-green-400 opacity-75" />
          }
        </div>
      </div>
    </div>
      { }
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <InfoField label="Nome do Produto" value={product.name} />
        </div>
        <InfoField label="Tipo" value={product.type} />
        <InfoField label="Preço" value={`R$ ${product.price.toFixed(2)}`} />
        <InfoField label="Tamanho" value={product.size} />
        <InfoField label="SKU" value={product.sku} />
      </div>

      <Separator />

      {/* Identificadores e Logística */}
      <div className="grid grid-cols-2 gap-4">
        <InfoField label="Código de Barras" value={product.barcode} />
        <InfoField label="Mercado Livre ID" value={product.mlProductId} />
      </div>

      <Separator />


      {product.type === ProductType.PRODUCT
        ? (
          <div className="grid grid-cols-2 gap-4">
            {/* PRODUTOS - Atributos (Cores e Materiais) */}
            <div>
              <Label className="text-xs text-muted-foreground uppercase font-bold">Cores</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {product.productColor?.map((c) => (
                  <span key={c.id} className="text-xs bg-secondary px-2 py-0.5 rounded-full">
                    {/* Aqui você usaria o nome da cor se tiver, ou o ID */}
                    {c.color?.name || "Cor"}
                  </span>
                )) || "---"}
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground uppercase font-bold">Materiais</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {product.productMaterial?.map((m) => (
                  <span key={m.id} className="text-xs bg-secondary px-2 py-0.5 rounded-full">
                    {m.material?.name || "Material"}
                  </span>
                )) || "---"}
              </div>
            </div>

          </div>
        )
        : (
          <div className="grid grid-cols-2 gap-4">
            {/* KIT/ PACKAGE */}
            <div>
              <Label className="text-xs text-muted-foreground uppercase font-bold">Produto Principal</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {avaliableCompositions && avaliableCompositions.length > 0 ? (
                  <span className="text-sm font-medium text-primary">
                    {avaliableCompositions[0].parentProduct.name}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">---</span>
                )}
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground uppercase font-bold">Composição</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {avaliableCompositions?.length ? (
                  avaliableCompositions.map((c) => (
                    <span key={c.id} className="text-xs bg-secondary px-2 py-0.5 rounded-full border border-border">
                      {c.componentProduct.name} - {c.componentProduct.size} — <span className="font-bold">{c.quantity} un</span>
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">---</span>
                )}
              </div>
            </div>

          </div>
        )}

      <Separator />

      {/* Seção 4: Datas do Sistema */}
      <div className="grid grid-cols-2 gap-4 bg-muted/30 p-3 rounded-lg">
        <InfoField
          label="Criado em"
          value={product.createdAt ? format(new Date(product.createdAt), "dd/MM/yyyy HH:mm") : undefined}
        />
        <InfoField
          label="Última Atualização"
          value={product.updatedAt ? format(new Date(product.updatedAt), "dd/MM/yyyy HH:mm") : undefined}
        />
      </div>
    </div>
  );
}