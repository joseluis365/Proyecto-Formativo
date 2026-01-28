export default function ModalHeader({icon, title, id, onClose}) {
    return (
        <div className="flex items-center justify-between p-4 rounded-t-lg bg-teal-600 text-white">
            <div className="flex items-center gap-3">
                <span className="material-symbols-outlined">{icon}</span>
                <h1 className="text-lg font-bold tracking-wide">{title}: # {id}</h1>
            </div>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 transition-colors">
                <span className="material-symbols-outlined cursor-pointer">close</span>
                    </button>
        </div>

    )
}