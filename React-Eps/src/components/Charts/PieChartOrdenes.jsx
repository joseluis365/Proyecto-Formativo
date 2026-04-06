import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#3B82F6", "#10B981", "#22D3EE", "#F97316"];

export default function PieChartOrdenes({ data }) {
  if (!data) return null;

  const { total, diferencia, mes, data: pieData } = data;
  const isPositive = diferencia >= 0;
  const colorClass = isPositive ? "text-green-500" : "text-soft-red";
  const sign = isPositive ? "+" : "";

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-neutral-gray-border/20 dark:border-gray-800 p-6 sm:p-8 bg-white dark:bg-gray-800 shadow-sm transition-all hover:shadow-md h-[400px]">
      <p className="text-gray-800 dark:text-gray-200 text-lg font-semibold leading-normal">
        Resultados Médicos ({mes})
      </p>
      <div className="flex items-baseline gap-2">
        <p className="text-gray-900 dark:text-white tracking-tight text-4xl font-bold leading-tight truncate">
          {total}
        </p>
        <p className={`${colorClass} text-sm font-semibold border-l pl-2 border-neutral-gray-border/20`}>
          {sign}{diferencia}% vs mes anterior
        </p>
      </div>
      <div className="flex-1 min-h-0">
      {pieData && pieData.length > 0 && (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <Pie
            data={pieData}
            dataKey="value"
            cx="50%"
            cy="45%"
            innerRadius={70}
            outerRadius={95}
            paddingAngle={5}
            stroke="none"
          >
            {pieData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              borderRadius: '12px', 
              border: 'none', 
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(4px)',
              padding: '12px'
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            align="center"
            iconType="circle"
            wrapperStyle={{ 
              paddingTop: '30px',
              fontSize: '13px',
              color: '#6B7280',
              fontWeight: 500
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      )}
      </div>
    </div>
  );
}



