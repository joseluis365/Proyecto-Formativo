export default function Service({image, title, description}) {
    return (
        <div className="group flex flex-col gap-3">
            <div className="relative w-full aspect-4/3 overflow-hidden rounded-xl">
                <div className="w-full h-full bg-center bg-cover group-hover:scale-105 transition-transform duration-500" data-alt="Patient having a remote consultation via tablet"
                style={{ backgroundImage: `url(${image})` }} >
                </div>
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div>
                <p className="text-slate-900 dark:text-white text-base font-bold mb-0.5">{title}</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2">{description}</p>
            </div>
        </div>
    )
}
