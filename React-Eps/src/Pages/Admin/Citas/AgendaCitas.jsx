import { useEffect, useState, useMemo } from 'react';
import { useLayout } from "../../../LayoutContext";
import AppointmentCard from "../../../components/Citas/AppointmentCard";
import CalendarAgenda from "../../../components/Citas/CalendarAgenda";
import PrincipalText from "../../../components/Users/PrincipalText";
import Input from "../../../components/UI/Input";
import Filter from "../../../components/UI/Filter";
import useCitas from "../../../hooks/useCitas";
import useMedicos from "../../../hooks/useMedicos";
import useEspecialidades from "../../../hooks/useEspecialidades";
import CreateCitaModal from "../../../components/Modals/CitaModal/CreateCitaModal";
import ViewCitaModal from "../../../components/Modals/CitaModal/ViewCitaModal";

export default function AgendaCitas() {
    const { setTitle, setSubtitle } = useLayout();
    const { specialties } = useEspecialidades();
    const { medicos, loading: loadingMedicos } = useMedicos();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewingCita, setViewingCita] = useState(null);
    const [expandedDoctorId, setExpandedDoctorId] = useState(null);
    const [preselectedSlot, setPreselectedSlot] = useState(null);

    // Uso del hook de citas
    const { citas: rawCitas, loading: loadingCitas, cancelCita, fetchCitas } = useCitas(selectedDate);

    // Filtros UI
    const [search, setSearch] = useState("");
    const [specialty, setSpecialty] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const [isCalendarOpen, setIsCalendarOpen] = useState(true);

    useEffect(() => {
        setTitle("Agenda de Citas");
        setSubtitle("Administra el calendario y agenda nuevas citas.");

        const checkClose = () => {
            if (window.innerWidth <= 1100) {
                setIsCalendarOpen(false);
            }
        };

        checkClose();
        window.addEventListener("resize", checkClose);
        return () => window.removeEventListener("resize", checkClose);
    }, [setTitle, setSubtitle]);

    // Filtrado de médicos
    const filteredMedicos = useMemo(() => {
        let result = [...medicos];

        if (search) {
            const s = search.toLowerCase();
            result = result.filter(m =>
                `${m.primer_nombre} ${m.primer_apellido}`.toLowerCase().includes(s) ||
                m.documento.toString().includes(s)
            );
        }

        if (specialty) {
            result = result.filter(m => m.id_especialidad === parseInt(specialty));
        }

        return result;
    }, [medicos, search, specialty]);

    const handleOpenModal = (doctor = null, time = null) => {
        setPreselectedSlot({ doctor, time });
        setIsModalOpen(true);
    };

    const toggleDoctor = (docId) => {
        setExpandedDoctorId(expandedDoctorId === docId ? null : docId);
    };

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-130px)] -mx-8 -my-8 overflow-hidden bg-gray-50/50 dark:bg-gray-900/10 relative">

            {/* Left Column: Agenda View */}
            <div className="flex-1 flex flex-col w-full overflow-y-auto px-8 py-8 transition-all duration-300">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <PrincipalText
                        icon="medical_services"
                        text={`Personal Médico (${filteredMedicos.length})`}
                        subtext={`Agenda del ${selectedDate}`}
                    />

                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-primary hover:bg-primary/90 text-white cursor-pointer rounded-lg px-6 py-3 font-bold text-sm transition-all flex items-center justify-center gap-2 group shadow-lg shadow-primary/20"
                    >
                        Agendar Cita
                        <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">add</span>
                    </button>
                </div>

                {/* Filtros */}
                <div className="mb-8 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-4 w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
                        <div className="sm:col-span-1 lg:col-span-5 w-full">
                            <Input
                                placeholder="Buscar médico por nombre o documento"
                                icon="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="sm:col-span-1 lg:col-span-3 w-full">
                            <Filter
                                value={specialty}
                                onChange={setSpecialty}
                                options={specialties}
                                placeholder="Todas las Especialidades"
                            />
                        </div>
                        <div className="sm:col-span-1 lg:col-span-2 w-full">
                            <Input
                                type="time"
                                placeholder="Filtro Hora Inicio"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                            />
                        </div>
                        <div className="sm:col-span-1 lg:col-span-2 w-full">
                            <Input
                                type="time"
                                placeholder="Filtro Hora Fin"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Lista de Médicos y Citas */}
                {(loadingMedicos || loadingCitas) ? (
                    <div className="flex justify-center p-12">
                        <span className="material-symbols-outlined animate-spin text-4xl text-primary">autorenew</span>
                    </div>
                ) : filteredMedicos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 mt-4 w-full text-center">
                        <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">search_off</span>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white uppercase tracking-tight">No se encontraron médicos</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Intente con otros criterios de búsqueda o especialidad.</p>
                    </div>
                ) : (
                    <div className="space-y-4 pb-8">
                        {filteredMedicos.map(medico => {
                            const isExpanded = expandedDoctorId === medico.documento;

                            // Filtrar citas del médico y aplicar filtros de hora
                            let doctorCitas = rawCitas.filter(c => c.doc_medico === medico.documento);

                            if (startTime || endTime) {
                                doctorCitas = doctorCitas.filter(cita => {
                                    if (!cita.hora_inicio) return false;
                                    const timeCita = cita.hora_inicio.slice(0, 5);
                                    if (startTime && endTime) return timeCita >= startTime && timeCita <= endTime;
                                    if (startTime) return timeCita >= startTime;
                                    if (endTime) return timeCita <= endTime;
                                    return true;
                                });
                            }

                            // Ordenar por hora
                            doctorCitas.sort((a, b) => (a.hora_inicio || '').localeCompare(b.hora_inicio || ''));

                            return (
                                <div key={medico.documento} className="flex flex-col bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden transition-all duration-300">
                                    {/* Doctor Card Header (Clickable) */}
                                    <div
                                        onClick={() => toggleDoctor(medico.documento)}
                                        className={`flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${isExpanded ? 'bg-primary/5 border-b border-gray-100 dark:border-gray-800 shadow-inner' : ''}`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
                                                <span className="material-symbols-outlined text-2xl font-bold">medical_services</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 leading-tight">
                                                    Dr. {medico.primer_nombre} {medico.primer_apellido}
                                                </h3>
                                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mt-0.5">
                                                    {medico.especialidad?.especialidad || 'Consulta General'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="hidden sm:flex flex-col items-end mr-2">
                                                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${doctorCitas.length > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                    {doctorCitas.length} {doctorCitas.length === 1 ? 'Cita' : 'Citas'}
                                                </span>
                                            </div>
                                            <span className={`material-symbols-outlined text-primary transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                                expand_more
                                            </span>
                                        </div>
                                    </div>

                                    {/* Expanded Citas Section */}
                                    <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                                        <div className="p-6 bg-gray-50/50 dark:bg-gray-800/20">
                                            {doctorCitas.length === 0 ? (
                                                <div className="flex flex-col items-center justify-center py-8 text-center bg-white/50 dark:bg-gray-900/50 rounded-lg border border-dashed border-gray-200 dark:border-gray-700">
                                                    <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">event_busy</span>
                                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Este médico no tiene citas hoy.</p>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                                    {doctorCitas.map(cita => (
                                                        <AppointmentCard
                                                            key={cita.id_cita}
                                                            patientName={`${cita.paciente?.primer_nombre || ''} ${cita.paciente?.primer_apellido || ''}`}
                                                            patientDoc={cita.paciente?.documento}
                                                            doctorName={`Dr. ${cita.medico?.primer_nombre || ''} ${cita.medico?.primer_apellido || ''}`}
                                                            specialty={cita.tipoCita?.tipo || "General"}
                                                            time={`${cita.hora_inicio?.slice(0, 5)} - ${cita.hora_fin?.slice(0, 5)}`}
                                                            status={cita.estado?.nombre_estado || "Pendiente"}
                                                            onView={() => setViewingCita(cita)}
                                                            onCancel={() => cancelCita(cita.id_cita)}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Modal de Creación */}
            <CreateCitaModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => fetchCitas()}
                preselectedData={preselectedSlot}
            />

            {/* Modal de Detalles */}
            <ViewCitaModal
                isOpen={!!viewingCita}
                onClose={() => setViewingCita(null)}
                cita={viewingCita}
            />

            {/* Right Column: Calendario Drawer */}
            <div className={`
                absolute xl:relative right-0 top-0 h-full z-30 transition-all duration-300 ease-in-out shrink-0 flex
                ${isCalendarOpen ? 'translate-x-0 w-full sm:w-[320px] xl:w-[320px]' : 'translate-x-full w-full sm:w-[320px] xl:translate-x-0 xl:w-0'}
            `}>
                <button
                    onClick={() => setIsCalendarOpen(true)}
                    className={`absolute z-40 top-1/2 -translate-y-1/2 -left-[46px] w-[46px] h-16 bg-white dark:bg-gray-900 border border-gray-200 rounded-l-xl shadow-[-4px_4px_6px_-1px_rgba(0,0,0,0.05)] cursor-pointer flex items-center justify-center hover:bg-gray-50 transition-all text-primary
                        ${isCalendarOpen ? 'opacity-0 pointer-events-none translate-x-4' : 'opacity-100 translate-x-0 delay-100'}
                    `}
                >
                    <span className="material-symbols-outlined ml-1 text-2xl">calendar_month</span>
                </button>

                <div className="w-full h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden relative">
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
