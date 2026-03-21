import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLayout } from "../../LayoutContext";
import CalendarSelector from "../../components/Medico/CalendarSelector";
import TableSkeleton from "../../components/UI/TableSkeleton";
import PrincipalText from "../../components/Users/PrincipalText";
import { AnimatePresence, motion } from "framer-motion";
import api from "../../Api/axios";

function formatDateLabel(dateStr) {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    });
}

export default function AgendaExamenes() {
    const { setTitle, setSubtitle, setHelpContent } = useLayout();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split('T')[0]
    );

    const navigate = useNavigate();
    const [examenes, setExamenes] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchExamenes = async () => {
        setLoading(true);
        try {
            const res = await api.get('/examenes/agenda', { params: { fecha: selectedDate } });
            setExamenes(res.data?.data || []);
        } catch (error) {
            console.error("Error fetching examenes:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExamenes();
    }, [selectedDate]);

    useEffect(() => {
        setTitle("Agenda de Exámenes");
        setSubtitle("Módulo de toma de muestras y resultados de laboratorio.");

        setHelpContent({
            title: "Guía de Laboratorio",
            description: "Visualiza los pacientes agendados para toma de exámenes.",
            sections: [
                {
                    title: "Atención",
                    type: "text",
                    content: "Selecciona 'Atender' para subir los PDF de los resultados y enviarlos automáticamente por correo al paciente."
                }
            ]
        });
        return () => setHelpContent(null);
    }, [setTitle, setSubtitle, setHelpContent]);

    const isToday = selectedDate === new Date().toISOString().split('T')[0];

    const isAtendido = (estado) => ['Atendida', 'Finalizada'].includes(estado);

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
                <div className="size-14 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-3xl text-indigo-600 dark:text-indigo-400">biotech</span>
                </div>
                <div>
                    <h2 className="text-xl font-bold dark:text-white">Laboratorio Clínico</h2>
                    <p className="text-sm text-gray-500">Profesional: {user.primer_nombre} {user.primer_apellido}</p>
                </div>
            </div>

            <div className="flex flex-col xl:flex-row gap-6 items-start">
                <div className="flex-1 min-w-0 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-gray-100 dark:border-gray-800">
                        <PrincipalText
                            icon={isToday ? "today" : "calendar_today"}
                            text={isToday ? `Hoy — ${formatDateLabel(selectedDate)}` : formatDateLabel(selectedDate)}
                            number={examenes.length}
                        />

                        {!isToday && (
                            <button
                                onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                                className="flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-800 px-3 py-2 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                            >
                                <span className="material-symbols-outlined text-base">today</span>
                                Volver a hoy
                            </button>
                        )}
                    </div>

                    <div className="p-0 sm:p-6 overflow-x-auto">
                        <AnimatePresence mode="wait">
                            {loading ? (
                                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <div className="p-6">
                                        <TableSkeleton rows={5} columns={5} />
                                    </div>
                                </motion.div>
                            ) : examenes.length === 0 ? (
                                <motion.div key={`empty-${selectedDate}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center py-16 m-6 rounded-2xl border-2 border-dashed border-gray-200">
                                    <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4 block">science</span>
                                    <p className="text-gray-500 font-medium text-sm">No hay exámenes programados para esta fecha.</p>
                                </motion.div>
                            ) : (
                                <motion.div key={`table-${selectedDate}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                    <table className="w-full text-left text-sm whitespace-nowrap">
                                        <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 font-bold uppercase text-xs tracking-wider">
                                            <tr>
                                                <th className="px-6 py-4 rounded-tl-xl">Hora</th>
                                                <th className="px-6 py-4">Paciente / Documento</th>
                                                <th className="px-6 py-4">Examen</th>
                                                <th className="px-6 py-4">Ayuno</th>
                                                <th className="px-6 py-4">Estado</th>
                                                <th className="px-6 py-4 rounded-tr-xl">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                            {examenes.map(exam => (
                                                <tr key={exam.id_examen} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-gray-100">{exam.hora_inicio?.slice(0, 5)}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-gray-900 dark:text-gray-100">{exam.paciente?.primer_nombre} {exam.paciente?.primer_apellido}</div>
                                                        <div className="text-xs text-gray-500">{exam.paciente?.documento}</div>
                                                    </td>
                                                    <td className="px-6 py-4 font-medium text-gray-700 dark:text-gray-300">
                                                        {exam.categoria_examen?.categoria ?? 'Laboratorio'}
                                                    </td>
                                                    <td className="px-6 py-4 flex mt-2">
                                                        {exam.requiere_ayuno ? (
                                                            <span className="bg-orange-100 text-orange-700 font-bold px-2 py-1 rounded text-xs flex items-center gap-1 w-fit"><span className="material-symbols-outlined text-sm">restaurant</span> Sí</span>
                                                        ) : (
                                                            <span className="bg-green-100 text-green-700 font-bold px-2 py-1 rounded text-xs flex items-center gap-1 w-fit"><span className="material-symbols-outlined text-sm">no_food</span> No</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 text-xs font-bold rounded-lg ${isAtendido(exam.estado?.nombre_estado) ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                            {exam.estado?.nombre_estado}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {isAtendido(exam.estado?.nombre_estado) ? (
                                                            <button disabled className="text-gray-400 bg-gray-100 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 cursor-not-allowed">
                                                                <span className="material-symbols-outlined text-sm">check_circle</span>
                                                                Completado
                                                            </button>
                                                        ) : (
                                                            <button 
                                                                onClick={() => navigate(`/examenes/atender/${exam.id_examen}`)}
                                                                className="bg-indigo-600 text-white hover:bg-indigo-700 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-sm hover:shadow-indigo-500/20 transition-all"
                                                            >
                                                                <span className="material-symbols-outlined text-sm">science</span>
                                                                Atender
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="w-full xl:w-72 shrink-0">
                    <CalendarSelector selectedDate={selectedDate} onDateSelect={setSelectedDate} />
                </div>
            </div>
        </div>
    );
}
