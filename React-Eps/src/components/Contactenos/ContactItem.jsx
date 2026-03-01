export default function ContactItem({icon, title, description}) {
    return (
        <div className="flex gap-3">
            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-base">{icon}</span>
            </div>
            <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">{title}</p>
                {description.map((item) => (
                    <p key={item.id} className="text-xs text-slate-600 dark:text-slate-400">{item.description}</p>
                )) }
                <p className="text-xs text-slate-600 dark:text-slate-400"></p>
            </div>
        </div>
    )
}
