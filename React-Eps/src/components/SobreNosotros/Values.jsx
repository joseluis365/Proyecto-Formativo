import Card from "./Card";
import ValueItem from "./ValueItem";

export default function Values() {
    const values = [
        { text: "Confianza", icon: "handshake" },
        { text: "Calidad", icon: "verified" },
        { text: "Humanidad", icon: "volunteer_activism" },
        { text: "Innovación", icon: "lightbulb" }
    ]
    return (
        <section className="px-6 md:px-10 lg:px-40 py-12 bg-slate-50 dark:bg-slate-900/40">
            <div className="max-w-[1200px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <Card title="Misión" description="Brindar servicios de salud integrales con altos estándares de calidad y humanismo, contribuyendo al bienestar sostenible." icon="rocket_launch" color="primary" />
                    <Card title="Visión" description="Ser reconocidos como la EPS líder en innovación y experiencia del usuario, destacándonos por calidez y eficiencia." icon="visibility" color="sky-blue" />
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest text-center mb-6">Nuestros Valores</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {values.map((value, index) => (
                            <ValueItem key={index} text={value.text} icon={value.icon} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
