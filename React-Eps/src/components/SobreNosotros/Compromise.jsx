import ImageItem from "./ImageItem";

export default function Compromise({image, image2}) {
    return (
        <section className="px-6 md:px-10 lg:px-40 py-12 bg-white dark:bg-gray-700">
            <div className="max-w-[1200px] mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                    <div className="max-w-xl">
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">Nuestro Compromiso Social</h2>
                        <p className="text-slate-500 mt-1 text-sm">Construyendo una sociedad más saludable a través de programas integrales.</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ImageItem image={image} title="Impacto Social" description="Apoyo a comunidades vulnerables y jornadas de salud en zonas rurales." />
                    <ImageItem image={image2} title="Prevención y Vida" description="Iniciativas enfocadas en detección temprana y hábitos saludables." />
                </div>
            </div>
        </section>
    )
}