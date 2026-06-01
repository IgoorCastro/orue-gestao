// recebe um número e o formata seguindo
// o padrão monetário brasileiro (pt-BR)
// ex: formatNumber(10)
// retorno: "R$ 10,00"

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}