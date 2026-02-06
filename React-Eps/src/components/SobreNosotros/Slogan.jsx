export default function Slogan({ text, slogan}) {
    return (
        <section className="w-full bg-primary/5 py-12 text-center px-6 border-t border-slate-100 dark:border-slate-800">
            <div className="max-w-3xl mx-auto">
                <span className="material-symbols-outlined text-3xl text-primary/40 mb-3">format_quote</span>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight italic mb-4">
                    "{text}"
                </h2>
                <div className="flex items-center justify-center gap-4">
                    <div className="h-px w-8 bg-primary/30"></div>
                    <p className="text-primary font-bold uppercase tracking-widest text-xs">{slogan}</p>
                    <div className="h-px w-8 bg-primary/30"></div>
                </div>
            </div>
        </section>
    )
}