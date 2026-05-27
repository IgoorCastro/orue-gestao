import { useEffect, useState, useRef } from "react";
import { feedback } from "../lib/feedback";

interface UseBarCodeReaderOptions {
  onBarCodeRead: (barcode: string) => void;
  enabled?: boolean;
}

/**
 * Hook genérico para leitura de código de barras
 * Funciona com leitores que simulam teclado (ex: Elgin El250)
 * 
 * O leitor envia os dígitos + Enter, este hook detecta o padrão e captura o código
 * Ao ler o código, chama o callback `onBarCodeRead` com o código capturado
 */

export function useBarCodeReader({
  onBarCodeRead,
  enabled,
  quantity = 1,
}: {
  onBarCodeRead: (code: string, quantity: number) => void;
  enabled: boolean;
  quantity: number,
}) {
  const [barCode, setBarCode] = useState("");

  useEffect(() => {
    // if (!enabled) return;
    setBarCode("")

    let buffer = "";
    let lastTime = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;

      // se usuário estiver digitando em input "normal", ignora
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.getAttribute("contenteditable") === "true"
      ) {
        return;
      }

      const now = Date.now();
      const diff = now - lastTime;
      lastTime = now;

      // se demorou muito entre teclas, reseta (provavelmente humano)
      if (diff > 80) {
        buffer = "";
      }

      if (e.key === "Enter") {
        if (buffer.length >= 4) {
          setBarCode(buffer);
          onBarCodeRead(buffer, quantity);
        }
        buffer = "";
        return;
      }

      if (e.key.length === 1) {
        buffer += e.key;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () =>
      window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, onBarCodeRead]);

  return { barCode };
}