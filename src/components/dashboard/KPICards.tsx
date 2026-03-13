import { AnimatedNumber } from "./AnimatedNumber";
import { FileCheck, TrendingUp, Users, AlertTriangle } from "lucide-react";

type CardType = 'in' | 'forecast' | 'multicuenta' | 'excepciones' | null;

interface KPICardsProps {
  totalIn: number;
  usdIn: number;
  totalForecast: number;
  usdForecast: number;
  totalMulticuenta: number;
  usdMulticuenta: number;
  totalExcepciones: number;
  usdExcepciones: number;
  activeCard: CardType;
  onCardClick: (card: CardType) => void;
}

const formatUSD = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;

export function KPICards({
  totalIn, usdIn, totalForecast, usdForecast,
  totalMulticuenta, usdMulticuenta, totalExcepciones, usdExcepciones,
  activeCard, onCardClick,
}: KPICardsProps) {
  const cards: { key: CardType; label: string; count: number; usd: number; icon: React.ReactNode; colorClass: string; borderClass: string; bgClass: string }[] = [
    {
      key: 'in', label: 'Total IN', count: totalIn, usd: usdIn,
      icon: <FileCheck className="w-5 h-5" />,
      colorClass: 'text-primary', borderClass: 'border-primary', bgClass: 'bg-primary/10',
    },
    {
      key: 'forecast', label: 'Forecast', count: totalForecast, usd: usdForecast,
      icon: <TrendingUp className="w-5 h-5" />,
      colorClass: 'text-status-forecast', borderClass: 'border-status-forecast', bgClass: 'bg-status-forecast/10',
    },
    {
      key: 'multicuenta', label: 'Multicuentas', count: totalMulticuenta, usd: usdMulticuenta,
      icon: <Users className="w-5 h-5" />,
      colorClass: 'text-status-multicuenta', borderClass: 'border-status-multicuenta', bgClass: 'bg-status-multicuenta/10',
    },
    {
      key: 'excepciones', label: 'Excepciones', count: totalExcepciones, usd: usdExcepciones,
      icon: <AlertTriangle className="w-5 h-5" />,
      colorClass: 'text-status-exception', borderClass: 'border-status-exception', bgClass: 'bg-status-exception/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => {
        const isActive = activeCard === c.key;
        return (
          <button
            key={c.key}
            onClick={() => onCardClick(isActive ? null : c.key)}
            className={`bg-card p-5 rounded-lg border-2 text-left transition-all duration-200 hover:shadow-md shadow-sm ${
              isActive ? `${c.borderClass} shadow-lg` : 'border-border hover:border-muted-foreground/30'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{c.label}</span>
              <div className={`p-2 rounded-lg ${c.bgClass} ${c.colorClass}`}>
                {c.icon}
              </div>
            </div>
            <AnimatedNumber value={c.count} className="text-3xl font-display font-semibold text-foreground block" />
            <div className="mt-1">
              <AnimatedNumber value={c.usd} format={formatUSD} className={`text-sm font-semibold ${c.colorClass}`} />
            </div>
          </button>
        );
      })}
    </div>
  );
}

export type { CardType };
