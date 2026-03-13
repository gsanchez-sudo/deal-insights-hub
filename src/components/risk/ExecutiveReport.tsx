import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Printer } from "lucide-react";
import type { ClosingRecord } from "@/types/risk";
import ubitsLogo from "@/assets/ubits-logo.svg";

interface ExecutiveReportProps {
  closings: ClosingRecord[];
}

export function ExecutiveReport({ closings }: ExecutiveReportProps) {
  const flagged = closings.filter(c =>
    c.estadoRiesgo === 'Requiere Revisión de VP' || c.estadoRiesgo === 'Jurisdicción Extranjera'
  );

  const totalFlagged = flagged.reduce((s, c) => s + c.monto, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-border text-foreground hover:bg-muted transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
          <FileText className="w-4 h-4 mr-2" />
          Generar Reporte Ejecutivo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader className="no-print">
          <DialogTitle className="font-display text-foreground flex items-center gap-2">
            Reporte Ejecutivo
            <Button variant="ghost" size="sm" onClick={handlePrint} className="ml-auto">
              <Printer className="w-4 h-4 mr-1" /> Imprimir
            </Button>
          </DialogTitle>
        </DialogHeader>

        {/* Print-optimized report */}
        <div className="space-y-6 print:p-8">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
                <img src={ubitsLogo} alt="UBITS" className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-display font-bold text-foreground">Reporte Ejecutivo de Riesgos</h1>
                <p className="text-xs text-muted-foreground">UG: Legal Operations — {new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-secondary rounded-lg p-4 text-center">
              <p className="text-2xl font-display font-bold text-foreground">{flagged.length}</p>
              <p className="text-xs text-muted-foreground">Cierres con Riesgo</p>
            </div>
            <div className="bg-secondary rounded-lg p-4 text-center">
              <p className="text-2xl font-display font-bold text-foreground">${totalFlagged.toLocaleString('en-US')}</p>
              <p className="text-xs text-muted-foreground">Monto Total en Riesgo</p>
            </div>
            <div className="bg-secondary rounded-lg p-4 text-center">
              <p className="text-2xl font-display font-bold text-foreground">{closings.length}</p>
              <p className="text-xs text-muted-foreground">Total de Cierres</p>
            </div>
          </div>

          {/* Table */}
          {flagged.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No hay cierres que requieran revisión.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-foreground font-semibold">Cliente</TableHead>
                  <TableHead className="text-foreground font-semibold">Monto (USD)</TableHead>
                  <TableHead className="text-foreground font-semibold">Jurisdicción</TableHead>
                  <TableHead className="text-foreground font-semibold">Estado</TableHead>
                  <TableHead className="text-foreground font-semibold">Motivo del Riesgo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {flagged.map(c => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.cliente}</TableCell>
                    <TableCell>${c.monto.toLocaleString('en-US')}</TableCell>
                    <TableCell>{c.jurisdiccion}</TableCell>
                    <TableCell>
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${c.estadoRiesgo === 'Requiere Revisión de VP' ? 'bg-risk-review text-white' : 'bg-risk-jurisdiction text-white'}`}>
                        {c.estadoRiesgo}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">{c.motivoRiesgo}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Footer */}
          <div className="border-t border-border pt-4 text-center">
            <p className="text-xs text-muted-foreground">Documento generado automáticamente por UG: Legal Operations</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
