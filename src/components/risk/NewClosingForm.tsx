import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { ClosingRecord, RiskStatus } from "@/types/risk";
import { LOCAL_JURISDICTION, JURISDICTIONS } from "@/types/risk";
import { toast } from "@/hooks/use-toast";

interface NewClosingFormProps {
  onSave: (record: ClosingRecord) => void;
}

export function NewClosingForm({ onSave }: NewClosingFormProps) {
  const [open, setOpen] = useState(false);
  const [cliente, setCliente] = useState("");
  const [monto, setMonto] = useState("");
  const [fecha, setFecha] = useState<Date>();
  const [duracion, setDuracion] = useState("");
  const [duracionUnidad, setDuracionUnidad] = useState<'Meses' | 'Años'>('Meses');
  const [jurisdiccion, setJurisdiccion] = useState("");
  const [clausulas, setClausulas] = useState("");

  const reset = () => {
    setCliente(""); setMonto(""); setFecha(undefined);
    setDuracion(""); setDuracionUnidad('Meses');
    setJurisdiccion(""); setClausulas("");
  };

  const handleSave = () => {
    if (!cliente.trim() || !monto || !fecha || !duracion || !jurisdiccion) {
      toast({ title: "Campos requeridos", description: "Por favor completa todos los campos obligatorios.", variant: "destructive" });
      return;
    }

    const montoNum = parseFloat(monto);
    if (isNaN(montoNum) || montoNum <= 0) {
      toast({ title: "Monto inválido", description: "Ingresa un monto válido mayor a 0.", variant: "destructive" });
      return;
    }

    // Business rules
    let estadoRiesgo: RiskStatus = 'Aprobado';
    let motivoRiesgo = '';

    if (montoNum > 100000) {
      estadoRiesgo = 'Requiere Revisión de VP';
      motivoRiesgo = `Monto ($${montoNum.toLocaleString('en-US')}) excede $100,000`;
    }

    if (jurisdiccion !== LOCAL_JURISDICTION) {
      estadoRiesgo = 'Jurisdicción Extranjera';
      motivoRiesgo = motivoRiesgo
        ? `${motivoRiesgo} | Jurisdicción extranjera: ${jurisdiccion}`
        : `Jurisdicción extranjera: ${jurisdiccion}`;
    }

    const record: ClosingRecord = {
      id: crypto.randomUUID(),
      cliente: cliente.trim(),
      monto: montoNum,
      fecha: format(fecha, 'dd/MM/yyyy'),
      duracion: parseInt(duracion),
      duracionUnidad,
      jurisdiccion,
      clausulasEspeciales: clausulas.trim(),
      estadoRiesgo,
      motivoRiesgo,
      createdAt: new Date().toISOString(),
    };

    onSave(record);
    reset();
    setOpen(false);
    toast({
      title: "Cierre registrado",
      description: estadoRiesgo !== 'Aprobado'
        ? `⚠️ Estado: ${estadoRiesgo} — ${motivoRiesgo}`
        : "Cierre aprobado exitosamente.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Cierre
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-foreground">Registrar Cierre de Negocio</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="cliente" className="text-foreground">Cliente *</Label>
            <Input id="cliente" value={cliente} onChange={e => setCliente(e.target.value)} placeholder="Nombre del cliente" className="border-border" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="monto" className="text-foreground">Monto (USD) *</Label>
              <Input id="monto" type="number" value={monto} onChange={e => setMonto(e.target.value)} placeholder="0.00" className="border-border" />
            </div>
            <div className="grid gap-2">
              <Label className="text-foreground">Fecha de Cierre *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("justify-start text-left font-normal border-border", !fecha && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fecha ? format(fecha, "PPP", { locale: es }) : "Seleccionar"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={fecha} onSelect={setFecha} initialFocus className="p-3 pointer-events-auto" />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="duracion" className="text-foreground">Duración *</Label>
              <Input id="duracion" type="number" value={duracion} onChange={e => setDuracion(e.target.value)} placeholder="12" className="border-border" />
            </div>
            <div className="grid gap-2">
              <Label className="text-foreground">Unidad</Label>
              <Select value={duracionUnidad} onValueChange={(v) => setDuracionUnidad(v as 'Meses' | 'Años')}>
                <SelectTrigger className="border-border"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Meses">Meses</SelectItem>
                  <SelectItem value="Años">Años</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label className="text-foreground">Jurisdicción *</Label>
            <Select value={jurisdiccion} onValueChange={setJurisdiccion}>
              <SelectTrigger className="border-border"><SelectValue placeholder="Seleccionar país" /></SelectTrigger>
              <SelectContent>
                {JURISDICTIONS.map(j => <SelectItem key={j} value={j}>{j}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="clausulas" className="text-foreground">Cláusulas Especiales</Label>
            <Textarea id="clausulas" value={clausulas} onChange={e => setClausulas(e.target.value)} placeholder="Notas o cláusulas especiales del contrato..." className="border-border min-h-[80px]" />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => { reset(); setOpen(false); }} className="border-border hover:bg-muted transition-all duration-200">Cancelar</Button>
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">Guardar Cierre</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
