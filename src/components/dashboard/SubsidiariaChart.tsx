import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";
import type { DealRecord } from "@/lib/csv-parser";
import { useMemo } from "react";

interface SubsidiariaChartProps {
  deals: DealRecord[];
}

const COLORS = [
  "hsl(218, 100%, 22%)",
  "hsl(202, 100%, 38%)",
  "hsl(142, 71%, 45%)",
  "hsl(38, 92%, 50%)",
  "hsl(262, 83%, 58%)",
  "hsl(0, 84%, 60%)",
  "hsl(180, 60%, 40%)",
  "hsl(300, 60%, 50%)",
];

export function SubsidiariaChart({ deals }: SubsidiariaChartProps) {
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

  // Also compute USD by subsidiary for tooltip
  const usdBySubsidiaria = useMemo(() => {
    const m = new Map<string, number>();
    deals.forEach(d => {
      const sub = d.subsidiaria || 'Sin Subsidiaria';
      m.set(sub, (m.get(sub) || 0) + d.usd);
    });
    return m;
  }, [deals]);

  return (
    <div className="bg-card rounded-lg border border-border p-5">
      <h3 className="text-sm font-display font-semibold text-foreground mb-4">Deals por Subsidiaria y País</h3>
      <ResponsiveContainer width="100%" height={Math.max(250, data.length * 45)}>
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 30 }}>
          <XAxis type="number" tick={{ fill: 'hsl(215, 16%, 47%)', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="name" width={100} tick={{ fill: 'hsl(215, 60%, 10%)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: '#fff', border: '1px solid hsl(220, 13%, 91%)', borderRadius: '8px', fontSize: '12px' }}
            formatter={(value: number, name: string) => [value, name]}
            labelFormatter={(label) => {
              const usd = usdBySubsidiaria.get(label as string) || 0;
              return `${label} — USD $${usd.toLocaleString('en-US')}`;
            }}
          />
          <Legend wrapperStyle={{ fontSize: '11px' }} />
          {countries.map((c, i) => (
            <Bar key={c} dataKey={c} stackId="a" fill={COLORS[i % COLORS.length]} radius={i === countries.length - 1 ? [0, 3, 3, 0] : undefined} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
