export default function Filter({options, placeholder}) {
    return (
        <div className="relative">
        <select
            className="appearance-none w-full bg-gray-50 dark:bg-gray-800 border border-neutral-gray-border/50 dark:border-gray-700 rounded-lg shadow-sm py-2.5 pl-4 pr-10 focus:ring-2 focus:ring-primary-green/50 focus:border-primary-green outline-none transition-shadow duration-200">
            <option>{placeholder}</option>
            {options.map((option) => (
                <option key={option}>{option}</option>
            ))}
        </select>
        <span
            className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-neutral-gray-text/70 dark:text-gray-400 pointer-events-none">expand_more</span>
        </div>
    )
}