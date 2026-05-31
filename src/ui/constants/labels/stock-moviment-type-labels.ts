// Mapeamento para exibição
// dos tipos de movimentação de estoque

import { StockMovimentType } from "../../enum/stock-moviment-type";

export const STOCK_MOVIMENT_TYPE: Record<StockMovimentType, string> = {
    INBOUND : "Entrada",
    OUTBOUND : "Saida",
    TRANSFER : "Transferência",
}