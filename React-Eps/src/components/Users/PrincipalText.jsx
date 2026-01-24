export default function PrincipalText({icon, text, number}) {
    return (
        <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-12 rounded-lg bg-primary-green/10 text-primary-green">
                <span className="material-symbols-outlined text-3xl">{icon}</span>
            </div>
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{text} <span
                                    className="text-neutral-gray-text dark:text-gray-400 font-medium">(Total: {number})</span>
                </h2>
            </div>
        </div>
    )
}