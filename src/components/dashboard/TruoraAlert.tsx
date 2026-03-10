import type { DealRecord } from "@/lib/csv-parser";
import { ShieldAlert } from "lucide-react";

interface TruoraAlertProps {
  deals: DealRecord[];
}

export function TruoraAlert({ deals }: TruoraAlertProps) {
  const atRisk = deals.filter(d => d.truoraScore !== null && d.truoraScore < 7);

  return (
    <div className="bg-card p-5 rounded-lg border border-status-exception/30">
      <div className="flex items-center gap-2 mb-4">
        <ShieldAlert className="w-4 h-4 text-status-exception" />
        <h3 className="text-sm font-display font-semibold text-status-exception">
          Truora Score &lt; 7 ({atRisk.length})
        </h3>
      </div>
      {atRisk.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sin alertas de riesgo en este periodo.</p>
      ) : (
        <div className="overflow-auto max-h-64">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="py-2 px-3 text-xs text-muted-foreground font-semibold">Deal</th>
                <th className="py-2 px-3 text-xs text-muted-foreground font-semibold">Encargado</th>
                <th className="py-2 px-3 text-xs text-muted-foreground font-semibold">Score</th>
                <th className="py-2 px-3 text-xs text-muted-foreground font-semibold text-right">USD</th>
              </tr>
            </thead>
            <tbody>
              {atRisk.map((d, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="py-2 px-3 text-foreground text-xs">{d.id}</td>
                  <td className="py-2 px-3 text-foreground">{d.encargado || '—'}</td>
                  <td className="py-2 px-3 font-semibold text-status-exception">{d.truoraScore}</td>
                  <td className="py-2 px-3 text-foreground text-right">${d.usd.toLocaleString('en-US')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
