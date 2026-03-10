/**
 * Capitaliza a primeira letra da string recebida.
 * Mantém o restante do texto inalterado.
 *
 * Exemplo:
 * "azul marinho" → "Azul marinho"
 */

export default function capitalizeFirstLetter(input: string) {
    const trimmed = input.trim();
    return trimmed.charAt(0).toUpperCase + trimmed.slice(1);
}