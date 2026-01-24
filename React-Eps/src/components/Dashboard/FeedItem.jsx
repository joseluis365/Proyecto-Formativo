export default function FeedItem({ icon, title, time, color }) {
    return (
        <div className="flex gap-4">
            <div
                className={`flex items-center justify-center size-10 rounded-full bg-${color}/10 text-${color}`}>
                <span className="material-symbols-outlined text-xl">{icon}</span>
            </div>
            <div className="flex-1">
                <p className="text-sm text-gray-800 dark:text-gray-200">{title}</p>
                <p className="text-xs text-neutral-gray-text dark:text-gray-400">{time}</p>
            </div>
        </div>
    )
}