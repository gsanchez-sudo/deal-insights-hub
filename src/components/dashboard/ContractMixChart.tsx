import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface ContractMixChartProps {
  data: { name: string; value: number }[];
  total: number;
}

const COLORS = ["#1a6bff", "#0083C1", "#2aa4e0", "#4db8e8", "#7dcdf0", "#a8dff5"];

export function ContractMixChart({ data, total }: ContractMixChartProps) {
  return (
    <div className="bg-card p-6 rounded-lg border border-border">
      <h3 className="text-lg font-display text-foreground mb-4">Mix de Contratos</h3>
      <div className="flex items-center gap-6">
        <div className="relative w-52 h-52">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                dataKey="value"
                stroke="none"
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "#0A1C33", border: "1px solid #1a3a5c", borderRadius: "6px", color: "#fff" }}
                itemStyle={{ color: "#fff" }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-display text-foreground">{total}</span>
            <span className="text-xs text-muted-foreground">Contratos</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 flex-1">
          {data.map((item, i) => (
            <div key={item.name} className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
              <span className="text-muted-foreground flex-1">{item.name}</span>
              <span className="font-display text-foreground">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
