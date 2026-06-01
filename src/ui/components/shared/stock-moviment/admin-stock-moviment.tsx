"use client";

import { formatDate } from "@/src/ui/utils/format-data";
import { Dropdown } from "@/src/ui/components/shared/ui/dropdown-menu";
import { StockMovimentFilteredDto } from "@/src/ui/types/stock-moviment-filters";
import { useStockMovimentFilterDependencies } from "./hooks/use-stock-moviment-filter-dependencies";
import { useStockMoviment } from "./hooks/use-stock-moviment";
import { FilterModal } from "@/src/ui/components/shared/common/filter-modal";
import { StockMovimentFilterForm } from "@/src/ui/components/shared/filters/stock-moviment-filter-form";
import { FilterBadges } from "@/src/ui/components/shared/common/filter-badges";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/ui/components/ui/table";
import { capitalizeFirstLetter } from "@/src/ui/utils/capitalize-first-letter";
import { GenericPagination } from "@/src/app/(dashboard)/product/components/pagination";
import { STOCK_MOVIMENT_TYPE } from "@/src/ui/constants/labels/stock-moviment-type-labels";
import { StockMovimentType } from "@/src/ui/enum/stock-moviment-type";
import { useStockMovimentPageState } from "./hooks/use-stock-moviment-page-state";
import DefaultLoading from "../ui/loading-default";
import { PRODUCT_SIZE_LABELS } from "@/src/ui/constants/labels/product-size-labels";

export default function AdminStockMovimentsPage() {

  const {
    stockMoviment,
    searchFilters,
    totalPages,
    loading,

    setSearchFilters,
    handleClearFilters,
    handleRemoveFilter,
  } = useStockMoviment();

  // Hook dependencias para filtro
  const { 
    stocks, 
    users
  } = useStockMovimentFilterDependencies();

  // estados da pagina
  const {
    openFilterModal,

    setOpenFilterModal,
  } = useStockMovimentPageState();

  loading && <DefaultLoading />

  return (
    <div className="max-w-ful h-full flex flex-col items-center p-2 sm:p-6">
      <div className="w-full flex justify-between gap-4 items-center mb-5 py-4 px-5 rounded-2xl border">
        <div className="flex flex-col gap-3">
          <div className="w-full flex flex-row justify-between items-center gap-5">
            <h1 className="text-lg sm:text-2xl font-bold">Movimentação em estoque</h1>
            <FilterModal
              open={openFilterModal}
              onOpen={setOpenFilterModal}
            >
              <StockMovimentFilterForm
                onApply={(filters) => {
                  // PASSAR PARA O ESTADO
                  // FILTROS SELECIONADOS CHEGAM AQUI
                  setSearchFilters(filters);
                }}
                onClose={() => setOpenFilterModal(false)}
                defaultFilter={searchFilters}
              />
            </FilterModal>
          </div>

          {/* EXIBIÇÃO DAS TAGS DE FILTRO ATIVOS */}
          <FilterBadges<StockMovimentFilteredDto>
            filters={searchFilters}
            onRemove={handleRemoveFilter}
            onClearAll={handleClearFilters}
            dependencies={{
              user: users,
              stock: stocks,
            }}
            configs={{
              type: {
                label: "Tipo",
                render: (v: StockMovimentType) => STOCK_MOVIMENT_TYPE[v],
              },
              quantity: { label: "Qnt" },
              fromStockId: {
                label: "Origem",
                render: (id) => {
                  // Busca o estoque completo na lista que você já tem na página
                  const stock = stocks.find(s => s.id === id);
                  if (!stock) return id;
                  // Monta o nome customizado: Loja + Estoque
                  return `${stock?.store?.name.toUpperCase() ?? "Matriz"} - ${stock.name.charAt(0).toUpperCase() + stock.name.slice(1)}`;
                }
              },
              toStockId: {
                label: "Destino",
                render: (id) => {
                  // Busca o estoque completo na lista que você já tem na página
                  const stock = stocks.find(s => s.id === id);
                  if (!stock) return id;
                  // Monta o nome customizado: Loja + Estoque
                  return `${stock?.store?.name.toUpperCase() ?? "Matriz"} - ${stock.name.charAt(0).toUpperCase() + stock.name.slice(1)}`;
                }
              },
              user: {
                label: "Usu",
                render: (id) => {
                  const user = users.find(u => u.id === id);
                  if (!user) return id;
                  return user.name;
                }
              },
              stock: { label: "Sto" },
              fromDate: {
                label: "De",
                render: (v) => new Date(v).toLocaleDateString('pt-BR'),
              },
              toDate: {
                label: "Até",
                render: (v) => new Date(v).toLocaleDateString('pt-BR'),
              },
            }}
          />
        </div>
      </div>

      <div className="w-full md:w-[98%] rounded-md border bg-card shadow-sm overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              {/* Padrão pl-10, py-5 e text-lg font-bold */}
              <TableHead className="pl-10 py-5 text-lg font-bold min-w-35">Tipo</TableHead>
              <TableHead className="px-6 py-5 text-lg font-bold min-w-55">Produto</TableHead>
              <TableHead className="px-6 py-5 text-lg font-bold min-w-45">Origem</TableHead>
              <TableHead className="px-6 py-5 text-lg font-bold min-w-45">Destino</TableHead>
              <TableHead className="px-4 py-5 text-lg font-bold text-center">Qtd</TableHead>
              <TableHead className="px-6 py-5 text-lg font-bold text-center min-w-45">Valor Total</TableHead>
              <TableHead className="px-6 py-5 text-lg font-bold">Usuário</TableHead>

              {/* Coluna de Data com seu Dropdown de ordenação */}
              <TableHead className="flex justify-center w-full h-full pr-10 py-5 text-lg font-bold text-right min-w-40">
                <Dropdown
                  key="date"
                  title="Data"
                  value={searchFilters?.orderBy?.split(":").includes("createdAt") ? searchFilters.orderBy.split(":")[1] : ""}
                  onChange={(value) =>
                    setSearchFilters(prevs => ({
                      ...prevs,
                      orderBy: value ? `createdAt:${value}` : undefined
                    }))
                  }
                  items={[
                    { label: "Crescente (1-30)", value: "asc" },
                    { label: "Decrescente (30-1)", value: "desc" },
                  ]}
                />
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {stockMoviment && stockMoviment.data.length > 0 ? (
              stockMoviment.data.map((sm) => (
                <TableRow key={sm.id} className="hover:bg-muted/40 transition-colors">
                  {/* Tipo: Estilizado com badge sutil */}
                  <TableCell className="pl-10 py-4 font-medium">
                    <span className="text-foreground/70">{STOCK_MOVIMENT_TYPE[sm.type]}</span>
                  </TableCell>

                  {/* Produto */}
                  <TableCell className="px-6 py-4 capitalize">
                    {sm.productStock?.product?.name}  {sm.productStock.product.size && ' - ' + PRODUCT_SIZE_LABELS[sm.productStock.product.size] }
                  </TableCell>

                  {/* Origem */}
                  <TableCell className="px-6 py-4 text-sm">
                    {sm.fromStock?.store
                      ? (<span className="font-semibold">{sm.fromStock.store.name.toUpperCase()} - {capitalizeFirstLetter(sm.fromStock.name)}</span>)
                      : (<span className="font-semibold">{ sm.fromStock && "Matriz" }</span>)
                    }

                  </TableCell>

                  {/* Destino */}
                  <TableCell className="px-6 py-4 text-sm">
                    {sm.toStock?.store?.name 
                      ? (<span className="font-semibold">{sm.toStock.store.name.toUpperCase()} - {capitalizeFirstLetter(sm.toStock.name)}</span>)
                      : (<span className="font-semibold">{ sm.toStock && "Matriz" }</span>)
                    }
                  </TableCell>

                  {/* Quantidade */}
                  <TableCell className="px-4 py-4 text-center font-bold">
                    {sm.quantity}
                  </TableCell>

                  {/* Valor Total */}
                  <TableCell className="px-6 py-4 text-center font-medium text-green-600 dark:text-green-400">
                    R$ {sm.totalPrice.toFixed(2)}
                  </TableCell>

                  {/* Usuário */}
                  <TableCell className="px-6 py-4 text-muted-foreground italic">
                    {sm.user?.name}
                  </TableCell>

                  {/* Data formatada à direita */}
                  <TableCell className="pr-10 py-4 text-right text-sm font-medium">
                    {formatDate(sm.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                  Nenhuma movimentação registrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <GenericPagination
        currentPage={searchFilters.page || 1}
        totalPages={totalPages}
        onPageChange={(page) => setSearchFilters(prev => ({ ...prev, page }))}
      />
    </div>

  );
}