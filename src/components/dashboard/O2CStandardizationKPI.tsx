import { useMemo } from "react";
import { Target, TrendingUp, CheckCircle2 } from "lucide-react";
import type { DealRecord } from "@/lib/csv-parser";

interface O2CStandardizationKPIProps {
  deals: DealRecord[];
}

const O2C_CONTRACT_TYPES = ["TS", "TS /T&C", "T&C"];

export function O2CStandardizationKPI({ deals }: O2CStandardizationKPIProps) {
  const TARGET = 70;

  const { standardized, total, percentage } = useMemo(() => {
    const total = deals.length;
    const standardized = deals.filter((d) =>
      O2C_CONTRACT_TYPES.some((t) =>
        d.tipoContrato.toUpperCase().startsWith(t)
      )
    ).length;
    const percentage = total > 0 ? (standardized / total) * 100 : 0;
    return { standardized, total, percentage };
  }, [deals]);

  const isOnTarget = percentage >= TARGET;

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <Target className="w-5 h-5 text-primary" />
        <h3 className="text-base font-display font-semibold text-foreground">
          KPI de Estandarización O2C
        </h3>
      </div>

      <p className="text-sm text-muted-foreground mb-6">
        Estandarizar el 70% de la contratación comercial mediante el proceso ordinario O2C
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <div className="bg-muted/40 rounded-lg p-4 text-center">
          <p className="text-2xl font-display font-bold text-foreground">{total}</p>
          <p className="text-xs text-muted-foreground mt-1">Total Contratos</p>
        </div>
        <div className="bg-muted/40 rounded-lg p-4 text-center">
          <p className="text-2xl font-display font-bold text-primary">{standardized}</p>
          <p className="text-xs text-muted-foreground mt-1">Estandarizados (O2C)</p>
        </div>
        <div className="bg-muted/40 rounded-lg p-4 text-center">
          <p className="text-2xl font-display font-bold" style={{ color: isOnTarget ? 'hsl(var(--risk-approved))' : 'hsl(var(--ubits-blue))' }}>
            {percentage.toFixed(2)}%
          </p>
          <p className="text-xs text-muted-foreground mt-1">Porcentaje Actual</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground font-medium">Progreso hacia el objetivo</span>
          <span className="font-semibold text-foreground">{percentage.toFixed(1)}% / {TARGET}%</span>
        </div>
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: isOnTarget ? 'hsl(var(--risk-approved))' : 'hsl(var(--ubits-blue))',
            }}
          />
        </div>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            {isOnTarget ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" style={{ color: 'hsl(var(--risk-approved))' }} />
                <span style={{ color: 'hsl(var(--risk-approved))' }} className="font-semibold">Objetivo alcanzado</span>
              </>
            ) : (
              <>
                <TrendingUp className="w-3.5 h-3.5 text-primary" />
                <span className="text-muted-foreground">Faltan {(TARGET - percentage).toFixed(1)} pp para el objetivo</span>
              </>
            )}
          </div>
          <span className="text-muted-foreground">
            Objetivo: <span className="font-semibold text-foreground">{TARGET}%</span>
          </span>
        </div>
      </div>
    </div>
  );
}
