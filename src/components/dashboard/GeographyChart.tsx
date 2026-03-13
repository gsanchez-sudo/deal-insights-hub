import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";

interface GeographyChartProps {
  data: { name: string; value: number }[];
}

export function GeographyChart({ data }: GeographyChartProps) {
  const sorted = [...data].sort((a, b) => b.value - a.value);
  const maxVal = sorted[0]?.value || 0;

  return (
    <div className="bg-card p-5 rounded-lg border border-border shadow-sm">
      <h3 className="text-sm font-display font-semibold text-foreground mb-4">Geografía (USD)</h3>
      <ResponsiveContainer width="100%" height={Math.max(200, sorted.length * 36)}>
        <BarChart data={sorted} layout="vertical" margin={{ left: 10, right: 30 }}>
          <XAxis
            type="number"
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            tick={{ fill: 'hsl(220, 10%, 46%)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={100}
            tick={{ fill: 'hsl(216, 68%, 7%)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{ background: '#fff', border: '1px solid hsl(220, 15%, 90%)', borderRadius: '0.625rem', fontSize: '12px' }}
            formatter={(value: number) => [`$${value.toLocaleString('en-US')}`, 'USD']}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={22}>
            {sorted.map((entry, i) => (
              <Cell key={i} fill={entry.value === maxVal ? 'hsl(216, 68%, 7%)' : 'hsl(220, 100%, 55%)'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
