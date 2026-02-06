import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ExampleChart() {
  const data = [
  { name: "Semana 1", marzo: 12, febrero: 8 },
  { name: "Semana 2", marzo: 18, febrero: 15 },
  { name: "Semana 3", marzo: 25, febrero: 20 },
  { name: "Semana 4", marzo: 22, febrero: 19 },
];



  return (
    <div className="flex h-[500px] min-h-[400px] flex-col gap-4 rounded-xl border border-neutral-gray-border/20 dark:border-gray-800 p-6 bg-white dark:bg-gray-900/50 shadow-sm ">
          <p className="text-gray-800 dark:text-gray-200 text-lg font-medium leading-normal">Licencias Vendidas en el mes
             (Marzo)
          </p>
          
          <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />

          {/* Línea clara */}
          <Line
            type="monotone"
            dataKey="febrero"
            stroke="#AFC0FA"
            strokeWidth={3}
            dot={false}
          />

          {/* Línea principal */}
          <Line
            type="monotone"
            dataKey="marzo"
            stroke="#0E34C7"
            strokeWidth={4}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
        </div>
    
  );
}
