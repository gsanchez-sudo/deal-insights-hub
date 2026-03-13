import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import type { ClosingRecord } from "@/types/risk";
import { RISK_COLORS } from "@/types/risk";
import { useMemo } from "react";

interface RiskPieChartProps {
  closings: ClosingRecord[];
}

export function RiskPieChart({ closings }: RiskPieChartProps) {
  const data = useMemo(() => {
    const map = new Map<string, number>();
    closings.forEach(c => {
      map.set(c.estadoRiesgo, (map.get(c.estadoRiesgo) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [closings]);

  if (data.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-5">
        <h3 className="text-sm font-display font-semibold text-foreground mb-4">Distribución de Estados de Riesgo</h3>
        <p className="text-muted-foreground text-sm text-center py-8">Sin datos de cierres registrados</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-5">
      <h3 className="text-sm font-display font-semibold text-foreground mb-4">Distribución de Estados de Riesgo</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={95}
            paddingAngle={3}
            dataKey="value"
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            labelLine={{ stroke: 'hsl(220, 9%, 46%)' }}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={RISK_COLORS[entry.name] || 'hsl(220, 9%, 46%)'} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: '#fff', border: '1px solid hsl(220, 13%, 91%)', borderRadius: '8px', fontSize: '12px' }}
            formatter={(value: number) => [value, 'Cierres']}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
