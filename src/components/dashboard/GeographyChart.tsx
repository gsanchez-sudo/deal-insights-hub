import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";

interface GeographyChartProps {
  data: { name: string; value: number }[];
}

export function GeographyChart({ data }: GeographyChartProps) {
  const sorted = [...data].sort((a, b) => b.value - a.value);
  const maxVal = sorted[0]?.value || 0;

  return (
    <div className="bg-card p-6 rounded-lg border border-border">
      <h3 className="text-lg font-display text-foreground mb-4">Geografía (USD)</h3>
      <ResponsiveContainer width="100%" height={Math.max(200, sorted.length * 40)}>
        <BarChart data={sorted} layout="vertical" margin={{ left: 10, right: 30 }}>
          <XAxis
            type="number"
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            stroke="#4a6a8a"
            tick={{ fill: "#7a9ab8", fontSize: 12 }}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={90}
            stroke="#4a6a8a"
            tick={{ fill: "#fff", fontSize: 12 }}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{ background: "#0A1C33", border: "1px solid #1a3a5c", borderRadius: "6px", color: "#fff" }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, "USD"]}
          />
          <Bar dataKey="value" radius={[0, 3, 3, 0]} maxBarSize={24}>
            {sorted.map((entry, i) => (
              <Cell key={i} fill={entry.value === maxVal ? "#1a6bff" : "#0083C1"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
