import { useEffect, useState } from 'react';
import api from "../../../Api/axios";
import { useLayout } from "../../../LayoutContext";
import { useHelp } from "../../../hooks/useHelp";
import AppointmentCard from "../../../components/Citas/AppointmentCard";
import CalendarAgenda from "../../../components/Citas/CalendarAgenda";
import PrincipalText from "../../../components/Users/PrincipalText";
import Input from "../../../components/UI/Input";
import Filter from "../../../components/UI/Filter";
import ViewCitaModal from "../../../components/Modals/CitaModal/ViewCitaModal";
import AgendarCitaAdminModal from "../../../components/Modals/CitaModal/AgendarCitaAdminModal";
import ReagendarCitaModal from "../../../components/Modals/CitaModal/ReagendarCitaModal";
import useCitas from "../../../hooks/useCitas";
import Swal from "sweetalert2";



export default function AgendaCitas() {
    const { setTitle, setSubtitle } = useLayout();

    useHelp({
        title: "Agenda General de Citas",
        description: "Esta es tu herramienta principal para gestionar todas las citas consultadas de clínicas de forma global. Utiliza el calendario lateral para navegar entre días y ver todas las interacciones.",
        sections: [
            {
                title: "Funcionalidades Clave",
                type: "list",
                items: [
                    "Calendario interactivo: Selecciona cualquier día del mes para ver sus citas correspondientes. En pantallas pequeñas el calendario puede desplegarse usando el botón lateral izquierdo.",
                    "Filtros avanzados: Filtra por Especialidad, por rango de Horas y busca directamente por nombre de paciente o médico usando la barra de búsqueda.",
                    "Agendar Cita: Permite crear una nueva reserva para un paciente."
                ]
            },
            {
                title: "Estados de Cita",
                type: "tip",
                content: "Presta atención a las tarjetas de cita: el estado indica si la cita está Pendiente, ya fue Atendida o si el paciente la ha Cancelado."
            }
        ]
    });

    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [citas, setCitas] = useState([]);
    const [loading, setLoading] = useState(false);

    // Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAgendarModalOpen, setIsAgendarModalOpen] = useState(false);
    const [selectedCita, setSelectedCita] = useState(null);
    const [reagendandoCita, setReagendandoCita] = useState(null);

    const { cancelCita, reagendarCita } = useCitas({ enabled: false });

    // Filtros
    const [search, setSearch] = useState("");
    const [specialty, setSpecialty] = useState("");
    const [startTime, setStartTime] = useState("");
    const [specialtyOptions, setSpecialtyOptions] = useState([]);

    const [isCalendarOpen, setIsCalendarOpen] = useState(true);

    useEffect(() => {
        setTitle("Agenda de Citas");
        setSubtitle("Administra el calendario de citas.");

        const fetchEspecialidades = async () => {
            try {
                const res = await api.get('/especialidades');
                setSpecialtyOptions(res || []);
            } catch (error) {
                console.error("Error al cargar especialidades", error);
            }
        };
        fetchEspecialidades();

        const checkClose = () => {
            if (window.innerWidth <= 1100) {
                setIsCalendarOpen(false);
            }
        };

        checkClose();
        window.addEventListener("resize", checkClose);
        return () => window.removeEventListener("resize", checkClose);
    }, [setTitle, setSubtitle]);
    const fetchCitas = async () => {
        try {
            setLoading(true);
            const res = await api.get("/citas", {
                params: {
                    fecha: selectedDate,
                    per_page: 100
                }
            });

            let filteredCitas = res || [];

            if (search) {
                const searchLower = search.toLowerCase();
                filteredCitas = filteredCitas.filter(cita => {
                    const patientName = `${cita.paciente?.primer_nombre || ''} ${cita.paciente?.primer_apellido || ''}`.toLowerCase();
                    const docNumber = cita.paciente?.documento || "";
                    const doctorName = `${cita.medico?.primer_nombre || ''} ${cita.medico?.primer_apellido || ''}`.toLowerCase();
                    return patientName.includes(searchLower) || docNumber.includes(searchLower) || doctorName.includes(searchLower);
                });
            }

            // Filter by status: only Agendada and Atendida (per user request)
            filteredCitas = filteredCitas.filter(cita => {
                const statusName = cita.estado?.nombre_estado;
                return statusName === "Agendada" || statusName === "Atendida";
            });

            if (specialty) {
                // Since specialty is now id_especialidad (value) from backend
                filteredCitas = filteredCitas.filter(cita => String(cita.medico?.id_especialidad) === String(specialty));
            }

            if (startTime) {
                filteredCitas = filteredCitas.filter(cita => {
                    if (!cita.hora_inicio) return false;
                    return cita.hora_inicio.startsWith(startTime);
                });
            }

            // Ordenar por hora_inicio
            filteredCitas.sort((a, b) => {
                const horaA = a.hora_inicio || '23:59:59';
                const horaB = b.hora_inicio || '23:59:59';
                return horaA.localeCompare(horaB);
            });

            setCitas(filteredCitas);
        } catch (error) {
            console.error("Error cargando citas:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCitas();
    }, [selectedDate, search, specialty, startTime]);

    const totalCitas = citas.length;

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-130px)] -mx-8 -my-8 overflow-hidden bg-gray-50/50 dark:bg-gray-900/10 relative">

            {/* Left Column: Citas del Día Seleccionado */}
            <div className={`flex-1 flex flex-col w-full overflow-y-auto px-8 py-8 transition-all duration-500 ${loading ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>

                {/* Header (Título y botón Agendar arriba) */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <PrincipalText
                        icon="event_available"
                        text={`Citas del ${selectedDate}`}
                        number={totalCitas}
                    />
                    <button 
                        onClick={() => setIsAgendarModalOpen(true)}
                        className="bg-primary hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors w-full md:w-auto"
                    >
                        <span className="material-symbols-outlined text-xl">add_circle</span>
                        Agendar Cita
                    </button>
                </div>

                {/* Recuadro de Filtros Abajo del Título/Botón */}
                <div className="mb-8 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-4 w-full">

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">

                        {/* Buscador */}
                        <div className="sm:col-span-1 lg:col-span-5 w-full">
                            <Input
                                placeholder="Buscar paciente o médico"
                                icon="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        {/* Especialidad */}
                        <div className="sm:col-span-1 lg:col-span-3 w-full">
                            <Filter
                                value={specialty}
                                onChange={setSpecialty}
                                options={specialtyOptions}
                                placeholder="Todas las Especialidades"
                            />
                        </div>

                        {/* Hora Inicio */}
                        <div className="sm:col-span-1 lg:col-span-4 w-full">
                            <Input
                                type="time"
                                placeholder="Hora Inicio"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                            />
                        </div>

                    </div>
                </div>

                {/* Listado de Citas */}
                {citas.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 mt-4 w-full">
                        <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">event_busy</span>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Día sin programar</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-1 text-center">No se encontraron citas agendadas para esta fecha.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-8">
                        {citas.map(cita => (
                            <AppointmentCard
                                key={cita.id_cita}
                                patientName={`${cita.paciente.primer_nombre} ${cita.paciente.primer_apellido}`}
                                patientDoc={cita.paciente.documento}
                                doctorName={`Dr. ${cita.medico.primer_nombre} ${cita.medico.primer_apellido}`}
                                doctorSpecialty={cita.medico?.especialidad?.especialidad || "Médico General"}
                                specialty={cita.tipoCita?.nombre || ""}
                                tipoServicio={cita.tipo_evento === 'remision' ? 'Remisión' : 'Cita Médica'}
                                time={cita.hora_inicio ? `${cita.fecha || ''} | ${cita.hora_inicio.slice(0, 5)}` : "Por definir"}
                                status={cita.estado?.nombre_estado || "Pendiente"}
                                onView={() => {
                                    setSelectedCita(cita);
                                    setIsModalOpen(true);
                                }}
                                onCancel={(cita.estado?.nombre_estado === "Agendada" || cita.estado?.nombre_estado === "Pendiente") ? async () => {
                                    const success = await cancelCita(cita.id_cita);
                                    if (success) fetchCitas();
                                } : undefined}
                                onReschedule={(cita.estado?.nombre_estado === "Agendada" || cita.estado?.nombre_estado === "Pendiente") ? () => {
                                    if (cita.fecha && cita.hora_inicio) {
                                        const citaDate = new Date(`${cita.fecha}T${cita.hora_inicio}`);
                                        const now = new Date();
                                        const diffHours = (citaDate - now) / (1000 * 60 * 60);
                                        if (diffHours < 24) {
                                            Swal.fire({
                                                icon: 'warning',
                                                title: 'Atención',
                                                text: 'No puedes reagendar una cita con menos de un día de anticipación.',
                                            });
                                            return;
                                        }
                                    }
                                    setReagendandoCita(cita);
                                } : undefined}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modal de Detalle */}
            <ViewCitaModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedCita(null);
                }}
                cita={selectedCita}
            />

            {/* Modal de Agendar */}
            {isAgendarModalOpen && (
                <AgendarCitaAdminModal
                    isOpen={isAgendarModalOpen}
                    onClose={() => setIsAgendarModalOpen(false)}
                    onSuccess={() => {
                        fetchCitas();
                        setIsAgendarModalOpen(false);
                    }}
                />
            )}

            {/* Modal de Reagendar */}
            {reagendandoCita && (
                <ReagendarCitaModal
                    isOpen={!!reagendandoCita}
                    onClose={() => setReagendandoCita(null)}
                    cita={reagendandoCita}
                    onConfirm={async (id, data) => {
                        const success = await reagendarCita(id, data);
                        if (success) {
                            fetchCitas();
                            setReagendandoCita(null);
                        }
                    }}
                />
            )}

            {/* Overlay Mobile */}
            {isCalendarOpen && (
                <div
                    className="absolute inset-0 bg-gray-900/20 dark:bg-black/40 z-20 xl:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsCalendarOpen(false)}
                />
            )}

            {/* Right Column: Calendario Drawer */}
            <div className={`
                absolute xl:relative right-0 top-0 h-full z-30 transition-all duration-300 ease-in-out shrink-0 flex
                ${isCalendarOpen ? 'translate-x-0 w-full sm:w-[320px] xl:w-[320px]' : 'translate-x-full w-full sm:w-[320px] xl:translate-x-0 xl:w-0'}
            `}>

                {/* External Tab (Only visible when closed) */}
                <button
                    onClick={() => setIsCalendarOpen(true)}
                    className={`absolute z-40 top-1/2 -translate-y-1/2 -left-[46px] w-[46px] h-16 bg-white dark:bg-gray-900 border border-t-gray-200 border-b-gray-200 border-l-gray-200 dark:border-t-gray-800 dark:border-b-gray-800 dark:border-l-gray-800 border-r-0 rounded-l-xl shadow-[-4px_4px_6px_-1px_rgba(0,0,0,0.05)] cursor-pointer flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 text-primary
                        ${isCalendarOpen ? 'opacity-0 pointer-events-none translate-x-4' : 'opacity-100 translate-x-0 delay-100'}
                    `}
                    title="Mostrar calendario"
                >
                    <span className="material-symbols-outlined ml-1 text-2xl">calendar_month</span>
                </button>

                {/* Inner Content Container */}
                <div className="w-full h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden shadow-2xl xl:shadow-none relative">
                    <div className="w-full sm:w-[320px] shrink-0 p-6 h-full overflow-y-auto">
                        <CalendarAgenda
                            selectedDate={selectedDate}
                            onDateSelect={(date) => {
                                setSelectedDate(date);
                                if (window.innerWidth <= 1100) setIsCalendarOpen(false);
                            }}
                            onClose={() => setIsCalendarOpen(false)}
                        />
                    </div>
                </div>
            </div>

        </div>
    );
}
