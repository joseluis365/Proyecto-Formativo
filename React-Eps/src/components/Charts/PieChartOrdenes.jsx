import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#3B82F6", "#10B981", "#22D3EE", "#F97316"];

export default function PieChartOrdenes({ data }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-neutral-gray-border/20 dark:border-gray-800 p-6 bg-white dark:bg-gray-900/50 shadow-sm h-[400px] min-h-[400px]">
      <p className="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal">Órdenes
                                    Médicas</p>
      <div className="flex items-baseline gap-2">
        <p
          className="text-gray-900 dark:text-white tracking-tight text-3xl font-bold leading-tight truncate">
          452</p>
        <p className="text-soft-red text-sm font-medium leading-normal">-3.5%</p>
      </div>
      <div className="flex-1">
      {data.length > 0 && (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={4}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      )}
      </div>
    </div>
  );
}



