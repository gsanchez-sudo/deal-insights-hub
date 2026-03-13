import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from "recharts";
import type { DealRecord } from "@/lib/csv-parser";

interface PipelineAnalysisProps {
  deals: DealRecord[];
}

const PIPELINE_COLORS: Record<string, string> = {
  'Sales Pipeline': 'hsl(216, 68%, 7%)',
  'Renovation Pipeline': 'hsl(220, 100%, 55%)',
  'Expansion Pipeline': 'hsl(193, 100%, 38%)',
};

const FALLBACK_COLORS = [
  'hsl(230, 78%, 17%)',
  'hsl(207, 100%, 39%)',
  'hsl(216, 68%, 20%)',
];

function categorizePipeline(pipeline: string): string {
  const lower = pipeline.toLowerCase();
  if (lower.includes('renovation') || lower.includes('renov')) return 'Renovaciones';
  if (lower.includes('expansion') || lower.includes('expan')) return 'Expansiones';
  if (lower.includes('sales')) return 'Nuevos Negocios';
  return pipeline || 'Sin Pipeline';
}

export function PipelineAnalysis({ deals }: PipelineAnalysisProps) {
  const { byCategory, byPipeline } = useMemo(() => {
    const catMap = new Map<string, { count: number; usd: number }>();
    const pipMap = new Map<string, { count: number; usd: number }>();

    deals.forEach(d => {
      const cat = categorizePipeline(d.pipeline);
      const pip = d.pipeline || 'Sin Pipeline';
      
      const prev1 = catMap.get(cat) || { count: 0, usd: 0 };
      catMap.set(cat, { count: prev1.count + 1, usd: prev1.usd + d.usd });
      
      const prev2 = pipMap.get(pip) || { count: 0, usd: 0 };
      pipMap.set(pip, { count: prev2.count + 1, usd: prev2.usd + d.usd });
    });

    return {
      byCategory: Array.from(catMap.entries())
        .map(([name, stats]) => ({ name, ...stats }))
        .sort((a, b) => b.usd - a.usd),
      byPipeline: Array.from(pipMap.entries())
        .map(([name, stats]) => ({ name, ...stats }))
        .sort((a, b) => b.usd - a.usd),
    };
  }, [deals]);

  const totalUsd = byCategory.reduce((s, c) => s + c.usd, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Donut by category */}
        <div className="bg-card rounded-lg border border-border p-5 shadow-sm">
          <h3 className="text-sm font-display font-semibold text-foreground mb-4">USD por Categoría de Pipeline</h3>
          <div className="flex items-center gap-6">
            <div className="relative w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={byCategory} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="usd" stroke="none">
                    {byCategory.map((_, i) => (
                      <Cell key={i} fill={FALLBACK_COLORS[i % FALLBACK_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#fff', border: '1px solid hsl(220,15%,90%)', borderRadius: '0.625rem', fontSize: '12px' }}
                    formatter={(v: number) => [`$${v.toLocaleString('en-US')}`, 'USD']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-lg font-display font-bold text-foreground">${(totalUsd / 1000).toFixed(0)}k</span>
                <span className="text-xs text-muted-foreground">Total</span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {byCategory.map((c, i) => (
                <div key={c.name} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: FALLBACK_COLORS[i % FALLBACK_COLORS.length] }} />
                  <div>
                    <p className="font-medium text-foreground">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.count} deals · ${c.usd.toLocaleString('en-US')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bar by pipeline */}
        <div className="bg-card rounded-lg border border-border p-5 shadow-sm">
          <h3 className="text-sm font-display font-semibold text-foreground mb-4">USD por Pipeline</h3>
          <ResponsiveContainer width="100%" height={Math.max(200, byPipeline.length * 50)}>
            <BarChart data={byPipeline} layout="vertical" margin={{ left: 10, right: 30 }}>
              <XAxis type="number" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fill: 'hsl(220, 10%, 46%)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" width={130} tick={{ fill: 'hsl(216, 68%, 7%)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid hsl(220,15%,90%)', borderRadius: '0.625rem', fontSize: '12px' }}
                formatter={(v: number) => [`$${v.toLocaleString('en-US')}`, 'USD']}
              />
              <Bar dataKey="usd" radius={[0, 4, 4, 0]} maxBarSize={28}>
                {byPipeline.map((entry, i) => (
                  <Cell key={i} fill={PIPELINE_COLORS[entry.name] || FALLBACK_COLORS[i % FALLBACK_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detail table */}
      <div className="bg-card rounded-lg border border-border p-5 shadow-sm">
        <h3 className="text-sm font-display font-semibold text-foreground mb-4">Detalle por Categoría</h3>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-xs text-muted-foreground font-semibold uppercase">Categoría</th>
                <th className="text-right py-2 px-3 text-xs text-muted-foreground font-semibold uppercase">Deals</th>
                <th className="text-right py-2 px-3 text-xs text-muted-foreground font-semibold uppercase">USD Total</th>
                <th className="text-right py-2 px-3 text-xs text-muted-foreground font-semibold uppercase">% del Total</th>
              </tr>
            </thead>
            <tbody>
              {byCategory.map(c => (
                <tr key={c.name} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-2.5 px-3 font-medium text-foreground">{c.name}</td>
                  <td className="py-2.5 px-3 text-right text-foreground">{c.count}</td>
                  <td className="py-2.5 px-3 text-right font-semibold text-foreground">${c.usd.toLocaleString('en-US')}</td>
                  <td className="py-2.5 px-3 text-right text-muted-foreground">{totalUsd > 0 ? ((c.usd / totalUsd) * 100).toFixed(1) : 0}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
