import { Link, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useLayout } from "@/LayoutContext";
import { useHelp } from "@/hooks/useHelp";
import MuiIcon from "@/components/UI/MuiIcon";
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';

export default function ConfiguracionIndex() {
    const { setTitle, setSubtitle } = useLayout();
    const location = useLocation();
    const isIndex = location.pathname === "/configuracion" || location.pathname === "/configuracion/";

    useHelp({
        title: "Panel de Configuración",
        description: "Esta es el área donde se administran todos los catálogos y parámetros base del sistema. Todo lo que modifiques aquí afectará los menús desplegables y opciones en el resto de la aplicación.",
        sections: [
            {
                title: "Estructura",
                type: "list",
                items: [
                    "Aquí encontrarás sub-módulos como Tipos de Cita, Prioridades, Especialidades, Ubicaciones, y catálogos médicos/farmacéuticos.",
                    "Haz clic en cualquier tarjeta para ingresar a la gestión específica de ese catálogo."
                ]
            },
            {
                title: "Buenas prácticas",
                type: "warning",
                content: "Ten mucha precaución al inactivar o editar registros base. Si inactivas una 'Especialidad', por ejemplo, los médicos asignados a ella o las citas relacionadas podrían presentar conflictos en el futuro."
            }
        ]
    });

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
        },
        {
            title: "Concentraciones",
            description: "Administra los valores de concentración (mg, g, ml, etc).",
            icon: "science",
            to: "/configuracion/concentraciones",
            color: "cyan"
        },
        {
            title: "Formas Farmacéuticas",
            description: "Gestiona las presentaciones físicas (Tableta, Jarabe, etc).",
            icon: "medication_liquid",
            to: "/configuracion/formas-farmaceuticas",
            color: "indigo"
        },
        {
            title: "Medicamentos",
            description: "Catálogo maestro de medicamentos genéricos.",
            icon: "vaccines",
            to: "/configuracion/medicamentos",
            color: "rose"
        },
        {
            title: "Presentaciones",
            description: "Combina el medicamento, concentración y forma.",
            icon: "inventory_2",
            to: "/configuracion/presentaciones",
            color: "amber"
        },
        {
            title: "Motivos de Consulta",
            description: "Gestión de razones o motivos por los que el paciente puede agendar.",
            icon: "medical_services",
            to: "/configuracion/motivos-consulta",
            color: "pink"
        },
        {
            title: "Tipos de Documento",
            description: "Listado maestro de los documentos de identidad válidos.",
            icon: "badge",
            to: "/configuracion/tipos-documento",
            color: "violet"
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
                                <MuiIcon name={card.icon} sx={{ fontSize: '1.875rem' }} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                                {card.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                {card.description}
                            </p>
                            <div className="mt-6 flex items-center text-primary font-bold text-sm">
                                Gestionar
                                <ArrowForwardRoundedIcon sx={{ fontSize: "0.875rem" }} className="ml-1 group-hover:translate-x-1 transition-transform" />
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
