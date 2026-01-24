import StatCard from "./StatCard";

export default function StatsPanel({ stats }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
                <StatCard key={index} title={stat.title} value={stat.value} change={stat.change} type={stat.type} />
            ))}
        </div>
    )
}