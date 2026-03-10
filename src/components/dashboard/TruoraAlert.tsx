import type { DealRecord } from "@/lib/csv-parser";

interface TruoraAlertProps {
  deals: DealRecord[];
}

export function TruoraAlert({ deals }: TruoraAlertProps) {
  const atRisk = deals.filter(d => d.truoraScore !== null && d.truoraScore < 7);

  return (
    <div className="bg-card p-6 rounded-lg border border-alert/30">
      <h3 className="text-lg font-display text-alert mb-4">
        Truora Score &lt; 7 — Alerta de Riesgo ({atRisk.length})
      </h3>
      {atRisk.length === 0 ? (
        <p className="text-muted-foreground text-sm">No hay deals con score menor a 7 en este periodo.</p>
      ) : (
        <div className="overflow-auto max-h-72">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="py-2 px-3 text-muted-foreground font-body font-medium">Deal</th>
                <th className="py-2 px-3 text-muted-foreground font-body font-medium">Cliente</th>
                <th className="py-2 px-3 text-muted-foreground font-body font-medium">Score</th>
                <th className="py-2 px-3 text-muted-foreground font-body font-medium">USD</th>
              </tr>
            </thead>
            <tbody>
              {atRisk.map((d, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="py-2 px-3 text-foreground">{d.deal || '—'}</td>
                  <td className="py-2 px-3 text-foreground">{d.cliente || '—'}</td>
                  <td className="py-2 px-3 font-display text-alert">{d.truoraScore}</td>
                  <td className="py-2 px-3 text-foreground">${d.usd.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
