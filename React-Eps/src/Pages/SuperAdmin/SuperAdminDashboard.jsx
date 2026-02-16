import StatsPanel from "../../components/Dashboard/StatsPanel";
import { superAdminStats } from "../../data/dashboardStats";
import LineChart from "../../components/Charts/LineChart";
import FeedPanel from "../../components/Dashboard/FeedPanel";
import api from "../../Api/axios";
import { useEffect, useState } from "react";
import MotionSpinner from "../../components/UI/Spinner";

export default function SuperAdminDashboard() {
  const channelName = "superadmin-feed";
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [activityRes, statsRes] = await Promise.all([
          api.get(`/recent-activity/${channelName}`),
          api.get('/superadmin/dashboard-stats')
        ]);

        setActivities(activityRes.data);
        setStats(statsRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>
    <div className="flex items-center justify-center h-screen">
      <MotionSpinner />
    </div>
  </div>;
  return (
    <>
      <StatsPanel stats={stats.length > 0 ? stats : superAdminStats} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <LineChart />
        </div>
        <FeedPanel feedItems={activities} channelName={channelName} />
      </div>
    </>
  )
}