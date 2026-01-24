import FeedItem from "./FeedItem";

export default function FeedPanel({ feedItems }) {
    return (
        <div className="lg:col-span-1 bg-white dark:bg-gray-900/50 rounded-xl border border-neutral-gray-border/20 dark:border-gray-800 shadow-sm p-6">
            <h3 className="text-gray-800 dark:text-gray-200 text-lg font-semibold mb-4">Actividad Reciente</h3>
            <div className="space-y-6">
                {feedItems.map((item) => (
                    <FeedItem key={item.id} icon={item.icon} title={item.title} time={item.time} color={item.color} />
                ))}
            </div>
        </div>
    )
}