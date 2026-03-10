import type { DealRecord } from "@/lib/csv-parser";

interface ExceptionsTableProps {
  deals: DealRecord[];
}

export function ExceptionsTable({ deals }: ExceptionsTableProps) {
  const exceptions = deals.filter(d => d.excepcion === 'SI' || d.excepcion === 'SÍ');

  return (
    <div className="bg-card p-6 rounded-lg border border-alert/30">
      <h3 className="text-lg font-display text-alert mb-4">
        Excepciones ({exceptions.length})
      </h3>
      {exceptions.length === 0 ? (
        <p className="text-muted-foreground text-sm">No hay excepciones en este periodo.</p>
      ) : (
        <div className="overflow-auto max-h-80">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="py-2 px-3 text-muted-foreground font-body font-medium">Deal</th>
                <th className="py-2 px-3 text-muted-foreground font-body font-medium">Cliente</th>
                <th className="py-2 px-3 text-muted-foreground font-body font-medium">Tipo</th>
                <th className="py-2 px-3 text-muted-foreground font-body font-medium">País</th>
                <th className="py-2 px-3 text-muted-foreground font-body font-medium">USD</th>
              </tr>
            </thead>
            <tbody>
              {exceptions.map((d, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-muted/20">
                  <td className="py-2 px-3 text-foreground">{d.deal || '—'}</td>
                  <td className="py-2 px-3 text-foreground">{d.cliente || '—'}</td>
                  <td className="py-2 px-3 text-foreground">{d.tipoContrato || '—'}</td>
                  <td className="py-2 px-3 text-foreground">{d.pais || '—'}</td>
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
