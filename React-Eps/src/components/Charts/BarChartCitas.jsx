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
    <div className="flex h-[400px] min-h-[400px] flex-col gap-4 rounded-xl border border-neutral-gray-border/20 dark:border-gray-800 p-6 bg-white dark:bg-gray-900/50 shadow-sm ">
      <p className="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal">Citas
        por Día (Semana actual)</p>
      <div className="flex items-baseline gap-2">
        <p
          className="text-gray-900 dark:text-white tracking-tight text-3xl font-bold leading-tight truncate">
          {total}</p>
      </div>
      <div className="flex-1">
        {data.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="dia" />

              <Tooltip />
              <Bar dataKey="total" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
