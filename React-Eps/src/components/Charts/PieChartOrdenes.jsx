import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#3B82F6", "#10B981", "#22D3EE", "#F97316"];

export default function PieChartOrdenes({ data }) {
  if (!data) return null;

  const { total, diferencia, mes, data: pieData } = data;
  const isPositive = diferencia >= 0;
  const colorClass = isPositive ? "text-green-500" : "text-soft-red";
  const sign = isPositive ? "+" : "";

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-neutral-gray-border/20 dark:border-gray-800 p-6 bg-white dark:bg-gray-800 shadow-sm h-[360px]">
      <p className="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal">
        Resultados Medicos Registrados ({mes})
      </p>
      <div className="flex items-baseline gap-2">
        <p className="text-gray-900 dark:text-white tracking-tight text-3xl font-bold leading-tight truncate">
          {total}
        </p>
        <p className={`${colorClass} text-sm font-medium leading-normal`}>
          {sign}{diferencia}%
        </p>
      </div>
      <div className="flex-1 min-h-0">
      {pieData && pieData.length > 0 && (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            cx="50%"
            cy="40%"
            innerRadius={45}
            outerRadius={70}
            paddingAngle={6}
          >
            {pieData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend 
            verticalAlign="bottom" 
            align="center"
            iconType="circle"
            wrapperStyle={{ 
              paddingTop: '20px',
              fontSize: '12px',
              color: '#6B7280'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      )}
      </div>
    </div>
  );
}



