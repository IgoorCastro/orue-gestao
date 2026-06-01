"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ProductStockService } from "@/src/ui/services/product-stock.service";
import { ProductService } from "@/src/ui/services/product.service";
import { StockService } from "@/src/ui/services/stock.service";
import { StoreService } from "@/src/ui/services/store.service";
import { ProductStock } from "@/src/ui/types/product-stock-with-relations";
import { Stock } from "@/src/ui/types/stock";
import { StockMoviment } from "@/src/ui/types/stock-moviment";
import { Store } from "@/src/ui/types/store";
import { BaseServicePaginated } from "@/src/ui/services/base-pagination.service";
import { capitalizeFirstLetter } from "@/src/ui/utils/capitalize-first-letter";
import { AlertTriangle, ArrowRightLeft, LayoutDashboard, Package, StoreIcon, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/ui/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/ui/components/ui/table";
import { StockMovimentType } from "@/src/ui/enum/stock-moviment-type";
import { useAdminDashboard } from "./hooks/use-admin-dashboard";
import { formatCurrency } from "@/src/ui/utils/format-currency";
import { formatNumber } from "@/src/ui/utils/format-number";
import { STOCK_MOVIMENT_TYPE } from "@/src/ui/constants/labels/stock-moviment-type-labels";

export default function AdminDashboard() {

  const {
        // campos
        stocks,
        selectedStockId,
        totalValue,
        totalProducts,
        totalStocks,
        totalProductStocks,
        recentMovements,
        lowStockItems,
        loading,
        error,

        // setters
        setSelectedStockId,

        // utils
        topProducts,
        filteredTitle,
    } = useAdminDashboard();

  if (loading ) {
    return (
      <main className="flex-1 p-6">
        <div className="rounded-2xl p-8 bg-card shadow-sm border border-slate-200 dark:border-slate-800">
          <p className="text-base text-slate-600 dark:text-slate-300">Carregando dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 max-w-screen overflow-hidden border-t p-2 md:p-8 space-y-6 md:space-y-8 animate-in fade-in duration-700">
      <section className="flex justify-end">
        <div className="flex flex-col gap-2 max-w-70 px-3 pt-3 md:p-0">
          <label className="text-xs font-bold text-muted-foreground uppercase ml-1">Filtro de Localização</label>
          <select
            value={selectedStockId}
            onChange={(event) => setSelectedStockId(event.target.value)}
            className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
          >
            <option value="">Todos os estoques</option>
            {stocks.map((stock) => (
              <option key={stock.id} value={stock.id}>
                {capitalizeFirstLetter(stock.name)} {stock.store ? `- ${stock.store.name.toUpperCase()}` : ""}
              </option>
            ))}
          </select>
        </div>
      </section>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      {/* Grid de KPIs - Números Grandes */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 p-3 md:p-0">
        {[
          { label: "Valor em Estoque", value: formatCurrency(totalValue), sub: filteredTitle, icon: TrendingUp, color: "text-green-600" },
          { label: "Itens no Filtro", value: formatNumber(totalProductStocks), sub: "Total de unidades", icon: Package, color: "text-blue-600" },
          { label: "SKUs Ativos", value: formatNumber(totalProducts), sub: "Produtos cadastrados", icon: ArrowRightLeft, color: "text-purple-600" },
          { label: "Unidades Ativas", value: formatNumber(totalStocks), sub: "Lojas e centros", icon: StoreIcon, color: "text-orange-600" },
        ].map((kpi, i) => (
          <Card key={i} className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider">{kpi.label}</p>
                <kpi.icon className={`h-5 w-5 ${kpi.color} opacity-80`} />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-bold tracking-tight">{kpi.value}</h3>
                <p className="text-[10px] text-muted-foreground font-medium uppercase">{kpi.sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Grid Principal: Movimentações e Sidebars */}
      <section className="w-full grid gap-6 grid-cols-1 xl:grid-cols-3">
        
        {/* Tabela de Movimentações Recentes */}
        <div className="w-full xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Movimentações Recentes
            </h2>
            <Link href="/stock-moviment" className="text-xs font-bold text-primary hover:underline uppercase">Ver tudo</Link>
          </div>
          
          <div className="w-[98%] md:min-w-[50%] md:w-auto flex rounded-xl border bg-card shadow-sm overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="pl-6 py-4 font-bold uppercase text-[11px]">Tipo</TableHead>
                  <TableHead className="py-4 font-bold uppercase text-[11px]">Produto</TableHead>
                  <TableHead className="py-4 font-bold uppercase text-[11px] text-center">Qtd</TableHead>
                  <TableHead className="py-4 font-bold uppercase text-[11px] text-center">Origem/Destino</TableHead>
                  <TableHead className="pr-6 py-4 font-bold uppercase text-[11px] text-right">Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentMovements.slice(0, 8).map((movement) => (
                  <TableRow key={movement.id} className="hover:bg-muted/30 transition-colors border-b last:border-0">
                    <TableCell className="pl-6 py-4">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        movement.type === StockMovimentType.TRANSFER ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {STOCK_MOVIMENT_TYPE[movement.type]}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium text-sm">
                      {movement.productStock?.product?.name ?? "-"}
                    </TableCell>
                    <TableCell className="text-center font-bold text-sm">
                      {formatNumber(movement.quantity)}
                    </TableCell>
                    <TableCell className="text-center text-xs text-muted-foreground">
                      {movement.fromStock?.name ?? "---"} → {movement.toStock?.name ?? "---"}
                    </TableCell>
                    <TableCell className="pr-6 text-right text-xs font-medium">
                      {new Date(movement.createdAt ?? "").toLocaleDateString("pt-BR")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Coluna Direita: Widgets de Status */}
        <aside className="space-y-6 p-3 md:p-0">
          {/* Acesso Rápido - Botões Modernos */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground px-2">Acesso Rápido</h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Entrada", href: "/inbound", color: "hover:border-green-500/50" },
                { label: "Saída", href: "/outbound", color: "hover:border-orange-500/50" },
                { label: "Transferência", href: "/transfer", color: "hover:border-blue-500/50" },
                { label: "Estoque", href: "/product-stock", color: "hover:border-primary/50" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center justify-center p-3 rounded-xl border bg-card text-xs font-bold uppercase transition-all shadow-sm ${link.color}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Produtos Críticos - Foco no Alerta */}
          <Card className="border-none shadow-sm bg-orange-500/5 dark:bg-orange-500/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase flex items-center gap-2 text-orange-600">
                <AlertTriangle className="h-4 w-4" />
                Produtos Críticos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {lowStockItems.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">Nenhum alerta no momento.</p>
              ) : (
                lowStockItems.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-orange-200/50">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold truncate max-w-40">{item.product.name}</span>
                      <span className="text-[10px] text-muted-foreground uppercase">{item.product.size}</span>
                    </div>
                    <span className="text-sm font-black text-orange-600">{formatNumber(item.quantity)}</span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Performance / Top Moving */}
          <Card className="border-none shadow-sm bg-card/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Top Performance (30 dias)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {topProducts.map((product) => (
                <div key={product.key} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold">{product.name} {product.size ? `- ${product.size}` : ''}</span>
                      <span className="text-[10px] text-muted-foreground uppercase">Estoque: {formatNumber(product.currentStock)}</span>
                    </div>
                    <span className="text-xs font-bold text-primary">{formatNumber(product.totalMovimented)} mov.</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-1000" 
                      style={{ width: `${Math.min((product.totalMovimented / 50) * 100, 100)}%` }} 
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

        </aside>
      </section>
    </main>
  );
} 