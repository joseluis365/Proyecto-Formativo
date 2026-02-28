export default function History({title, description, image}) {
    return (
        <section className="relative px-6 md:px-10 lg:px-40 pb-12 pt-0 -mt-12 z-30">
            <div className="max-w-[1200px] mx-auto">
                <div className="bg-white dark:bg-gray-700 rounded-3xl shadow-xl p-8 md:p-10 border border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    <div className="flex flex-col gap-4">
                        <span className="text-primary font-bold text-xs uppercase tracking-widest">Nuestra Historia</span>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight">{title}</h2>
                        <div className="space-y-3 text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                            <p>{description}</p>
                        </div>
                        <div className="flex items-center gap-6 mt-2">
                            <div className="flex flex-col">
                                <span className="text-2xl font-black text-primary">20+</span>
                                <span className="text-[10px] uppercase font-bold text-slate-400">Años de Trayectoria</span>
                            </div>
                            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800"></div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-black text-primary">1M+</span>
                                <span className="text-[10px] uppercase font-bold text-slate-400">Corazones Protegidos</span>
                            </div>
                        </div>
                    </div>
                    <div className="relative hidden md:block">
                        <div className="rounded-2xl overflow-hidden shadow-lg aspect-video bg-slate-100">
                            <div className="w-full h-full bg-center bg-cover" style={{backgroundImage: `url(${image})`}}></div>
                        </div>
                        <div className="absolute -bottom-4 -left-4 bg-sky-blue text-white py-3 px-5 rounded-xl shadow-lg border border-white/20">
                            <p className="font-bold text-sm">"Excelencia en cada atención"</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}