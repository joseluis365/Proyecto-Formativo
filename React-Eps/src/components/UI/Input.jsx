export default function Input({ placeholder, icon, value, onChange, type = "text" }) {
    return (
        <div className="relative w-full">
            <span
                className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-neutral-gray-text/70 dark:text-gray-300">
                {icon}
            </span>
            <input
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900/50 border border-neutral-gray-border/50 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-shadow duration-200 dark:text-white text-gray-800 placeholder-gray-400 dark:placeholder-gray-300"
                placeholder={placeholder} type={type} value={value} onChange={onChange} />
        </div>
    )
}
