import { BaseServicePaginated } from "@/src/ui/services/base-pagination.service";
import { PaginatedStockMoviment, StockMoviment } from "@/src/ui/types/stock-moviment";
import { StockMovimentFilteredDto } from "@/src/ui/types/stock-moviment-filters";
import { useEffect, useState, useMemo } from "react";

const stockMovimentService = new BaseServicePaginated<StockMoviment>("/stockMoviment");

export function useStockMoviment() {
  const [stockMoviment, setStockMoviment] = useState<PaginatedStockMoviment | null>(null);
  const [searchFilters, setSearchFilters] = useState<StockMovimentFilteredDto>({ orderBy: "createdAt:desc" });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    stockMovimentService.findAll(searchFilters)
      .then(setStockMoviment)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [stockMovimentService, searchFilters]);

  const handleRemoveFilter = (key: keyof StockMovimentFilteredDto, value?: any) => {
    setSearchFilters((prev) => {
      const next = { ...prev };

      // verificar se existe algo para ser removido
      if (Array.isArray(next[key])) {
        // remove apenas o item necessario
        (next[key] as string[]) = (next[key] as string[]).filter((v) => v !== value);

        // Se o array ficou vazio, removemos a chave para manter o objeto limpo
        if ((next[key] as string[]).length === 0) delete next[key];
      } else {
        // Remove a chave inteira (name, size, minPrice, etc)
        delete next[key];
      }

      return { ...next };

    })
  }

  const handleClearFilters = () => {
    setSearchFilters({ orderBy: "createdAt:desc" })
  }

  return {
    stockMoviment,
    searchFilters,
    total: stockMoviment?.total,
    page: stockMoviment?.page,
    totalPages: stockMoviment?.total && stockMoviment?.limit
      ? Math.ceil(stockMoviment.total / stockMoviment.limit)
      : 1,
    limit: stockMoviment?.limit,
    loading,

    setStockMoviment,
    setSearchFilters,
    handleClearFilters,
    handleRemoveFilter,
  }
}