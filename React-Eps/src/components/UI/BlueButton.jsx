export default function BlueButton({text, icon}) {
    return (
        <button className="bg-primary hover:bg-primary/90 text-white cursor-pointer rounded-lg px-6 py-3 font-bold text-sm transition-all flex items-center justify-center gap-2 group shadow-lg shadow-primary/20">
            <span>{text}</span>
            <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">{icon}</span>
        </button>
    )
}