export default function StatCard({ title, value, change, type }) {
    const variants = {
        positive: "text-primary-green",
        negative: "text-soft-red",
        warning: "text-soft-orange",
    }
    
    return (
        <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-gray-900/50 border border-neutral-gray-border/20 dark:border-gray-800 shadow-sm">
            <p className="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal">{title}</p>
            <p className="text-gray-900 dark:text-white tracking-tight text-4xl font-bold leading-tight">{value}</p>
            <p className={`${variants[type]} text-sm font-medium leading-normal`}>{change}</p>
        </div>
    )
}