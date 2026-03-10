import { AnimatedNumber } from "./AnimatedNumber";

interface KPICardsProps {
  totalDeals: number;
  totalUSD: number;
  ticketPromedio: number;
  eficiencia: number;
}

export function KPICards({ totalDeals, totalUSD, ticketPromedio, eficiencia }: KPICardsProps) {
  const formatUSD = (n: number) => `$${Math.round(n).toLocaleString()}`;
  const formatPct = (n: number) => `${n.toFixed(1)}%`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-card p-6 rounded-lg border border-border">
        <p className="text-sm font-body text-muted-foreground uppercase tracking-wider mb-2">Total Deals</p>
        <AnimatedNumber value={totalDeals} className="text-4xl font-display text-foreground" />
      </div>
      <div className="bg-card p-6 rounded-lg border border-border">
        <p className="text-sm font-body text-muted-foreground uppercase tracking-wider mb-2">Total USD Facturado</p>
        <AnimatedNumber value={totalUSD} format={formatUSD} className="text-4xl font-display text-foreground" />
      </div>
      <div className="bg-card p-6 rounded-lg border border-border">
        <p className="text-sm font-body text-muted-foreground uppercase tracking-wider mb-2">Ticket Promedio</p>
        <AnimatedNumber value={ticketPromedio} format={formatUSD} className="text-4xl font-display text-foreground" />
      </div>
      <div className="bg-card p-6 rounded-lg border border-border border-l-4 border-l-primary">
        <p className="text-sm font-body text-muted-foreground uppercase tracking-wider mb-2">Eficiencia Operativa</p>
        <AnimatedNumber value={eficiencia} format={formatPct} className="text-4xl font-display text-primary" />
        <p className="text-xs text-muted-foreground mt-1">Deals con TS u OC</p>
      </div>
    </div>
  );
}
