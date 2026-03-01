import Data from "./Data";

export default function FourthSection({data}) {
    return (
        <section className="px-6 md:px-10 lg:px-40 py-12 bg-primary dark:bg-primary/90 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="max-w-[1280px] mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="text-center md:text-left">
                    <h2 className="text-2xl md:text-3xl font-black mb-2 leading-tight">Cifras que Generan Confianza</h2>
                    <p className="text-primary-100 text-sm opacity-80">Compromiso real respaldado por resultados.</p>
                </div>
                <div className="grid grid-cols-3 gap-8 md:gap-16 text-center">
                    {data.map((item, index) => (
                        <Data key={index} number={item.number} title={item.title} />
                    ))}
                </div>
            </div>
        </section>
    )
}
