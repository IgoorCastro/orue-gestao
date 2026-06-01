// Hook para controlar os dados da pagina do produto
// Controla a lista a ser exibida, ativar, desativar
// e filtragem de dados

import { feedback } from "@/src/ui/lib/feedback";
import { ProductService } from "@/src/ui/services/product.service";
import { PaginatedProduct, Product } from "@/src/ui/types/product";
import { ProductFiltersDto } from "@/src/ui/types/product-filters";
import { useEffect, useMemo, useState } from "react";

const productService = new ProductService("/product");

export function useProducts() {
    // inserir os filtros padrões aqui!
    // para retornar produtos com withDeleted ou onlyDeleted
    // passar apenas a key com algum dado simples para o filtro
    // exemplo: { onlyDeleted: true } ou { onlyDeleted: false }
    // -> server ira entender a msm coisa! Ira retornar onlyDeleted!
    // não passar nenhuma opção de deleted ira retornar apenas
    // produtos não deletedos 'only e with deleted = false'
    const defaultFilters = {
    }

    const [products, setProducts] = useState<PaginatedProduct | null>(null); // lista de produtos disponiveis em estoque
    const [searchFilters, setSearchFilters] = useState<ProductFiltersDto>(defaultFilters); // lista de filtros para lista de produtos
    const [loading, setLoading] = useState<boolean>(true); // estado de loading
    const [refreshSignal, setRefreshSignal] = useState<boolean>(false); // estado de controle para atualização da pagina

    useEffect(() => {
        setLoading(true);
        productService.findAll(searchFilters)
            .then((res) => {
                setProducts(res);
                setLoading(false);
            })
            .catch(feedback.error)
            .finally(() => setLoading(false));
    }, [searchFilters, refreshSignal]);

    // função para remover filtros individuais (específica)
    const handleRemoveFilter = (key: keyof ProductFiltersDto, value?: any) => {
        setSearchFilters((prev) => {
            const next = { ...prev };

            if (Array.isArray(next[key])) {
                // Remove apenas o item do array
                (next[key] as string[]) = (next[key] as string[]).filter((v) => v !== value);

                // Se o array ficou vazio, removemos a chave para manter o objeto limpo
                if ((next[key] as string[]).length === 0) delete next[key];
            } else {
                // Remove a chave inteira (name, size, minPrice, etc)
                delete next[key];
            }

            return { ...next };
        });
    };

    // função para resetar o filtro
    const handleClearFilters = () => {
        setSearchFilters({}); // Reseta para um objeto vazio
    };

    // função para desativar um produto
    const handleConfirmdDeactivation = (productId: string) => {
        setLoading(true);
        feedback.loading("Desativando produto..")
        productService.delete(productId)
            .then(() => {
                feedback.dismiss();
                feedback.success("Produto desativado!");
                setRefreshSignal(prev => !prev);
            })
            .catch(feedback.error)
            .finally(() => setLoading(false))
    }

    // função para resturar um produto desativado
    const handleRestoreProduct = (productId: string) => {
        setLoading(true);
        feedback.loading("Desativando produto..")
        productService.restore(productId)
            .then(() => {
                feedback.dismiss();
                feedback.success("Produto reativado!");
                setRefreshSignal(prev => !prev);
            })
            .catch(error => {
                feedback.error(error);
                setLoading(false);
            })
            .finally(() => setLoading(false))
    }

    // função para verificar se um produto está desabilitado
    // caso deletedAt esteja presente não seja null ou undefined
    // esse produto está desativado!
    const isDisabledProduct = (deletedAt?: string): boolean => {
        return !!deletedAt;
    }

    // função para mapear as cores de um produto
    // para exibição no layout
    const mapColorsName = (product: Product): string => {
        const colorNames = product.productColor
            ?.map(pc => pc.color?.name) // entra em ProductColor, acessa Color e pega o Name
            .filter(name => !!name)     // remove possíveis valores nulos ou indefinidos
            .join(", ");                // une tudo com vírgula e espaço

        return colorNames;
    }

    return {
        products: products?.data,
        total: products?.total,
        page: products?.page,
        totalPages: products?.total && products?.limit
            ? Math.ceil(products.total / products.limit)
            : 1,
        limit: products?.limit,
        searchFilters,
        loading,

        setRefreshSignal,
        setSearchFilters,

        handleRemoveFilter,
        handleClearFilters,
        handleConfirmdDeactivation,
        handleRestoreProduct,
        mapColorsName,
        isDisabledProduct,
    }
}