import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { ClosingRecord, RiskStatus } from "@/types/risk";

interface RiskTableProps {
  closings: ClosingRecord[];
}

function getRiskBadgeClass(status: RiskStatus): string {
  switch (status) {
    case 'Aprobado': return 'bg-risk-approved text-white border-transparent';
    case 'Riesgo': return 'bg-risk-alert text-foreground border-transparent';
    case 'Rechazado': return 'bg-risk-rejected text-white border-transparent';
    case 'Requiere Revisión de VP': return 'bg-risk-review text-white border-transparent';
    case 'Jurisdicción Extranjera': return 'bg-risk-jurisdiction text-white border-transparent';
    case 'Alerta de Jurisdicción': return 'bg-ubits-cyan text-foreground border-transparent';
    default: return 'bg-muted text-muted-foreground';
  }
}

export function RiskTable({ closings }: RiskTableProps) {
  if (closings.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-5">
        <h3 className="text-sm font-display font-semibold text-foreground mb-4">Negocios Cerrados</h3>
        <p className="text-muted-foreground text-sm text-center py-8">No hay cierres registrados. Usa "Nuevo Cierre" para agregar uno.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-5">
      <h3 className="text-sm font-display font-semibold text-foreground mb-4">Negocios Cerrados</h3>
      <div className="overflow-auto max-h-[400px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-foreground font-semibold">Cliente</TableHead>
              <TableHead className="text-foreground font-semibold">Monto</TableHead>
              <TableHead className="text-foreground font-semibold">Fecha</TableHead>
              <TableHead className="text-foreground font-semibold">Jurisdicción</TableHead>
              <TableHead className="text-foreground font-semibold">Estado de Riesgo</TableHead>
              <TableHead className="text-foreground font-semibold">Valor Contrato</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {closings.map((c) => (
              <TableRow key={c.id} className="hover:bg-secondary/50 transition-colors">
                <TableCell className="font-medium">{c.cliente}</TableCell>
                <TableCell>${c.monto.toLocaleString('en-US')}</TableCell>
                <TableCell>{c.fecha}</TableCell>
                <TableCell>{c.jurisdiccion}</TableCell>
                <TableCell>
                  <Badge className={getRiskBadgeClass(c.estadoRiesgo)}>{c.estadoRiesgo}</Badge>
                </TableCell>
                <TableCell>${(c.monto * c.duracion * (c.duracionUnidad === 'Años' ? 12 : 1)).toLocaleString('en-US')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
