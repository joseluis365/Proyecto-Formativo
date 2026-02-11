export default function ModalHeader({ icon, title, onClose }) {
    return (
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-4">
                <div className="flex items-center justify-center size-12 rounded-xl bg-primary/10 text-primary">
                    <span className="material-symbols-outlined text-3xl">{icon}</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {title}
                </h2>
            </div>
            <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
            >
                <span className="material-symbols-outlined">close</span>
            </button>
        </div>

    )
}