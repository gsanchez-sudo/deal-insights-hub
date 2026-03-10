import type { DealRecord } from "@/lib/csv-parser";
import { FileText } from "lucide-react";

interface OCMonitorProps {
  deals: DealRecord[];
}

export function OCMonitor({ deals }: OCMonitorProps) {
  const ocDeals = deals.filter(d => d.oc === 'SI' || d.oc === 'SÍ');

  return (
    <div className="bg-card rounded-lg border border-border p-5">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-display font-semibold text-foreground">Monitor de OC</h3>
        <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">{ocDeals.length}</span>
      </div>
      {ocDeals.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sin OC en este periodo.</p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-auto">
          {ocDeals.map((d, i) => (
            <div key={i} className="flex items-start justify-between py-2 border-b border-border last:border-0">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">{d.nombreDeal || d.id}</p>
                <p className="text-xs text-muted-foreground">{d.encargado}</p>
              </div>
              <span className="text-sm font-semibold text-primary ml-2 whitespace-nowrap">
                ${d.usd.toLocaleString('en-US')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
