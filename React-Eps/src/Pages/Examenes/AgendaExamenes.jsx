import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLayout } from "../../LayoutContext";
import CalendarSelector from "../../components/Medico/CalendarSelector";
import TableSkeleton from "../../components/UI/TableSkeleton";
import PrincipalText from "../../components/Users/PrincipalText";
import ExamenTable from "../../components/Examenes/ExamenTable";
import AtenderExamenModal from "../../components/Modals/AtenderExamenModal";
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

    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split('T')[0]
    );

    const [examenes, setExamenes] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedExamen, setSelectedExamen] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchExamenes = async () => {
        setLoading(true);
        try {
            const res = await api.get('/examenes/agenda', { params: { fecha: selectedDate } });
            // El interceptor devuelve response.data.data si success está presente
            // ExamenClinicoController@agenda devuelve {success: true, data: [...]}
            // Así que res ya es el array de exámenes.
            setExamenes(Array.isArray(res) ? res : res.data || []);
        } catch (error) {
            console.error("Error fetching examenes:", error);
        } finally {
            setLoading(false);
        }
    };

    const [filtroPaciente, setFiltroPaciente] = useState("");
    const [filtroHora, setFiltroHora] = useState("");
    const [filtroTipo, setFiltroTipo] = useState("");

    // Derivamos las categorías únicas de los exámenes cargados en la agenda
    const categoriasDisponibles = Array.from(
        new Map(
            examenes
                .filter(e => e.categoria_examen)
                .map(e => [e.id_categoria_examen, e.categoria_examen])
        ).values()
    ).sort((a, b) => a.categoria.localeCompare(b.categoria));

    const filteredExamenes = (examenes || []).filter(exam => {
        if (filtroPaciente) {
            const nombreCompleto = exam.paciente 
                ? `${exam.paciente.primer_nombre} ${exam.paciente.primer_apellido}`.toLowerCase() 
                : "";
            const documento = String(exam.paciente?.documento || "");
            if (!nombreCompleto.includes(filtroPaciente.toLowerCase()) && !documento.includes(filtroPaciente)) return false;
        }
        if (filtroHora && !exam.hora_inicio?.startsWith(filtroHora)) return false;

        if (filtroTipo) {
            if (String(exam.id_categoria_examen) !== String(filtroTipo)) return false;
        }
        return true;
    });

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

    const handleAtender = (examen) => {
        setSelectedExamen(examen);
        setIsModalOpen(true);
    };

    const handleModalSuccess = () => {
        setIsModalOpen(false);
        setSelectedExamen(null);
        fetchExamenes(); // Refrescar los datos de la tabla
    };

    return (
        <div className="space-y-6">
            {/* Filtros */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Paciente / DOC</label>
                    <input 
                        type="text" 
                        placeholder="Buscar por nombre o doc..." 
                        value={filtroPaciente}
                        onChange={(e) => setFiltroPaciente(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none"
                    />
                </div>
                <div className="flex-1 w-full">
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Hora inicio</label>
                    <input 
                        type="time" 
                        value={filtroHora}
                        onChange={(e) => setFiltroHora(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none"
                    />
                </div>
                <div className="flex-1 w-full">
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Tipo de Examen</label>
                    <select 
                        value={filtroTipo}
                        onChange={(e) => setFiltroTipo(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all outline-none appearance-none"
                    >
                        <option value="">Todos los tipos</option>
                        {categoriasDisponibles.map(cat => (
                            <option key={cat.id_categoria_examen} value={cat.id_categoria_examen}>
                                {cat.categoria}
                            </option>
                        ))}
                    </select>
                </div>
                {(filtroPaciente || filtroHora || filtroTipo) && (
                    <button 
                        onClick={() => { setFiltroPaciente(""); setFiltroHora(""); setFiltroTipo(""); }}
                        className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl font-bold text-sm transition-colors cursor-pointer"
                    >
                        Limpiar
                    </button>
                )}
            </div>

            <div className="flex flex-col xl:flex-row gap-6 items-start">
                <div className="flex-1 min-w-0 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-gray-100 dark:border-gray-800">
                        <PrincipalText
                            icon={isToday ? "today" : "calendar_today"}
                            text={isToday ? `Hoy — ${formatDateLabel(selectedDate)}` : formatDateLabel(selectedDate)}
                            number={filteredExamenes.length}
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
                            ) : filteredExamenes.length === 0 ? (
                                <motion.div key={`empty-${selectedDate}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center py-16 m-6 rounded-2xl border-2 border-dashed border-gray-200">
                                    <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4 block">science</span>
                                    <p className="text-gray-500 font-medium text-sm">No hay exámenes para mostrar con esos filtros.</p>
                                </motion.div>
                            ) : (
                                <motion.div key={`table-${selectedDate}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                    <ExamenTable 
                                        examenes={filteredExamenes} 
                                        onAtender={handleAtender} 
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="w-full xl:w-72 shrink-0">
                    <CalendarSelector selectedDate={selectedDate} onDateSelect={setSelectedDate} />
                </div>
            </div>

            <AtenderExamenModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                examen={selectedExamen} 
                onSuccess={handleModalSuccess}
            />
        </div>
    );
}
