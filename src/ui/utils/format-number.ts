// recebe um número e o formata seguindo o padrão brasileiro (pt-BR)
// adicionando separadores de milhares.
// ex: formatNumber(1000)
// retorno: 1.000

export function formatNumber(value: number) {
  return new Intl.NumberFormat("pt-BR").format(value);
}