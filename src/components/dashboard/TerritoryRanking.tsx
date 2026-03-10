import type { DealRecord } from "@/lib/csv-parser";
import { useMemo } from "react";
import { MapPin } from "lucide-react";

interface TerritoryRankingProps {
  deals: DealRecord[];
}

export function TerritoryRanking({ deals }: TerritoryRankingProps) {
  const territories = useMemo(() => {
    const map = new Map<string, { count: number; usd: number }>();
    deals.forEach(d => {
      const pais = d.pais || 'Sin País';
      const prev = map.get(pais) || { count: 0, usd: 0 };
      map.set(pais, { count: prev.count + 1, usd: prev.usd + d.usd });
    });
    return Array.from(map.entries())
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.usd - a.usd);
  }, [deals]);

  const maxUsd = territories[0]?.usd || 1;

  return (
    <div className="bg-card rounded-lg border border-border p-5">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-display font-semibold text-foreground">Ranking de Territorios</h3>
      </div>
      <div className="space-y-3 max-h-80 overflow-auto">
        {territories.map((t, i) => (
          <div key={t.name}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-foreground">
                <span className="text-muted-foreground mr-2">#{i + 1}</span>
                {t.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {t.count} deals · <span className="font-semibold text-foreground">${t.usd.toLocaleString('en-US')}</span>
              </span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(t.usd / maxUsd) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
