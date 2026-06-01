"use client";

import { useState } from "react";
import { FilterModal } from "@/src/ui/components/shared/common/filter-modal";
import { ProductStockFilterForm } from "@/src/ui/components/shared/filters/product-stock-filter.form";
import { useProductStock } from "./hooks/use-product-stock";
import { GenericPagination } from "../product/components/pagination";
import { FilterBadges } from "@/src/ui/components/shared/common/filter-badges";
import { ProductStockFiltersDto } from "@/src/ui/types/product-stock-filters";
import { useProductStockFilterDependencies } from "./hooks/use-product-stock-filter-dependencies";
import DefaultLoading from "@/src/ui/components/shared/ui/loading-default";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/src/ui/components/ui/table";
import { ActionButtons } from "@/src/ui/components/shared/actions/data-action";
import { formatCurrency } from "@/src/ui/utils/format-currency";

export default function UsersPage() {
  const [openFilterModal, setOpenFilterModal] = useState<boolean>(false);
  const {
    productStock,
    totalPages,
    searchFilters,
    totalStockValue,
    loading: loadingProductStock,

    setSearchFilters,
    setRefreshSignal,

    handleClearFilters,
    handleRemoveFilter,
    calcTotalProductValueInStock,
    handleConfirmdDeactivation,
    handleRestoreProductStock,
    isDisableProductStock,
  } = useProductStock();

  const {
    products,
    stocks,
    loading: loadingFiltersDependencies,
  } = useProductStockFilterDependencies();

  if (loadingProductStock || loadingFiltersDependencies) return <DefaultLoading />;

  return (
    <div className="w-full flex flex-col items-center p-2 sm:p-6">
      <div className="w-full flex justify-between gap-4 items-center mb-5 py-4 px-5 rounded-2xl border">
        <div className="flex flex-col gap-3">
          <div className="w-min flex flex-row justify-between gap-5">
            <h1 className="text-lg sm:text-2xl truncate font-bold">Produtos em estoque</h1>
            <FilterModal
              open={openFilterModal}
              onOpen={setOpenFilterModal}
            >
              <ProductStockFilterForm
                onApply={(filters) => {
                  // PASSAR PARA O ESTADO
                  // FILTROS SELECIONADOS CHEGAM AQUI
                  filters.page = 1; // volta pra página 1
                  setSearchFilters(filters);
                }}
                onClose={() => setOpenFilterModal(false)}
                defaultFilter={searchFilters}
              />
            </FilterModal>
          </div>
          {/* EXIBIÇÃO DAS TAGS DE FILTRO ATIVOS */}
          <FilterBadges<ProductStockFiltersDto>
            filters={searchFilters}
            dependencies={{
              stockId: stocks,
              productId: products,
            }}
            onRemove={handleRemoveFilter}
            onClearAll={handleClearFilters}
            configs={{
              stockId: {
                label: "Estoque",
                render: (id) => {
                  const stock = stocks.find(st => st.id === id); // retorna apenas o estoque com a ID correta
                  if (!stock) return id;
                  return `${stock?.store?.name.toUpperCase() ?? "Matriz"} ${stock.type !== "MAIN" ? " - " + stock.name.charAt(0).toUpperCase() + stock.name.slice(1) : ""}`;
                }
              },
              productId: {
                label: "Produto",
                render: (id) => {
                  const prod = products.find(p => p.id === id);
                  if (!prod) return id;
                  return `${prod.name ?? 'Desconhecido'}`;
                }
              }
            }}
          />
        </div>
      </div>

      <div className="w-full md:w-[98%] rounded-md border bg-card shadow-sm overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              {/* Mantendo o padrão pl-10, py-5 e text-lg font-bold */}
              <TableHead className="pl-10 py-5 text-lg font-bold min-w-62.5">Estoque</TableHead>
              <TableHead className="px-6 py-5 text-lg font-bold min-w-50">Produto</TableHead>
              <TableHead className="px-6 py-5 text-lg font-bold min-w-37.5">Cores</TableHead>
              <TableHead className="px-6 py-5 text-lg font-bold text-center">Quantidade</TableHead>
              <TableHead className="px-6 py-5 text-lg font-bold text-center">Total (R$)</TableHead>
              <TableHead className="px-8 md:px-15 py-5 text-lg text-center font-bold">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {productStock && productStock.length > 0 ? (
              productStock.map((ps) => (
                <TableRow
                  key={ps.id}
                  className="transition-colors hover:bg-muted/40"
                >
                  {/* Coluna Estoque: Loja (UPPERCASE) - Estoque (Capitalize) */}
                  <TableCell className="pl-10 py-4 text-md font-medium text-foreground/80">
                    {ps.stock?.store?.name
                      ? `${ps.stock?.store?.name.toUpperCase()} - ${ps.stock.name.charAt(0).toUpperCase() + ps.stock.name.slice(1)}`
                      : "Matriz"}
                  </TableCell>

                  {/* Produto e Tamanho */}
                  <TableCell className="px-6 py-4 text-md capitalize">
                    {ps.product.name} {ps.product.size && ' - ' + ps.product.size }
                  </TableCell>

                  {/* Cores */}
                  <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                    {ps.product.colorsName?.join(", ")}
                  </TableCell>

                  {/* Quantidade centralizada */}
                  <TableCell className="px-6 py-4 text-center font-semibold">
                    {ps.quantity}
                  </TableCell>

                  {/* Valor Total do Item */}
                  <TableCell className="px-6 py-4 text-center font-medium text-green-600 dark:text-green-400">
                    {calcTotalProductValueInStock({ quantity: ps.quantity, unitPrice: ps.product.price })}
                  </TableCell>

                  {/* Coluna Ações centralizada para Produtos em estoque */}
                  <TableCell
                    className="flex justify-center items-center py-4"
                  >
                    <div className="w-min" onClick={(e) => e.stopPropagation()}>
                      <ActionButtons
                        isDeleted={isDisableProductStock(ps.deletedAt)}
                        onDelete={() => handleConfirmdDeactivation(ps.id)}
                        onRestore={() => handleRestoreProductStock(ps.id)}
                        disabled={loadingProductStock}
                        onSucces={() => setRefreshSignal(prev => !prev)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  Nenhum registro de estoque encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          {/* Rodapé da Tabela com o Valor Geral Ajustado para colSpan 3 */}
          <TableFooter className="bg-muted/30">
            <TableRow>
              <TableCell colSpan={4} className="pl-10 py-5 text-lg font-bold text-right text-muted-foreground ">
                Valor Total em Estoque
              </TableCell>

              <TableCell className="py-5 text-lg font-bold text-center">
                -
              </TableCell>

              <TableCell className="py-5 text-lg font-bold text-center text-primary">
                {formatCurrency(totalStockValue)}
              </TableCell>
            </TableRow>
          </TableFooter>
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