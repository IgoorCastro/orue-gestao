// hook de domínio responsável pela gestão do ciclo de vida do entrada

import { feedback } from "@/src/ui/lib/feedback";
import { useUser } from "@/src/ui/contexts/user-context";
import { ProductService } from "@/src/ui/services/product.service";
import { StockMovimentService } from "@/src/ui/services/stock-moviment.service";
import { Product } from "@/src/ui/types/product";
import { useEffect, useState, useMemo } from "react";

type InboundItemList = {
    name: string
    productId: string
    quantity: number
    size?: string
    toStockId: string
    totalPrice: number
    unitPrice: number
}

const sm = new StockMovimentService("/stockMoviment");

export function useInbound() {
    // Estados para a lista "carrinho"
    const [items, setItems] = useState<InboundItemList[]>([]);
    const [defaultList, setDefaultList] = useState<Product[]>([]);

    // estado de seleções do usuario  
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); // produto selecioando para entrada

    // estado da input de pesquisa do produto 
    const [searchProduct, setSearchProduct] = useState("");

    // estados para definições para entrada do item atual
    const [toStock, setToStock] = useState(""); // estoque de destino
    const [productId, setProductId] = useState(""); // id do produto selecionado
    const [quantity, setQuantity] = useState(1); // quantidade para entrada

    const [loading, setLoading] = useState<boolean>(true); // estado de loading do hook

    // usuário do contexto
    const user = useUser();

    // Memoizar a service para evitar múltiplas instâncias
    const productService = useMemo(() => new ProductService("/product"), []);

    useEffect(() => {
        setLoading(true)
        const handler = setTimeout(() => {
            productService.findAll({ name: searchProduct })
                .then(res => {
                    setDefaultList(res.data);
                    setLoading(false);
                });
        }, 500);

        return () => {
            clearTimeout(handler);
            setLoading(false)
        };
    }, [searchProduct]);

    // Adiciona o produto na lista temporária e limpa os campos de produto
    const handleAddItem = () => {
        if (!selectedProduct || !toStock || quantity <= 0) return;

        const newItem = {
            productId: selectedProduct.id,
            name: selectedProduct.name,
            size: selectedProduct.size,
            quantity,
            unitPrice: selectedProduct.price,
            totalPrice: selectedProduct.price * quantity,
            toStockId: toStock,
        };

        setItems([...items, newItem]);

        // Limpa apenas os campos do produto, mantém o estoque de destino
        setProductId("");
        setSelectedProduct(null);
        setQuantity(1);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    // Lógica de barcode: busca produto e adiciona ou soma quantidade
    const handleBarCodeScanned = (barcode: string, quantity: number) => {
        // Busca o produto no array padrão por barcode
        const product = defaultList.find(p => p.barcode?.toLowerCase() === barcode.toLowerCase());

        // Produto não encontrado na lista atual
        if (!product) {
            feedback.error(`Produto com código ${barcode} não encontrado no estoque atual`);
            return;
        }

        if (!toStock) {
            
            feedback.error("Selecione um estoque de destino antes de adicionar produtos");
            return;
        }

        // Verifica se o produto já existe no carrinho
        const existingItemIndex = items.findIndex(
            item => item.productId === product.id && item.toStockId === toStock
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
            const newItem: InboundItemList = {
                productId: product.id,
                name: product.name,
                size: product.size,
                quantity: quantity,
                unitPrice: product.price,
                totalPrice: product.price,
                toStockId: toStock,
            };
            setItems([...items, newItem]);
            feedback.success(`${product.name} adicionado ao carrinho`);
            clearState();
        }
    };

    const clearState = () => {
        setProductId("");
        setSelectedProduct(null);
        setQuantity(1);
    }

    const clearStateFull = () => {
        setItems([]);
        setToStock("");
        setProductId("");
        setSelectedProduct(null);
        setQuantity(0);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0) return;

        feedback.loading("Processando entrada de produtos...");
        
        // verifica se há um usuario conectado
        if (!user) {
            feedback.error("Usuário não autenticado. Faça login para registrar movimentações.");
            return;
        }

        try {

            // Aqui usamos Promise.all para salvar todos os itens da lista
            const promises = items.map(item =>
                sm.create({
                    productStockId: item.productId,
                    toStockId: item.toStockId,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    totalPrice: item.totalPrice,
                    type: "INBOUND",
                    userId: user.id
                })
            );

            await Promise.all(promises);

            // Sucesso!
            feedback.dismiss(); // Remove o loading
            feedback.success(`Entrada de ${items.length} itens realizada com sucesso!`);
            clearStateFull();
        } catch (error) {
            feedback.dismiss();
            feedback.error(error); // O utilitário já trata a mensagem de erro da API
        }
    };

    return {
        // campos
        items,
        defaultList,
        toStock,
        productId,
        quantity,
        loading,

        // setters
        setToStock,
        setProductId,
        setSearchProduct,
        setSelectedProduct,
        setQuantity,
        setLoading,

        // utils
        handleSubmit,
        handleAddItem,
        removeItem,
        handleBarCodeScanned,
    }
}