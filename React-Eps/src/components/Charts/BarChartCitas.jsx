import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function BarChartCitas({ data }) {
  const total = data.reduce((sum, d) => sum + (d.total ?? 0), 0);

  return (
    <div className="flex h-[400px] flex-col gap-4 rounded-xl border border-neutral-gray-border/20 dark:border-gray-800 p-6 sm:p-8 bg-white dark:bg-gray-800 shadow-sm transition-all hover:shadow-md">
      <p className="text-gray-800 dark:text-gray-200 text-lg font-semibold leading-normal">Citas por Día</p>
      <div className="flex items-baseline gap-2 mb-2">
        <p className="text-gray-900 dark:text-white tracking-tight text-4xl font-bold leading-tight truncate">
          {total}</p>
        <span className="text-neutral-gray-text text-sm font-medium">de la semana</span>
      </div>
      <div className="flex-1 min-h-0">
        {data.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="dia" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 500 }}
                dy={10}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(14, 165, 233, 0.05)', radius: 8 }}
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  padding: '12px'
                }}
              />
              <Bar dataKey="total" fill="#0ea5e9" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
