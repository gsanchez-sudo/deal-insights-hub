import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface ContractMixChartProps {
  data: { name: string; value: number }[];
  total: number;
}

const COLORS = [
  "hsl(216, 68%, 7%)",
  "hsl(220, 100%, 55%)",
  "hsl(193, 100%, 38%)",
  "hsl(230, 78%, 17%)",
  "hsl(207, 100%, 39%)",
  "hsl(216, 68%, 20%)",
];

export function ContractMixChart({ data, total }: ContractMixChartProps) {
  return (
    <div className="bg-card p-5 rounded-lg border border-border shadow-sm">
      <h3 className="text-sm font-display font-semibold text-foreground mb-4">Mix de Contratos</h3>
      <div className="flex items-center gap-6">
        <div className="relative w-44 h-44">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={48} outerRadius={72} dataKey="value" stroke="none">
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#fff', border: '1px solid hsl(220,15%,90%)', borderRadius: '0.625rem', fontSize: '12px' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-display font-bold text-foreground">{total}</span>
            <span className="text-xs text-muted-foreground">Total</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 flex-1">
          {data.map((item, i) => (
            <div key={item.name} className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
              <span className="text-muted-foreground flex-1">{item.name}</span>
              <span className="font-semibold text-foreground">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
