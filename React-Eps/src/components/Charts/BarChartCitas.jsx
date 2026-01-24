import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function BarChartCitas({ data }) {
  return (
    <div className="flex h-[400px] min-h-[400px] flex-col gap-4 rounded-xl border border-neutral-gray-border/20 dark:border-gray-800 p-6 bg-white dark:bg-gray-900/50 shadow-sm ">
      <p className="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal">Citas
                                    por Día (Semana)</p>
      <div className="flex items-baseline gap-2">
        <p
          className="text-gray-900 dark:text-white tracking-tight text-3xl font-bold leading-tight truncate">
          680</p>
        <p className="text-primary-green text-sm font-medium leading-normal">+12%</p>
      </div>
      <div className="flex-1">
        {data.length > 0 && (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="dia" />
            
            <Tooltip />
            <Bar dataKey="total" fill="#4ADE80" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
