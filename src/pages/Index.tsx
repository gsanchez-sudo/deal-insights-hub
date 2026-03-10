import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { parseCSV, type DealRecord } from "@/lib/csv-parser";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { KPICards } from "@/components/dashboard/KPICards";
import { ContractMixChart } from "@/components/dashboard/ContractMixChart";
import { GeographyChart } from "@/components/dashboard/GeographyChart";
import { TruoraAlert } from "@/components/dashboard/TruoraAlert";
import { ExceptionsTable } from "@/components/dashboard/ExceptionsTable";

const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export default function Index() {
  const [allRecords, setAllRecords] = useState<DealRecord[]>([]);
  const [months, setMonths] = useState<string[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState("__all__");
  const [selectedArea, setSelectedArea] = useState("__all__");

  const handleFileUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const { records, months: m, areas: a } = parseCSV(text);
      setAllRecords(records);
      setMonths(m);
      setAreas(a);
      if (m.length > 0) setSelectedMonth(m[0]);
      setSelectedArea("__all__");
    };
    reader.readAsText(file);
  }, []);

  const filtered = useMemo(() => {
    return allRecords.filter(r => {
      if (selectedMonth !== "__all__" && r.mes !== selectedMonth) return false;
      if (selectedArea !== "__all__" && r.area !== selectedArea) return false;
      return true;
    });
  }, [allRecords, selectedMonth, selectedArea]);

  const totalDeals = filtered.length;
  const totalUSD = useMemo(() => filtered.reduce((s, r) => s + r.usd, 0), [filtered]);
  const ticketPromedio = totalDeals > 0 ? totalUSD / totalDeals : 0;
  const eficiencia = useMemo(() => {
    if (totalDeals === 0) return 0;
    const tsOc = filtered.filter(r => {
      const t = r.tipoContrato.toUpperCase();
      return t === 'TS' || t === 'OC';
    }).length;
    return (tsOc / totalDeals) * 100;
  }, [filtered, totalDeals]);

  const contractMix = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach(r => {
      const tipo = r.tipoContrato || 'Sin Tipo';
      map.set(tipo, (map.get(tipo) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filtered]);

  const geography = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach(r => {
      const pais = r.pais || 'Sin País';
      map.set(pais, (map.get(pais) || 0) + r.usd);
    });
    return Array.from(map.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filtered]);

  const hasData = allRecords.length > 0;
  const filterKey = `${selectedMonth}-${selectedArea}`;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-display text-foreground tracking-tight">
              Reporte Operativo Mensual
            </h1>
            <span className="text-xs text-muted-foreground font-body">UBITS 2026</span>
          </div>
          <FilterBar
            months={months}
            areas={areas}
            selectedMonth={selectedMonth}
            selectedArea={selectedArea}
            onMonthChange={setSelectedMonth}
            onAreaChange={setSelectedArea}
            onFileUpload={handleFileUpload}
            hasData={hasData}
          />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {!hasData ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 rounded-lg bg-card border border-border flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-display text-foreground mb-2">Carga tu archivo CSV</h2>
            <p className="text-muted-foreground font-body max-w-md">
              Sube el archivo de la hoja "2026 - REPORTE DEALS GENERAL" para generar el reporte operativo mensual.
            </p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={filterKey} variants={fadeVariants} initial="initial" animate="animate" exit="exit" className="space-y-8">
              {/* Section 1: Executive Summary */}
              <section>
                <h2 className="text-xs font-body text-muted-foreground uppercase tracking-widest mb-4">Resumen Ejecutivo</h2>
                <KPICards
                  totalDeals={totalDeals}
                  totalUSD={totalUSD}
                  ticketPromedio={ticketPromedio}
                  eficiencia={eficiencia}
                />
              </section>

              {/* Section 2: Performance Breakdown */}
              <section>
                <h2 className="text-xs font-body text-muted-foreground uppercase tracking-widest mb-4">Desglose de Rendimiento</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <ContractMixChart data={contractMix} total={totalDeals} />
                  <GeographyChart data={geography} />
                </div>
              </section>

              {/* Section 3: Risk & Exceptions */}
              <section>
                <h2 className="text-xs font-body text-muted-foreground uppercase tracking-widest mb-4">Atención Requerida</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <TruoraAlert deals={filtered} />
                  <ExceptionsTable deals={filtered} />
                </div>
              </section>
            </motion.div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}
