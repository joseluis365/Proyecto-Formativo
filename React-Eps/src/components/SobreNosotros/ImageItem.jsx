export default function ImageItem({ image, title, description }) {
    return (
        <div className="group relative overflow-hidden rounded-2xl bg-slate-900 h-[240px]">
            <div className="absolute inset-0 bg-cover bg-center opacity-70 group-hover:scale-105 transition-transform duration-700" style={{backgroundImage: `url(${image})`}}></div>
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6">
                <h4 className="text-xl font-bold text-white mb-1">{title}</h4>
                <p className="text-white/80 text-sm max-w-sm">{description}</p>
            </div>
        </div>
    )
}