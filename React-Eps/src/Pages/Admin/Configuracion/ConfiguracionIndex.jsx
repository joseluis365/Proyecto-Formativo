import { Link, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useLayout } from "@/LayoutContext";

export default function ConfiguracionIndex() {
    const { setTitle, setSubtitle } = useLayout();
    const location = useLocation();
    const isIndex = location.pathname === "/configuracion" || location.pathname === "/configuracion/";

    useEffect(() => {
        setTitle("Configuración");
        setSubtitle("Gestiona los parámetros globales de la aplicación.");
    }, [setTitle, setSubtitle]);

    const cards = [
        {
            title: "Tipos de Cita",
            description: "Gestiona las modalidades de atención médica.",
            icon: "calendar_today",
            to: "/configuracion/tipos-cita",
            color: "orange"
        },
        {
            title: "Catalogo de Exámenes",
            description: "Agrupaciones y categorías para laboratorios.",
            icon: "biotech",
            to: "/configuracion/categorias-examen",
            color: "rose"
        },
        {
            title: "Catalogo de Medicamentos",
            description: "Clasificaciones farmacéuticas del sistema.",
            icon: "medication",
            to: "/configuracion/categorias-medicamento",
            color: "emerald"
        },
        {
            title: "Prioridades",
            description: "Gestiona los niveles de prioridad para las citas.",
            icon: "priority_high",
            to: "/configuracion/prioridades",
            color: "blue"
        },
        {
            title: "Especialidades",
            description: "Listado de especialidades médicas disponibles.",
            icon: "clinical_notes",
            to: "/configuracion/especialidades",
            color: "teal"
        },
        {
            title: "Ubicaciones",
            description: "Consulta la división política (Deptos y Ciudades).",
            icon: "distance",
            to: "/configuracion/ubicaciones",
            color: "purple"
        },
        {
            title: "Farmacias",
            description: "Gestiona las farmacias asociadas a la empresa.",
            icon: "local_pharmacy",
            to: "/configuracion/farmacias",
            color: "blue"
        }
    ];

    return (
        <>
            {isIndex ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cards.map((card, index) => (
                        <Link
                            key={index}
                            to={card.to}
                            className="flex flex-col p-6 bg-white dark:bg-gray-800 rounded-xl border border-neutral-gray-border/20 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow group"
                        >
                            <div className={`p-3 rounded-lg w-fit mb-4 bg-${card.color}-100 dark:bg-${card.color}-900/30 text-${card.color}-600 dark:text-${card.color}-400`}>
                                <span className="material-symbols-outlined text-3xl">{card.icon}</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                                {card.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                {card.description}
                            </p>
                            <div className="mt-6 flex items-center text-primary font-bold text-sm">
                                Gestionar
                                <span className="material-symbols-outlined text-sm ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <Outlet />
            )}
        </>
    );
}
