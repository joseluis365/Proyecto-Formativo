import StatsPanel from "../../components/Dashboard/StatsPanel";
import { superAdminStats } from "../../data/dashboardStats";
import LineChart from "../../components/Charts/LineChart";
import FeedPanel from "../../components/Dashboard/FeedPanel";
import { superAdminFeed } from "../../data/dashboardFeed";

export default function SuperAdminDashboard() {
    return (
        <>
            <StatsPanel stats={superAdminStats}/>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 flex flex-col gap-8">
                    <LineChart/>
                </div>
                <FeedPanel feedItems={superAdminFeed} />
            </div>
        </>
    )
}