import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";
import type { DealRecord } from "@/lib/csv-parser";
import { useMemo } from "react";

interface RiskBarChartProps {
  deals: DealRecord[];
}

const COUNTRY_COLORS: Record<string, string> = {
  'MÉXICO': 'hsl(216, 68%, 7%)',
  'MEXICO': 'hsl(216, 68%, 7%)',
  'COLOMBIA': 'hsl(220, 100%, 55%)',
  'CHILE': 'hsl(230, 78%, 17%)',
  'PERÚ': 'hsl(193, 100%, 38%)',
  'PERU': 'hsl(193, 100%, 38%)',
  'PANAMÁ': 'hsl(207, 100%, 39%)',
  'PANAMA': 'hsl(207, 100%, 39%)',
  'GUATEMALA': 'hsl(216, 68%, 20%)',
  'NICARAGUA': 'hsl(220, 60%, 40%)',
};

const FALLBACK_COLORS = [
  'hsl(210, 80%, 30%)',
  'hsl(220, 50%, 50%)',
  'hsl(207, 100%, 39%)',
  'hsl(193, 100%, 38%)',
];

export function RiskBarChart({ deals }: RiskBarChartProps) {
  const { data, countries } = useMemo(() => {
    const subsMap = new Map<string, Map<string, number>>();
    const countrySet = new Set<string>();

    deals.forEach(d => {
      const sub = d.subsidiaria || 'Sin Subsidiaria';
      const pais = d.pais || 'Sin País';
      countrySet.add(pais);
      if (!subsMap.has(sub)) subsMap.set(sub, new Map());
      const m = subsMap.get(sub)!;
      m.set(pais, (m.get(pais) || 0) + 1);
    });

    const countries = Array.from(countrySet).sort();
    const data = Array.from(subsMap.entries()).map(([sub, countryMap]) => {
      const entry: Record<string, string | number> = { name: sub };
      countries.forEach(c => { entry[c] = countryMap.get(c) || 0; });
      entry._total = Array.from(countryMap.values()).reduce((a, b) => a + b, 0);
      return entry;
    }).sort((a, b) => (b._total as number) - (a._total as number));

    return { data, countries };
  }, [deals]);

  const usdBySubsidiaria = useMemo(() => {
    const m = new Map<string, number>();
    deals.forEach(d => {
      const sub = d.subsidiaria || 'Sin Subsidiaria';
      m.set(sub, (m.get(sub) || 0) + d.usd);
    });
    return m;
  }, [deals]);

  const getColor = (country: string, index: number) => {
    const upper = country.toUpperCase();
    return COUNTRY_COLORS[upper] || FALLBACK_COLORS[index % FALLBACK_COLORS.length];
  };

  return (
    <div className="bg-card rounded-lg border border-border p-5 shadow-sm">
      <h3 className="text-sm font-display font-semibold text-foreground mb-4">Deals por Subsidiaria y País</h3>
      <ResponsiveContainer width="100%" height={Math.max(250, data.length * 45)}>
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 30 }}>
          <XAxis type="number" tick={{ fill: 'hsl(220, 10%, 46%)', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="name" width={100} tick={{ fill: 'hsl(216, 68%, 7%)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: '#fff', border: '1px solid hsl(220, 15%, 90%)', borderRadius: '0.625rem', fontSize: '12px' }}
            formatter={(value: number, name: string) => [value, name]}
            labelFormatter={(label) => {
              const usd = usdBySubsidiaria.get(label as string) || 0;
              return `${label} — USD $${usd.toLocaleString('en-US')}`;
            }}
          />
          <Legend wrapperStyle={{ fontSize: '11px' }} />
          {countries.map((c, i) => (
            <Bar key={c} dataKey={c} stackId="a" fill={getColor(c, i)} radius={i === countries.length - 1 ? [0, 3, 3, 0] : undefined} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
