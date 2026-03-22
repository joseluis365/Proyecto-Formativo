import { useEffect } from "react";
import { useLayout } from "../../LayoutContext";
import PrincipalText from "../../components/Users/PrincipalText";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function IndexPaciente() {
    const { setTitle, setSubtitle, setHelpContent } = useLayout();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        setTitle(`Bienvenido, ${user.primer_nombre}`);
        setSubtitle("Aquí puedes gestionar tu salud de forma rápida y sencilla.");
        setHelpContent({
            title: "Bienvenido al Portal Paciente",
            description: "Desde esta pantalla principal puedes navegar a las diferentes opciones de gestión de tu salud.",
            sections: [
                {
                    title: "Navegación",
                    type: "tip",
                    content: "Utiliza los botones de la parte superior o las tarjetas centrales para agendar citas, ver tus citas pendientes o revisar tu historial médico."
                },
                {
                    title: "Información General",
                    type: "text",
                    content: "Asegúrate de mantener tus datos actualizados desde la sección de Perfil (icono de usuario en la esquina superior derecha) para recibir notificaciones."
                }
            ]
        });
        return () => setHelpContent(null);
    }, [setTitle, user.primer_nombre, setSubtitle, setHelpContent]);

    const cards = [
        {
            title: "Agendar Cita",
            desc: "Busca un médico y reserva tu espacio en segundos.",
            icon: "add_circle",
            color: "bg-blue-500",
            to: "/paciente/agendar"
        },
        {
            title: "Mis Citas",
            desc: "Visualiza tus próximas citas y gestiona cancelaciones.",
            icon: "calendar_month",
            color: "bg-emerald-500",
            to: "/paciente/citas"
        },
        {
            title: "Mi Historial",
            desc: "Consulta diagnósticos y tratamientos de citas previas.",
            icon: "history",
            color: "bg-purple-500",
            to: "/paciente/historial"
        },
        {
            title: "Mis Medicamentos",
            desc: "Revisa tus recetas activas y medicamentos recetados por tu médico.",
            icon: "medication",
            color: "bg-orange-500",
            to: "/paciente/medicamentos"
        }
    ];

    return (
        <div className="space-y-12 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {cards.map((card, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Link
                            to={card.to}
                            className="block bg-white dark:bg-gray-900 p-8 rounded-4xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group overflow-hidden relative border border-gray-100 dark:border-gray-800"
                        >
                            <div className={`${card.color} size-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-${card.color.split('-')[1]}-500/30`}>
                                <span className="material-symbols-outlined text-3xl font-bold">{card.icon}</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{card.title}</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{card.desc}</p>

                            <div className="mt-6 flex items-center text-primary font-bold text-sm">
                                Ir ahora
                                <span className="material-symbols-outlined ml-2 group-hover:translate-x-2 transition-transform">arrow_forward</span>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            <div className="bg-primary/5 rounded-[2.5rem] p-12 flex flex-col md:flex-row items-center gap-12 border border-primary/10">
                <div className="flex-1 space-y-4">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Tu salud, nuestra prioridad</h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-xl">En Salud Integral estamos comprometidos con ofrecerte el mejor servicio médico. Si tienes alguna emergencia, comunícate inmediatamente a nuestra línea de atención +57 312 345 6789.</p>
                </div>
                <div className="shrink-0 size-48 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center p-4 shadow-2xl shadow-primary/20">
                    <img
                        src="https://www.velezortiz.es/wp-content/uploads/2024/04/seguros-de-salud-en-espana.jpg"
                        alt="Medical team"
                        className="rounded-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
}
