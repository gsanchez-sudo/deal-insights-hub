import type { DealRecord } from "@/lib/csv-parser";

interface DataTableProps {
  deals: DealRecord[];
  title?: string;
}

export function DataTable({ deals, title }: DataTableProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-5">
      {title && <h3 className="text-sm font-display font-semibold text-foreground mb-4">{title}</h3>}
      <div className="overflow-auto max-h-[500px]">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-card z-10">
            <tr className="border-b border-border">
              <th className="text-left py-2 px-3 text-xs text-muted-foreground font-semibold uppercase whitespace-nowrap">Deal ID</th>
              <th className="text-left py-2 px-3 text-xs text-muted-foreground font-semibold uppercase whitespace-nowrap">Nombre</th>
              <th className="text-left py-2 px-3 text-xs text-muted-foreground font-semibold uppercase whitespace-nowrap">Encargado</th>
              <th className="text-left py-2 px-3 text-xs text-muted-foreground font-semibold uppercase whitespace-nowrap">País</th>
              <th className="text-left py-2 px-3 text-xs text-muted-foreground font-semibold uppercase whitespace-nowrap">Tipo</th>
              <th className="text-left py-2 px-3 text-xs text-muted-foreground font-semibold uppercase whitespace-nowrap">Estatus</th>
              <th className="text-right py-2 px-3 text-xs text-muted-foreground font-semibold uppercase whitespace-nowrap">USD</th>
              <th className="text-left py-2 px-3 text-xs text-muted-foreground font-semibold uppercase whitespace-nowrap">OC</th>
              <th className="text-left py-2 px-3 text-xs text-muted-foreground font-semibold uppercase whitespace-nowrap">Excepción</th>
            </tr>
          </thead>
          <tbody>
            {deals.map((d, i) => (
              <tr key={`${d.id}-${i}`} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="py-2 px-3 font-mono text-xs text-foreground">{d.id}</td>
                <td className="py-2 px-3 text-foreground max-w-[200px] truncate">{d.nombreDeal || '—'}</td>
                <td className="py-2 px-3 text-foreground">{d.encargado || '—'}</td>
                <td className="py-2 px-3 text-foreground">{d.pais || '—'}</td>
                <td className="py-2 px-3 text-foreground">{d.tipoContrato || '—'}</td>
                <td className="py-2 px-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    d.estatusHubspot === 'IN' ? 'bg-status-in/10 text-status-in' :
                    d.estatusHubspot === 'FORECAST' ? 'bg-status-forecast/10 text-status-forecast' :
                    'bg-muted text-muted-foreground'
                  }`}>{d.estatusHubspot || '—'}</span>
                </td>
                <td className="py-2 px-3 text-right font-semibold text-foreground">${d.usd.toLocaleString('en-US')}</td>
                <td className="py-2 px-3">
                  {(d.oc === 'SI' || d.oc === 'SÍ') && <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">SI</span>}
                </td>
                <td className="py-2 px-3">
                  {(d.excepcion === 'SI' || d.excepcion === 'SÍ') && <span className="text-xs px-2 py-0.5 rounded-full bg-status-exception/10 text-status-exception font-medium">SI</span>}
                </td>
              </tr>
            ))}
            {deals.length === 0 && (
              <tr><td colSpan={9} className="text-center py-8 text-muted-foreground">No hay registros</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-muted-foreground text-right">{deals.length} registros</div>
    </div>
  );
}
