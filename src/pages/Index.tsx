import { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { parseCSV, type DealRecord } from "@/lib/csv-parser";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { KPICards, type CardType } from "@/components/dashboard/KPICards";
import { ContractMixChart } from "@/components/dashboard/ContractMixChart";
import { GeographyChart } from "@/components/dashboard/GeographyChart";
import { TruoraAlert } from "@/components/dashboard/TruoraAlert";
import { ExceptionsTable } from "@/components/dashboard/ExceptionsTable";
import { DealSearchModal } from "@/components/dashboard/DealSearchModal";
import { OCMonitor } from "@/components/dashboard/OCMonitor";
import { SubsidiariaChart } from "@/components/dashboard/SubsidiariaChart";
import { TerritoryRanking } from "@/components/dashboard/TerritoryRanking";
import { PipelineAnalysis } from "@/components/dashboard/PipelineAnalysis";
import { DataTable } from "@/components/dashboard/DataTable";
import { RiskDashboard } from "@/components/risk/RiskDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ubitsLogo from "@/assets/ubits-logo.svg";

const fadeVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

export default function Index() {
  const [allRecords, setAllRecords] = useState<DealRecord[]>([]);
  const [months, setMonths] = useState<string[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState("__all__");
  const [selectedArea, setSelectedArea] = useState("__all__");
  const [activeCard, setActiveCard] = useState<CardType>(null);

  // Auto-load sample CSV
  useEffect(() => {
    fetch('/data/sample.csv')
      .then(r => r.text())
      .then(text => {
        const { records, months: m, areas: a } = parseCSV(text);
        if (records.length > 0) {
          setAllRecords(records);
          setMonths(m);
          setAreas(a);
          if (m.length > 0) setSelectedMonth(m[0]);
        }
      })
      .catch(() => {});
  }, []);

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
      setActiveCard(null);
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

  // KPI metrics
  const metrics = useMemo(() => {
    const inDeals = filtered.filter(r => r.estatusHubspot === 'IN');
    const forecastDeals = filtered.filter(r => r.estatusHubspot === 'FORECAST');
    const multiDeals = filtered.filter(r => r.tipoNegocio.toLowerCase() === 'multicuenta');
    const excDeals = filtered.filter(r => r.excepcion === 'SI' || r.excepcion === 'SÍ');
    return {
      totalIn: inDeals.length, usdIn: inDeals.reduce((s, r) => s + r.usd, 0),
      totalForecast: forecastDeals.length, usdForecast: forecastDeals.reduce((s, r) => s + r.usd, 0),
      totalMulticuenta: multiDeals.length, usdMulticuenta: multiDeals.reduce((s, r) => s + r.usd, 0),
      totalExcepciones: excDeals.length, usdExcepciones: excDeals.reduce((s, r) => s + r.usd, 0),
    };
  }, [filtered]);

  // Card-filtered deals for data table
  const cardFiltered = useMemo(() => {
    if (!activeCard) return filtered;
    switch (activeCard) {
      case 'in': return filtered.filter(r => r.estatusHubspot === 'IN');
      case 'forecast': return filtered.filter(r => r.estatusHubspot === 'FORECAST');
      case 'multicuenta': return filtered.filter(r => r.tipoNegocio.toLowerCase() === 'multicuenta');
      case 'excepciones': return filtered.filter(r => r.excepcion === 'SI' || r.excepcion === 'SÍ');
      default: return filtered;
    }
  }, [filtered, activeCard]);

  const contractMix = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach(r => {
      const tipo = r.tipoContrato || 'Sin Tipo';
      map.set(tipo, (map.get(tipo) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [filtered]);

  const geography = useMemo(() => {
    const map = new Map<string, number>();
    filtered.forEach(r => {
      const pais = r.pais || 'Sin País';
      map.set(pais, (map.get(pais) || 0) + r.usd);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [filtered]);

  const hasData = allRecords.length > 0;
  const filterKey = `${selectedMonth}-${selectedArea}`;

  const cardLabel = activeCard === 'in' ? 'Estatus IN' : activeCard === 'forecast' ? 'Forecast' : activeCard === 'multicuenta' ? 'Multicuentas' : activeCard === 'excepciones' ? 'Excepciones' : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <img src={ubitsLogo} alt="UBITS" className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-display font-bold text-foreground leading-tight">
                  UG: Legal Operations
                </h1>
                <p className="text-xs text-muted-foreground">Reporte Operativo 2026</p>
              </div>
            </div>
            <div className="w-64">
              {hasData && <DealSearchModal deals={allRecords} />}
            </div>
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

      <main className="max-w-[1400px] mx-auto px-6 py-6">
        {!hasData ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 rounded-xl bg-card border border-border flex items-center justify-center mb-6 shadow-sm">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-display font-bold text-foreground mb-2">Carga tu archivo CSV</h2>
            <p className="text-muted-foreground max-w-md text-sm">
              Sube el archivo de la hoja "2026 - REPORTE DEALS GENERAL" para generar el reporte operativo.
            </p>
          </div>
        ) : (
          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="bg-muted border border-border">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="pipeline" className="data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                Análisis de Pipeline
              </TabsTrigger>
              <TabsTrigger value="riesgos" className="data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                Gestión de Riesgos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <AnimatePresence mode="wait">
                <motion.div key={filterKey} variants={fadeVariants} initial="initial" animate="animate" exit="exit" className="space-y-6">
                  {/* KPI Cards */}
                  <KPICards {...metrics} activeCard={activeCard} onCardClick={setActiveCard} />

                  {/* Charts Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2 space-y-4">
                      <SubsidiariaChart deals={filtered} />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ContractMixChart data={contractMix} total={filtered.length} />
                        <GeographyChart data={geography} />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <TerritoryRanking deals={filtered} />
                      <OCMonitor deals={filtered} />
                    </div>
                  </div>

                  {/* Alerts */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <TruoraAlert deals={filtered} />
                    <ExceptionsTable deals={filtered} />
                  </div>

                  {/* Data Table */}
                  <DataTable
                    deals={cardFiltered}
                    title={cardLabel ? `Registros: ${cardLabel}` : 'Todos los Registros'}
                  />
                </motion.div>
              </AnimatePresence>
            </TabsContent>

            <TabsContent value="pipeline">
              <AnimatePresence mode="wait">
                <motion.div key={filterKey} variants={fadeVariants} initial="initial" animate="animate" exit="exit">
                  <PipelineAnalysis deals={filtered} />
                </motion.div>
              </AnimatePresence>
            </TabsContent>

            <TabsContent value="riesgos">
              <RiskDashboard deals={filtered} />
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}
