import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLayout } from "../../LayoutContext";
import { useHelp } from "../../hooks/useHelp";
import BarChartCitas from "../../components/Charts/BarChartCitas";
import PieChartOrdenes from "../../components/Charts/PieChartOrdenes";
import FeedPanel from "../../components/Dashboard/FeedPanel";
import StatsPanel from "../../components/Dashboard/StatsPanel";
import MotionSpinner from "../../components/UI/Spinner";
import { ordenesMock } from "../../data/graficsData";
import api from "../../Api/axios";

const CHANNEL_NAME = "admin-feed";

export default function Dashboard() {
  const { setTitle, setSubtitle } = useLayout();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Guard: Si es personal de exámenes, no debe estar en el dashboard administrativo
  useEffect(() => {
    if (user.id_rol === 3 && user.examenes) {
      navigate('/examenes/agenda', { replace: true });
    }
  }, [user, navigate]);

  useHelp({
    title: "Panel de Administración",
    description: "Este es el panel principal de control. Ofrece una vista panorámica del rendimiento de la clínica a través de indicadores clave, gráficos y un registro de actividad reciente.",
    sections: [
      {
        title: "Métricas Generales",
        type: "list",
        items: [
          "Tarjetas superiores: Muestran el número total de pacientes, médicos, citas del día, etc., comparado con el periodo anterior.",
          "Gráficos: Visualiza la distribución de citas en la semana y el volumen de órdenes médicas generadas."
        ]
      },
      {
        title: "Actividad Reciente",
        type: "tip",
        content: "El panel lateral derecho es un feed en tiempo real o histórico reciente. Muestra las últimas acciones importantes (como creaciones de usuarios o cancelaciones) para mantenerte informado al instante."
      }
    ]
  });

  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [citasData, setCitasData] = useState([]);
  const [stats, setStats] = useState([]);
  const [ordenesData, setOrdenesData] = useState(null);

  useEffect(() => {
    setTitle("Dashboard");
    setSubtitle("Bienvenido de nuevo, Admin. Aquí hay un resumen de la actividad.");
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [activityRes, citasRes, statsRes, ordenesRes] = await Promise.all([
          api.get(`/recent-activity/${CHANNEL_NAME}`),
          api.get("/admin/dashboard/citas-semana"),
          api.get("/admin/dashboard/stats"),
          api.get("/admin/dashboard/ordenes-mes"),
        ]);

        // recent-activity devuelve el array directamente (ruta pública, sin wrapper)
        setActivities(Array.isArray(activityRes) ? activityRes : []);

        // citas-semana viene envuelto en { data: [...] } por el interceptor del axios
        const rawCitas = Array.isArray(citasRes)
          ? citasRes
          : citasRes?.data ?? citasRes ?? [];
        setCitasData(rawCitas);

        // stats viene como array directo del controlador
        setStats(Array.isArray(statsRes) ? statsRes : []);
        setOrdenesData(ordenesRes ?? null);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <MotionSpinner />
      </div>
    );
  }

  return (
    <>
      <StatsPanel stats={stats} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <BarChartCitas data={citasData} />
            <PieChartOrdenes data={ordenesData} />
          </div>
        </div>
        <FeedPanel feedItems={activities} channelName={CHANNEL_NAME} />
      </div>
    </>
  );
}

