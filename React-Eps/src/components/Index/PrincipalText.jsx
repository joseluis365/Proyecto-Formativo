export default function PrincipalText({title, subtitle, description}) {
    return (
        <div className="flex flex-col gap-3">
            <span className="inline-flex w-fit items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary uppercase tracking-widest">Líderes en salud en Colombia</span>
            <h1 className="text-slate-900 dark:text-white text-3xl @[480px]:text-5xl font-black leading-[1.1] tracking-tight">
                {title} <span className="text-primary">{subtitle}</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed max-w-[480px]">
                {description}
            </p>
        </div>


    )
}