import { useState, useEffect } from "react";
import api from "../../Api/axios";
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
  const [chartConfig, setChartConfig] = useState({
    data: [],
    mesActual: "",
    mesAnterior: "",
    loading: true
  });

  useEffect(() => {
    api.get("/licenses/chart-data")
      .then((res) => {
        setChartConfig({
          data: res.data.data,
          mesActual: res.data.mesActual,
          mesAnterior: res.data.mesAnterior,
          loading: false
        });
      });
  }, []);

const { data, mesActual, mesAnterior, loading } = chartConfig;

  return (
    <div className="flex h-[500px] min-h-[400px] flex-col gap-4 rounded-xl border border-neutral-gray-border/20 dark:border-gray-800 p-6 bg-white dark:bg-gray-900/50 shadow-sm ">
          <p className="text-gray-800 dark:text-gray-200 text-lg font-medium leading-normal">Licencias Registradas en el mes
             ({mesActual})
          </p>
          
          <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />

          {/* Línea clara */}
          {chartConfig.mesAnterior && (
              <Line
                type="monotone"
                dataKey={chartConfig.mesAnterior} // Llave dinámica
                stroke="#AFC0FA"
                strokeWidth={3}
                dot={false}
              />
            )}

          {/* Línea principal */}
          {chartConfig.mesActual && (
              <Line
                type="monotone"
                dataKey={chartConfig.mesActual} // Llave dinámica
                stroke="#0E34C7"
                strokeWidth={4}
                dot={false}
              />
            )}
        </LineChart>
      </ResponsiveContainer>
    </div>
        </div>
    
  );
}
