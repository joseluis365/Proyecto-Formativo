export default function List({ icon, title, items }) {
    return (
        <div>
            <div className="flex items-center gap-3 mb-3">
                <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">{icon}</span>
                <h3 className="text-gray-800 dark:text-gray-200 text-sm font-bold uppercase tracking-wider">{title}</h3>
            </div>
            <ul className="list-disc  list-inside text-gray-600 dark:text-gray-300 text-sm space-y-1 text-left">
                {items.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
    )
}