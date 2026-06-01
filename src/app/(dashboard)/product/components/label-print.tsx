// componente de função para gerar etiquetas de produtos

import { ProductType } from '@/src/ui/enum/product-type';
import React from 'react';
import Barcode from 'react-barcode';

// Definindo a estrutura dos itens dentro de um KIT
interface CompositionItem {
  quantity: number;
  name: string;
  size: string;
  color?: string;
}

// Definindo os dados que a etiqueta pode receber
interface LabelData {
  name: string;
  sku?: string;
  barcode: string;
  colors: string[];
  type: string;
  size?: string;         // Opcional para KITs
  totalItems?: number;   // Específico para KITs
  composition?: CompositionItem[]; // Específico para KITs
}

interface LabelPrintProps {
  data: LabelData;
  type: ProductType;
}

export const LabelPrint: React.FC<LabelPrintProps> = ({ data, type }) => {
  // função para verificar se a composição de items
  // tem mais de três items
  const exceedsItemLimit = () => {
    if (!data.composition) return false;
    return data.composition?.length > 3;
  }

  return (
    <div className={`w-[100mm] h-[100mm] p-4 flex flex-col justify-between bg-white text-black print:m-0 font-sans`}>
      {/* HEADER */}
      <div className="border-b-4 border-black pb-2">
        <h1 className={`${exceedsItemLimit() ? "text-lg" : "text-xl mb-1"} font-bold uppercase leading-tight wrap-break-words`}>
          {data.name}
        </h1>
        <div className='flex flex-row gap-3 mt-3'>
          {data.type === 'PRODUCT' && data.size && (
            <p className="text-xl font-black">TAM: {data.size} - </p>
          )}
          {data.type === 'PRODUCT' && data.colors && (
            <p className="text-lg font-black">COR: {data.colors}</p>
          )}
        </div>
        {data.type !== 'PRODUCT' && (
          <div className="bg-black text-white inline-block px-2 py-1 text-xs font-bold uppercase">
            KIT / PACKAGE
          </div>
        )}
      </div>

      {/* BODY */}
      <div className="flex-1 py-4 overflow-hidden">
        {data.type !== 'PRODUCT' && data.composition && (
          <div className={`${exceedsItemLimit() ? "space-y-1" : "space-y-2"}`}>
            <p className={`${exceedsItemLimit() ? "text-xs" : "text-sm"} font-bold text-sm underline`}>
              Conteúdo ({data.totalItems || data.composition.length} itens):
            </p>
            <div className="space-y-1">
              {data.composition.map((item, index) => (
                <p key={index} className={`${exceedsItemLimit() ? 'text-[7pt] font-bold' : 'text-[10pt]'} leading-tight border-b border-gray-200 pb-1`}>
                  <span className="font-bold">{item.quantity}x</span> {item.name} {item.size ? " - " + item.size : ""}
                  {item.color && ` (${item.color})`}
                </p>
              ))}
            </div>
          </div>
        )}

        {!exceedsItemLimit() &&
          <div className="flex flex-row">
            <p className="text-sm uppercase text-gray-600">SKU: </p>
            <p className="text-sm font-mono font-bold">{data.sku}</p>
          </div>
        }
      </div>

      {/* FOOTER - BARCODE */}
      <div className="flex flex-col items-center pt-3">
        <Barcode
          value={data.barcode}
          width={2.5}     // Ajustado para preencher melhor os 100mm
          height={exceedsItemLimit() ? 50 : 60}      // Altura ideal para leitura
          fontSize={16}
          font="monospace"
          background="#ffffff"
          lineColor="#000000"
        />
      </div>
    </div>
  );
};