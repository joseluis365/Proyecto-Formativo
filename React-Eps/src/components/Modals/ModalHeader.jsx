export default function ModalHeader({ icon, title, subtitle, onClose }) {
    return (
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
                <div className="flex items-center justify-center size-9 sm:size-12 shrink-0 rounded-xl bg-primary/10 text-primary">
                    <span className="material-symbols-outlined text-xl sm:text-3xl">{icon}</span>
                </div>
                <div className="overflow-hidden">
                    <h2 className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-gray-100 leading-tight truncate">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="text-[10px] sm:text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest truncate">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
            <button
                onClick={onClose}
                className="p-1.5 sm:p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer shrink-0"
            >
                <span className="material-symbols-outlined text-base sm:text-xl">close</span>
            </button>
        </div>

    )
}
