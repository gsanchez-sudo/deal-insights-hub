import { useState, useMemo } from "react";
import { Search, X, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { DealRecord } from "@/lib/csv-parser";

interface DealSearchModalProps {
  deals: DealRecord[];
}

export function DealSearchModal({ deals }: DealSearchModalProps) {
  const [query, setQuery] = useState("");
  const [selectedDeal, setSelectedDeal] = useState<DealRecord | null>(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return deals.filter(d =>
      d.id.toLowerCase().includes(q) ||
      d.nombreDeal.toLowerCase().includes(q) ||
      d.encargado.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [query, deals]);

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar Deal por ID o nombre..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 bg-card border-border"
        />
        {query && (
          <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 max-h-72 overflow-auto">
          {results.map((d) => (
            <button
              key={d.id}
              onClick={() => { setSelectedDeal(d); setQuery(""); }}
              className="w-full text-left px-4 py-3 hover:bg-muted/50 border-b border-border last:border-0 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-foreground">{d.id}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  d.estatusHubspot === 'IN' ? 'bg-status-in/10 text-status-in' :
                  d.estatusHubspot === 'FORECAST' ? 'bg-status-forecast/10 text-status-forecast' :
                  'bg-muted text-muted-foreground'
                }`}>{d.estatusHubspot || '—'}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{d.nombreDeal}</p>
            </button>
          ))}
        </div>
      )}

      <Dialog open={!!selectedDeal} onOpenChange={() => setSelectedDeal(null)}>
        <DialogContent className="sm:max-w-lg bg-card border-border">
          <DialogHeader>
            <DialogTitle className="font-display text-foreground">Deal #{selectedDeal?.id}</DialogTitle>
          </DialogHeader>
          {selectedDeal && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{selectedDeal.nombreDeal}</p>
              
              <div className="grid grid-cols-2 gap-3">
                <InfoBlock label="Monto USD" value={`$${selectedDeal.usd.toLocaleString('en-US')}`} />
                <InfoBlock label="País" value={selectedDeal.pais} />
                <InfoBlock label="Encargado" value={selectedDeal.encargado} />
                <InfoBlock label="Tipo Contrato" value={selectedDeal.tipoContrato} />
                <InfoBlock label="Estatus Hubspot" value={selectedDeal.estatusHubspot} highlight="in" />
                <InfoBlock label="Estatus Netsuite" value={selectedDeal.estatusNetsuite} highlight="in" />
                <InfoBlock label="OC" value={selectedDeal.oc} highlight={selectedDeal.oc === 'SI' ? 'exception' : undefined} />
                <InfoBlock label="Excepción" value={selectedDeal.excepcion} highlight={selectedDeal.excepcion === 'SI' ? 'exception' : undefined} />
                <InfoBlock label="Pipeline" value={selectedDeal.pipeline} />
                <InfoBlock label="Truora Score" value={selectedDeal.truoraScore?.toString() || 'N/A'} />
              </div>

              {selectedDeal.observaciones && (
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Observaciones</p>
                  <p className="text-sm text-foreground">{selectedDeal.observaciones}</p>
                </div>
              )}

              {selectedDeal.linkHubspot && selectedDeal.linkHubspot !== '#N/A' && (
                <a href={selectedDeal.linkHubspot} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                  <ExternalLink className="w-4 h-4" /> Ver en HubSpot
                </a>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InfoBlock({ label, value, highlight }: { label: string; value: string; highlight?: 'in' | 'exception' }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-sm font-semibold ${
        highlight === 'in' && value === 'IN' ? 'text-status-in' :
        highlight === 'exception' && value === 'SI' ? 'text-status-exception' :
        'text-foreground'
      }`}>{value || '—'}</p>
    </div>
  );
}
