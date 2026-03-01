import Reason from "./Reason";

export default function SecondSection({reasons}) {
    
    return (
        <section className="px-6 md:px-10 lg:px-40 py-10 bg-slate-50 dark:bg-slate-900 -mt-8 relative z-20">
            <div className="max-w-[1280px] mx-auto">
                <div className="flex flex-col gap-2 text-center mb-8">
                    <h2 className="text-primary font-bold text-[10px] uppercase tracking-[0.2em]">Nuestras Ventajas</h2>
                    <h3 className="text-slate-900 dark:text-white text-2xl md:text-3xl font-black leading-tight">
                        ¿Por qué elegir Salud Total?
                    </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {reasons.map((reason, index) => (
                        <Reason
                            key={index}
                            icon={reason.icon}
                            title={reason.title}
                            description={reason.description}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
