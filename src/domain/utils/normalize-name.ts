/**
 * Normalizador para nomes.
 * Utilizar antes do capitalize-first-letter
 * Utilidade: Evitar duplicados.
 *
 * Exemplo:
 * "CAMISETA" → "camiseta", " Camiseta" → "camiseta"
 */

export default function normalizeName(name: string): string {
    return name.trim().toLowerCase();
}