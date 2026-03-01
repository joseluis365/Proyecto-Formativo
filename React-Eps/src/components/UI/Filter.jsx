export default function Filter({ options = [], placeholder, value, onChange }) {
    return (
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="appearance-none w-full bg-gray-50 dark:bg-gray-800 border border-neutral-gray-border/50 dark:border-gray-700 rounded-lg shadow-sm py-2.5 pl-4 pr-10 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-shadow duration-200 dark:text-white">
                <option value="">{placeholder}</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            <span
                className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-neutral-gray-text/70 dark:text-gray-300 pointer-events-none">expand_more</span>
        </div>
    )
}
