import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import type { DealRecord } from "@/lib/csv-parser";
import type { ClosingRecord, RiskStatus } from "@/types/risk";
import { RiskBarChart } from "./RiskBarChart";
import { RiskPieChart } from "./RiskPieChart";
import { RiskTable } from "./RiskTable";
import { NewClosingForm } from "./NewClosingForm";
import { ExecutiveReport } from "./ExecutiveReport";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { DateRange } from "react-day-picker";

interface RiskDashboardProps {
  deals: DealRecord[];
}

const RISK_STATUSES: RiskStatus[] = [
  'Aprobado', 'Riesgo', 'Rechazado', 'Requiere Revisión de VP', 'Jurisdicción Extranjera', 'Alerta de Jurisdicción'
];

const fadeIn = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export function RiskDashboard({ deals }: RiskDashboardProps) {
  const [closings, setClosings] = useState<ClosingRecord[]>([]);
  const [riskFilter, setRiskFilter] = useState<string>("__all__");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const handleNewClosing = (record: ClosingRecord) => {
    setClosings(prev => [record, ...prev]);
  };

  const filteredClosings = useMemo(() => {
    return closings.filter(c => {
      if (riskFilter !== "__all__" && c.estadoRiesgo !== riskFilter) return false;
      if (dateRange?.from) {
        const parts = c.fecha.split('/');
        const d = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
        if (d < dateRange.from) return false;
        if (dateRange.to && d > dateRange.to) return false;
      }
      return true;
    });
  }, [closings, riskFilter, dateRange]);

  const summary = useMemo(() => {
    const approved = closings.filter(c => c.estadoRiesgo === 'Aprobado').length;
    const risk = closings.filter(c => c.estadoRiesgo === 'Riesgo' || c.estadoRiesgo === 'Requiere Revisión de VP').length;
    const foreign = closings.filter(c => c.estadoRiesgo === 'Jurisdicción Extranjera').length;
    const total = closings.reduce((s, c) => s + c.monto, 0);
    return { approved, risk, foreign, total, count: closings.length };
  }, [closings]);

  return (
    <motion.div variants={fadeIn} initial="initial" animate="animate" className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-display font-semibold text-foreground">Gestión de Riesgos de Cierre de Negocios</h2>
          <p className="text-sm text-muted-foreground mt-1">Panel de control de evaluación y validación de contratos</p>
        </div>
        <div className="flex items-center gap-3">
          <ExecutiveReport closings={closings} />
          <NewClosingForm onSave={handleNewClosing} />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 bg-card rounded-lg border border-border p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Fecha</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("w-[220px] justify-start text-left font-normal border-border text-sm h-9", !dateRange && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? `${format(dateRange.from, "dd MMM", { locale: es })} - ${format(dateRange.to, "dd MMM", { locale: es })}` : format(dateRange.from, "dd MMM yyyy", { locale: es })
                ) : "Rango de fecha"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="range" selected={dateRange} onSelect={setDateRange} numberOfMonths={2} className="p-3 pointer-events-auto" />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Estado</label>
          <Select value={riskFilter} onValueChange={setRiskFilter}>
            <SelectTrigger className="w-52 bg-card border-border text-foreground h-9 text-sm">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">Todos los estados</SelectItem>
              {RISK_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {(dateRange || riskFilter !== "__all__") && (
          <Button variant="ghost" size="sm" onClick={() => { setDateRange(undefined); setRiskFilter("__all__"); }} className="text-muted-foreground hover:text-foreground text-xs">
            Limpiar filtros
          </Button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard label="Total Cierres" value={summary.count} variant="navy" />
        <SummaryCard label="Aprobados" value={summary.approved} variant="green" />
        <SummaryCard label="En Riesgo" value={summary.risk} variant="red" />
        <SummaryCard label="Monto Total" value={`$${summary.total.toLocaleString('en-US')}`} variant="blue" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RiskBarChart deals={deals} />
        <RiskPieChart closings={closings} />
      </div>

      {/* Table */}
      <RiskTable closings={filteredClosings} />
    </motion.div>
  );
}

function SummaryCard({ label, value, variant }: { label: string; value: string | number; variant: 'navy' | 'blue' | 'green' | 'red' }) {
  const bgMap = {
    navy: 'bg-foreground',
    blue: 'bg-primary',
    green: 'bg-risk-approved',
    red: 'bg-risk-review',
  };

  return (
    <div className={`${bgMap[variant]} text-white rounded-lg p-4 shadow-sm transition-all duration-200 hover:shadow-md`}>
      <p className="text-2xl font-display font-semibold">{value}</p>
      <p className="text-xs opacity-80 mt-1">{label}</p>
    </div>
  );
}
