import { useEffect } from "react";
import { useLayout } from "../../LayoutContext";
import BarChartCitas from "../../components/Charts/BarChartCitas";
import PieChartOrdenes from "../../components/Charts/PieChartOrdenes";
import FeedPanel from "../../components/Dashboard/FeedPanel";
import StatsPanel from "../../components/Dashboard/StatsPanel";
import { dashboardStats } from "../../data/dashboardStats";
import { dashboardFeed } from "../../data/dashboardFeed";
import { citasMock } from "../../data/graficsData";
import { ordenesMock } from "../../data/graficsData";

export default function Dashboard() {
  const { setTitle, setSubtitle } = useLayout();
  useEffect(() => {
    setTitle("Dashboard");
    setSubtitle("Bienvenido de nuevo, Admin. Aquí hay un resumen de la actividad de hoy.");
  }, []);
  return (
    <>
      <StatsPanel stats={dashboardStats} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <BarChartCitas data={citasMock} />
            <PieChartOrdenes data={ordenesMock} />
          </div>
        </div>
        <FeedPanel feedItems={dashboardFeed} channelName="admin-feed" />
      </div>
    </>
  );
}

