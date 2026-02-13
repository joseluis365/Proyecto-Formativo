import StatsPanel from "../../components/Dashboard/StatsPanel";
import { superAdminStats } from "../../data/dashboardStats";
import LineChart from "../../components/Charts/LineChart";
import FeedPanel from "../../components/Dashboard/FeedPanel";
import api from "../../Api/axios";
import { useEffect, useState } from "react";
import MotionSpinner from "../../components/UI/Spinner";

export default function SuperAdminDashboard() {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const channelName = "superadmin-feed";
    useEffect(() => {
  const fetchHistory = async () => {
    try {
      const response = await api.get(`/recent-activity/${channelName}`);
      // CAMBIO AQUÍ: Usa response.data directamente si el JSON empieza con [
      setActivities(response.data); 
      setLoading(false); // IMPORTANTE: Para que deje de mostrar "Cargando..."
    } catch (error) {
      console.error("Error cargando historial:", error);
      setLoading(false); 
    }
  };

  fetchHistory();
}, []);

  if (loading) return <div>
    <div className="flex items-center justify-center h-screen">
      <MotionSpinner/>
    </div>
  </div>;
    return (
        <>
            <StatsPanel stats={superAdminStats}/>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 flex flex-col gap-8">
                    <LineChart/>
                </div>
                <FeedPanel feedItems={activities} channelName={channelName} />
            </div>
        </>
    )
}