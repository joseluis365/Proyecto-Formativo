export default function Reason({ icon, title, description }) {
    return (
        <div className="group card-compact rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:border-primary/40 transition-all hover:shadow-md">
            <div className="mb-4 bg-primary/10 text-primary w-10 h-10 flex items-center justify-center rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-xl">{icon}</span>
            </div>
            <h4 className="text-slate-900 dark:text-white text-base font-bold mb-1.5">{title}</h4>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">{description}</p>
        </div>
    );
}
