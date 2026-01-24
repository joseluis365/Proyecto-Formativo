export default function AddButton({icon,text}) {
    return (
        <button className="flex items-center gap-2 bg-primary-green hover:bg-primary-green/90 text-white font-semibold py-2.5 px-5 rounded-lg shadow-sm transition-colors duration-200">
            <span className="material-symbols-outlined">{icon}</span>
            {text}
        </button>
    )
}