import { useEffect, useState } from "react";
import { useLayout } from "../../LayoutContext";
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

  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [citasData, setCitasData] = useState([]);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    setTitle("Dashboard");
    setSubtitle("Bienvenido de nuevo, Admin. Aquí hay un resumen de la actividad.");
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [activityRes, citasRes, statsRes] = await Promise.all([
          api.get(`/recent-activity/${CHANNEL_NAME}`),
          api.get("/admin/dashboard/citas-semana"),
          api.get("/admin/dashboard/stats"),
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
            <PieChartOrdenes data={ordenesMock} />
          </div>
        </div>
        <FeedPanel feedItems={activities} channelName={CHANNEL_NAME} />
      </div>
    </>
  );
}

