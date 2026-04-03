import { useEffect, useState } from "react";
import { useLayout } from "../../LayoutContext";
import PrincipalText from "../../components/Users/PrincipalText";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import api from "../../Api/axios";

// Imports de MUI Icons
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import EventIcon from '@mui/icons-material/Event';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HistoryIcon from '@mui/icons-material/History';
import MedicationIcon from '@mui/icons-material/Medication';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CallIcon from '@mui/icons-material/Call';
import InfoIcon from '@mui/icons-material/Info';

const renderAlertaIcon = (iconName) => {
    switch(iconName) {
        case 'event': return <EventIcon />;
        case 'medication': return <MedicationIcon />;
        case 'history': return <HistoryIcon />;
        default: return <InfoIcon />;
    }
};

export default function IndexPaciente() {
    const { setTitle, setSubtitle, setHelpContent } = useLayout();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [alertas, setAlertas] = useState([]);
    const [loadingAlerts, setLoadingAlerts] = useState(true);

    useEffect(() => {
        setTitle(`Bienvenido, ${user.primer_nombre}`);
        setSubtitle("Aquí puedes gestionar tu salud de forma rápida y sencilla.");
        setHelpContent({
            title: "Bienvenido al Portal Paciente",
            description: "Desde esta pantalla principal puedes navegar a las diferentes opciones de gestión de tu salud.",
            sections: [
                {
                    title: "Alertas y Notificaciones",
                    type: "tip",
                    content: "Si tienes citas, exámenes próximos o recetas pendientes, aparecerán tarjetas informativas en la parte superior."
                },
                {
                    title: "Navegación",
                    type: "text",
                    content: "Utiliza los botones de la parte superior o las tarjetas centrales para agendar citas, ver tus citas pendientes o revisar tu historial médico."
                }
            ]
        });

        // Fetch de alertas
        const fetchAlertas = async () => {
            try {
                const response = await api.get('/paciente/alertas');
                setAlertas(response);
            } catch (error) {
                console.error("Error al obtener alertas:", error);
            } finally {
                setLoadingAlerts(false);
            }
        };

        fetchAlertas();

        return () => setHelpContent(null);
    }, [setTitle, user.primer_nombre, setSubtitle, setHelpContent]);

    const cards = [
        {
            title: "Agendar Cita",
            desc: "Busca un médico y reserva tu espacio en segundos.",
            icon: AddCircleIcon,
            color: "bg-blue-500",
            to: "/paciente/agendar"
        },
        {
            title: "Mis Citas",
            desc: "Visualiza tus próximas citas y gestiona cancelaciones.",
            icon: CalendarMonthIcon,
            color: "bg-emerald-500",
            to: "/paciente/citas"
        },
        {
            title: "Mi Historial",
            desc: "Consulta diagnósticos y tratamientos de citas previas.",
            icon: HistoryIcon,
            color: "bg-purple-500",
            to: "/paciente/historial"
        },
        {
            title: "Mis Medicamentos",
            desc: "Revisa tus recetas activas y medicamentos recetados por tu médico.",
            icon: MedicationIcon,
            color: "bg-orange-500",
            to: "/paciente/medicamentos"
        }
    ];

    const getColorClasses = (color) => {
        const colors = {
            blue: "bg-blue-50 border-blue-200 text-blue-700 icon-bg-blue-500",
            indigo: "bg-indigo-50 border-indigo-200 text-indigo-700 icon-bg-indigo-500",
            orange: "bg-orange-50 border-orange-200 text-orange-700 icon-bg-orange-500",
            emerald: "bg-emerald-50 border-emerald-200 text-emerald-700 icon-bg-emerald-500"
        };
        return colors[color] || colors.blue;
    };

    return (
        <div className="space-y-10 py-6">
            {/* Sección de Alertas */}
            <AnimatePresence>
                {alertas.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                <NotificationsActiveIcon className="text-primary" />
                                Avisos importantes
                            </h2>
                            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                                {alertas.length} {alertas.length === 1 ? 'notificación' : 'notificaciones'}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {alertas.map((alerta, idx) => (
                                <motion.div
                                    key={`${alerta.tipo}-${alerta.id}`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <Link
                                        to={alerta.link}
                                        className={`flex gap-4 p-4 rounded-3xl border transition-all hover:shadow-md group relative overflow-hidden ${
                                            alerta.color === 'blue' ? 'bg-blue-50/50 border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/30' :
                                            alerta.color === 'indigo' ? 'bg-indigo-50/50 border-indigo-100 dark:bg-indigo-900/10 dark:border-indigo-900/30' :
                                            'bg-orange-50/50 border-orange-100 dark:bg-orange-900/10 dark:border-orange-900/30'
                                        }`}
                                    >
                                        <div className={`shrink-0 size-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${
                                            alerta.color === 'blue' ? 'bg-blue-500 shadow-blue-500/20' :
                                            alerta.color === 'indigo' ? 'bg-indigo-500 shadow-indigo-500/20' :
                                            'bg-orange-500 shadow-orange-500/20'
                                        }`}>
                                            {renderAlertaIcon(alerta.icon)}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate">
                                                {alerta.titulo}
                                            </h4>
                                            <p className="text-gray-600 dark:text-gray-400 text-xs line-clamp-2 mt-0.5">
                                                {alerta.descripcion}
                                            </p>

                                            <div className="mt-2 flex items-center gap-3">
                                                {alerta.fecha && (
                                                    <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 text-gray-500 dark:text-gray-500">
                                                        <EventIcon style={{ fontSize: '14px' }} />
                                                        {alerta.fecha} {alerta.hora && `| ${alerta.hora}`}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ChevronRightIcon className="text-gray-400" />
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Grid de Accesos Directos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Link
                            to={card.to}
                            className="block bg-white dark:bg-gray-900 p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden relative border border-gray-100 dark:border-gray-800"
                        >
                            <div className={`${card.color} size-12 rounded-2xl flex items-center justify-center text-white mb-5 shadow-lg shadow-${card.color.split('-')[1]}-500/20`}>
                                <card.icon style={{ fontSize: '1.5rem' }} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{card.title}</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed line-clamp-2">{card.desc}</p>

                            <div className="mt-4 flex items-center text-primary font-bold text-xs">
                                Gestionar
                                <ArrowForwardIcon className="ml-1.5 group-hover:translate-x-1 transition-transform" style={{ fontSize: '14px' }} />
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Banner de Bienvenida / Ayuda */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-linear-to-br from-primary/10 via-primary/5 to-transparent rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-10 border border-primary/10"
            >

                <div className="flex-1 space-y-4">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">Tu bienestar es nuestro compromiso</h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-xl text-lg">En <span className="text-primary font-bold">Saluvanta EPS</span> estamos para cuidarte. Accede a teleconsultas, descarga resultados y gestiona tus citas desde la comodidad de tu hogar.</p>
                    <div className="pt-2 flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                            <CallIcon className="text-emerald-500" />
                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">+57 601 234 5678</span>
                        </div>
                    </div>
                </div>
                <div className="shrink-0 size-44 rounded-[2.5rem] bg-white dark:bg-gray-800 flex items-center justify-center p-3 shadow-2xl shadow-primary/20 rotate-3">
                    <img
                        src="https://img.freepik.com/vector-premium/equipo-medicos-que-trabaja-aislado-ilustracion-vectorial-blanca_1284-68112.jpg"
                        alt="Medical team"
                        className="rounded-4xl object-cover h-full w-full"
                    />

                </div>
            </motion.div>
        </div>
    );
}
