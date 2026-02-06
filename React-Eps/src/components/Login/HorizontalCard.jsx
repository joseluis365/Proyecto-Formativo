export default function HorizontalCard({ icon, title, description }) {
    return (
        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <span className="material-symbols-outlined text-white text-2xl">{icon}</span>
            <div>
                <h3 className="text-white font-bold text-base">{title}</h3>
                <p className="text-white/60 text-sm">{description}</p>
            </div>
        </div>
    )
}