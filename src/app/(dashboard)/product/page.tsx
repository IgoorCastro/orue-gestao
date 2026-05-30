'use client'

import { Plus } from "lucide-react";
import { Product } from "@/src/ui/types/product";
import { CrudModal } from "@/src/ui/components/shared/crud/crud-modal";
import { ProductForm } from "@/src/ui/components/shared/forms/product-form";
import { useProductFilterDependencies } from "./hooks/use-product-filter-dependencies";
import { mapProductType } from "@/src/ui/utils/map-product-type";
import { FilterModal } from "@/src/ui/components/shared/common/filter-modal";
import { ProductFilterForm } from "@/src/ui/components/shared/filters/product-filter-form";
import { FilterBadges } from "@/src/ui/components/shared/common/filter-badges";
import { useProducts } from "./hooks/use-products";
import { GenericPagination } from "./components/pagination";
import { ProductFiltersDto } from "@/src/ui/types/product-filters";
import { ActionButtons } from "@/src/ui/components/shared/actions/data-action";
import { ResponsiveModal } from "@/src/ui/components/shared/common/reponsive-modal";
import { ProductDetailsForm } from "@/src/ui/components/shared/forms/product-details-form";
import { useProductPageState } from "./hooks/use-product-page-state";
import DefaultLoading from "@/src/ui/components/shared/ui/loading-default";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/ui/components/ui/table";
import { CustomButton } from "@/src/ui/components/shared/ui/button";
import { Dropdown } from "@/src/ui/components/shared/ui/dropdown-menu";

export default function ProductsPage() {
  // hook responsável por buscar dados (para a tabela),
  // desativar e filtrar produtos e gerenciar o refresh da page
  const {
    products,
    totalPages,
    searchFilters,
    loading: loadingProducts,

    setRefreshSignal,
    setSearchFilters,

    handleRemoveFilter,
    handleClearFilters,
    handleConfirmdDeactivation,
    handleRestoreProduct,
    mapColorsName,
    isDisabledProduct,
  } = useProducts();

  // hook para controle de estados da pagina
  // controle das modals e o produto selecionado
  const {
    openCrudModal,
    openFilterModal,
    openItemModal,
    selectedProduct,

    setOpenCrudModal,
    setOpenFilterModal,
    setOpenItemModal,

    openItemDetails,
    openEditModal,
    openCreateProduct,
  } = useProductPageState();

  // hooks das dependencias utilizadas na pagina
  const {
    colors,
    materials,
    loading: loadingDeps,
  } = useProductFilterDependencies();

  if (loadingProducts || loadingDeps) return <DefaultLoading />;

  return (
    <div className="max-w-ful h-full flex flex-col items-center p-2 sm:p-6">
      <div className="w-full flex justify-between gap-4 items-center mb-5 py-4 px-5 rounded-2xl border">
        <div className="flex flex-col gap-3">
          <div className="w-min flex flex-row justify-between gap-5">
          <h1 className="text-lg sm:text-2xl font-bold">Produtos</h1>
          <FilterModal
            open={openFilterModal}
            onOpen={setOpenFilterModal}
          >
            <ProductFilterForm
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
        <FilterBadges<ProductFiltersDto>
          filters={searchFilters}
          onRemove={handleRemoveFilter}
          onClearAll={handleClearFilters}
          dependencies={{
            colors: colors,
            materials: materials,
          }}
          configs={{
            name: { label: "Busca" },
            barcode: { label: "Cód" },
            type: { label: "Tipo", render: (v) => mapProductType(v) },
            size: { label: "Tam" },
            colors: { label: "Cor" },
            materials: { label: "Mat" },
            modelIds: { label: "Mod" },
            minPrice: { label: "Preço mín", render: (v) => `R$ ${v}` },
            maxPrice: { label: "Preço máx", render: (v) => `R$ ${v}` },
            onlyDeleted: { label: "Listagem", render: (v) => `${v ? 'Desativados' : ''}` },
            withDeleted: { label: "Listagem", render: (v) => `${v ? 'Com desativados' : ''}` },
          }}
        />
        </div>

        <div className="flex w-auto">
          <CustomButton
            text="Novo Produto"
            icon={<Plus size={18} />}
            variant="default"
            className="text-xs"
            onClick={() => openCreateProduct()}
          />
        </div>
      </div>

      <div className="w-full md:w-[98%] rounded-md border bg-card shadow-sm overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              {/* Produto com Dropdown de Ordenação */}
              <TableHead className="pl-10 py-5 text-lg font-bold min-w-75">
                <Dropdown
                  title="Produto"
                  key="name"
                  value={searchFilters?.orderBy?.split(":").includes("name") ? searchFilters.orderBy.split(":")[1] : ""}
                  onChange={(value: any) =>
                    setSearchFilters(prevs => ({
                      ...prevs,
                      orderBy: value ? `name:${value}` : undefined
                    }))
                  }
                  items={[
                    { label: "Crescente (A-Z)", value: "asc" },
                    { label: "Decrescente (Z-A)", value: "desc" },
                  ]}
                />
              </TableHead>

              {/* Colunas com tamanho mínimo para não esmagar a info */}
              <TableHead className="px-6 py-5 text-lg font-bold text-center min-w-37.5">Cores</TableHead>
              <TableHead className="px-6 py-5 text-lg font-bold text-center min-w-30">Tamanho</TableHead>

              {/* Preço com Dropdown de Ordenação */}
              <TableHead className="flex justify-center w-full h-full px-6 py-5 text-lg font-bold text-center min-w-37.5">
                <Dropdown
                  title="Preço"
                  key="price"
                  value={searchFilters?.orderBy?.split(":").includes("price") ? searchFilters.orderBy.split(":")[1] : ""}
                  onChange={(value) =>
                    setSearchFilters(prevs => ({
                      ...prevs,
                      orderBy: value ? `price:${value}` : undefined
                    }))
                  }
                  items={[
                    { label: "Menor Preço", value: "asc" },
                    { label: "Maior Preço", value: "desc" },
                  ]}
                />
              </TableHead>

              <TableHead className="px-6 py-5 text-lg font-bold text-center min-w-35">Tipo</TableHead>
              <TableHead className="px-10 py-5 text-lg text-center font-bold">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {products && products.length > 0 ? (
              products.map((product) => (
                <TableRow
                  key={product.id}
                  className="cursor-pointer transition-colors hover:bg-muted/40"
                >
                  {/* Nome do Produto */}
                  <TableCell
                    className="pl-10 py-4 text-md font-medium capitalize text-foreground/80"
                    onClick={() => openItemDetails(product)}
                  >
                    {product.name}
                  </TableCell>

                  {/* Cores */}
                  <TableCell
                    className="px-6 py-4 text-center text-sm text-muted-foreground"
                    onClick={() => openItemDetails(product)}
                  >
                    {mapColorsName(product)}
                  </TableCell>

                  {/* Tamanho */}
                  <TableCell
                    className="px-6 py-4 text-center font-semibold"
                    onClick={() => openItemDetails(product)}
                  >
                    {product.size}
                  </TableCell>

                  {/* Preço formatado */}
                  <TableCell
                    className="px-6 py-4 text-center font-medium text-green-600 dark:text-green-400"
                    onClick={() => openItemDetails(product)}
                  >
                    R$ {product.price.toFixed(2)}
                  </TableCell>

                  {/* Tipo */}
                  <TableCell
                    className="px-6 py-4 text-center"
                    onClick={() => openItemDetails(product)}
                  >
                    <span className="bg-secondary/50 px-2 py-1 rounded text-xs">
                      {mapProductType(product.type)}
                    </span>
                  </TableCell>

                  {/* Ações */}
                  <TableCell
                    className="flex justify-center items-center py-3 md:py-6"
                    onClick={(e) => {
                      openItemDetails(product);
                      e.stopPropagation();
                    }}
                  >
                    <div className="w-min" onClick={(e) => e.stopPropagation()}>
                      <ActionButtons
                        isDeleted={isDisabledProduct(product.deletedAt)}
                        onEdit={() => openEditModal(product)}
                        onDelete={() => handleConfirmdDeactivation(product.id)}
                        onRestore={() => handleRestoreProduct(product.id)}
                        disabled={loadingProducts}
                        onSucces={() => setRefreshSignal(prev => !prev)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  Nenhum produto encontrado.
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

      {/* Modal dos detalhes do produto */}
      <ResponsiveModal
        title="Detalhes do Produto"
        open={openItemModal}
        onOpenChange={setOpenItemModal}
        description="Visualização completa das informações do produto."
        size="full"
      >
        {selectedProduct && <ProductDetailsForm product={selectedProduct} />}
      </ResponsiveModal>

      <CrudModal
        title={selectedProduct ? "Produto" : "Novo Produto"}
        open={openCrudModal}
        onOpenChange={setOpenCrudModal}
      >
        <ProductForm
          initialData={selectedProduct}
          onSuccess={(newProduct: Product) => {
            setRefreshSignal(prevs => !prevs)
            setOpenCrudModal(false);
          }}
        />
      </CrudModal>
    </div>
  );
}