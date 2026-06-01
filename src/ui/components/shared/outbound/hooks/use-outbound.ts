// hook de domínio responsável pela gestão do ciclo de vida de saidas

import { feedback } from "@/src/ui/lib/feedback";
import { useUser } from "@/src/ui/contexts/user-context";
import { ProductStockService } from "@/src/ui/services/product-stock.service";
import { StockMovimentService } from "@/src/ui/services/stock-moviment.service";
import { ProductStock } from "@/src/ui/types/product-stock";
import { useEffect, useMemo, useState } from "react";

type OutboundItemList = {
    name: string
    quantity: number
    size?: string
    fromStockId: string
    totalPrice: number
    unitPrice: number
    productId: string
    productStockId: string
}

const psService = new ProductStockService("/productStock");
const smService = new StockMovimentService("/stockMoviment");

export function useOutbound() {
    // estado de listas
    const [items, setItems] = useState<OutboundItemList[]>([]);
    const [avaliableProductStocks, setAvaliableProductStocks] = useState<ProductStock[]>([]);

    // estado de seleções do usuario
    const [selectedPS, setSelectedPS] = useState<ProductStock | null>(null); // produto em estoque selecionado

    // estado da input de pesquisa do produto 
    const [searchProduct, setSearchProduct] = useState("");

    // estados para definições para transferencia do item atual
    const [fromStock, setFromStock] = useState(""); // estoque de destino
    const [productStockId, setProductStockId] = useState(""); // id do produto selecionado
    const [quantity, setQuantity] = useState(1); // quantidade

    const [loading, setLoading] = useState<boolean>(true); // loading do hook

    // usuário do contexto
    const user = useUser();

    // Efeito para buscar produtos SEMPRE que o estoque de origem mudar
    useEffect(() => {
        setLoading(true);
        if (!fromStock) {
            setAvaliableProductStocks([]);
            setLoading(false);
            return;
        }
        const handler = setTimeout(() => {
            psService.findByStock({ stockId: fromStock, productName: searchProduct })
                .then((res) => {
                    // Filtramos apenas produtos que possuem saldo para saída
                    setAvaliableProductStocks(res.data.filter(ps => ps.quantity > 0));
                })
                .catch((err) => feedback.error(err))
                .finally(() => setLoading(false))
        }, 500);
        return () => {
            clearTimeout(handler);
            setLoading(false);
        };
    }, [fromStock, searchProduct]);

    const handleAddItem = () => {
        if (!selectedPS || !fromStock || quantity <= 0) {
            feedback.error("Selecione um produto e uma quantidade válida.");
            return;
        }

        // Validação de estoque insuficiente antes de adicionar ao carrinho
        if (quantity > selectedPS.quantity) {
            feedback.error(`Saldo insuficiente! Disponível: ${selectedPS.quantity}`);
            return;
        }

        const newItem: OutboundItemList = {
            name: selectedPS.product?.name,
            size: selectedPS.product?.size,
            quantity,
            unitPrice: selectedPS.product?.price || 0,
            totalPrice: (selectedPS.product?.price || 0) * quantity,
            fromStockId: fromStock,
            productId: selectedPS.productId,
            productStockId: selectedPS.id,
        };

        setItems([...items, newItem]);

        // Limpa campos de produto
        setProductStockId("");
        setSelectedPS(null);
        setQuantity(1);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    // Lógica de barcode: busca produto e adiciona ou soma quantidade
    const handleBarCodeScanned = (barcode: string, quantity: number) => {
        // Busca o produto no array padrão por barcode
        const product = avaliableProductStocks.map(ps => ps.product).find(p => p.barcode.toLowerCase() === barcode.toLowerCase());
        const currentPs = avaliableProductStocks.find(ps => ps.product.id === product?.id);

        if (!fromStock) {
            feedback.error("Selecione um estoque de destino antes de adicionar produtos");
            return;
        }

        if (!product) {
            feedback.error(`Produto com código ${barcode} não encontrado não encontrado no estoque`);
            return;
        }

        if(!currentPs) {
            feedback.error("Erro durante o processamento do atual produto.");
            return;
        }

        // Verifica se o produto já existe no carrinho
        const existingItemIndex = items.findIndex(
            item => item.productId === product.id && item.fromStockId === fromStock
        );

        if (existingItemIndex >= 0) {
            // Produto já existe > soma quantidade
            const updatedItems = [...items];
            updatedItems[existingItemIndex].quantity += quantity;
            updatedItems[existingItemIndex].totalPrice =
                updatedItems[existingItemIndex].unitPrice * updatedItems[existingItemIndex].quantity;
            setItems(updatedItems);
            feedback.success(`${product.name} - Quantidade aumentada`);
            clearState();
        } else {
            // Produto novo > adiciona ao carrinho
            const newItem: OutboundItemList = {
                productId: product.id,
                name: product.name,
                size: product.size,
                quantity: quantity,
                unitPrice: product.price,
                totalPrice: product.price,
                fromStockId: fromStock,
                productStockId: currentPs.id,
            };
            setItems([...items, newItem]);
            feedback.success(`${product.name} adicionado ao carrinho`);
            clearState();
        }
    };

    const clearState = () => {
        setProductStockId("");
        setSelectedPS(null);
        setQuantity(1);
    };

    const clearStateFull = () => {
        setItems([]);
        setFromStock("");
        setProductStockId("");
        setSelectedPS(null);
        setQuantity(1);
    };

    const handleSubmit = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (items.length === 0) return;

        // verifica se há um usuario conectado
        if (!user) {
            feedback.error("Usuário não autenticado. Faça login para registrar movimentações.");
            return;
        }

        const toastId = feedback.loading("Processando saída de produtos...");

        try {
            const promises = items.map(item =>
                smService.create({
                    productStockId: item.productStockId,
                    fromStockId: item.fromStockId, // Agora enviamos FROM ao invés de TO
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    totalPrice: item.totalPrice,
                    type: "OUTBOUND", // Tipo fixo para esta página
                    userId: user.id
                })
            );

            await Promise.all(promises);

            feedback.dismiss(toastId);
            feedback.success(`Saída de ${items.length} itens realizada com sucesso!`);
            clearStateFull();
        } catch (error) {
            feedback.dismiss(toastId);
            feedback.error(error);
        }
    };

    return {
        // campos
        items,
        avaliableProductStocks,
        fromStock,
        productStockId,
        quantity,
        loading,

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
    }
}