import Service from "./Service";

export default function ThirdSection({services}) {
    return (
        <section className="px-6 md:px-10 lg:px-40 py-12 bg-white dark:bg-background-dark">
            <div className="max-w-[1280px] mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-baseline mb-8 gap-4">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-slate-900 dark:text-white text-2xl font-bold tracking-tight">Servicios Principales</h2>
                        <p className="text-slate-500 text-sm">Tu salud a un click de distancia</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                    {services.map((service) => (
                        <Service key={service.id} image={service.image} title={service.title} description={service.description} />
                    ))}
                </div>
            </div>
        </section>
    )
}