export default function Card({title, description, icon, color}) {
    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex gap-5">
            <div className={`shrink-0 w-12 h-12 bg-${color}/10 rounded-xl flex items-center justify-center text-${color}`}>
                <span className="material-symbols-outlined text-2xl">{icon}</span>
            </div>
            <div>
                <h3 className="text-lg font-black mb-2 text-slate-900 dark:text-white">{title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-snug text-sm">
                    {description}
                </p>
            </div>
        </div>
    )
}