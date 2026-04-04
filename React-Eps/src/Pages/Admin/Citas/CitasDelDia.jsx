import { useEffect, useState } from 'react';
import api from "../../../Api/axios";
import { useLayout } from "../../../LayoutContext";
import { useHelp } from "../../../hooks/useHelp";
import AppointmentCard from "../../../components/Citas/AppointmentCard";
import PrincipalText from "../../../components/Users/PrincipalText";
import ViewCitaModal from "../../../components/Modals/CitaModal/ViewCitaModal";
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import EventBusyRoundedIcon from '@mui/icons-material/EventBusyRounded';

export default function CitasDelDia() {
    const { setTitle, setSubtitle } = useLayout();
    
    useHelp({
        title: "Citas del Día",
        description: "Esta vista te ofrece un resumen rápido y enfocado exclusivamente en las citas programadas para el día de hoy.",
        sections: [
            {
                title: "Utilidad",
                type: "list",
                items: [
                    "A diferencia de la Agenda General, aquí no necesitas buscar la fecha actual: el sistema filtra todas las interacciones de hoy automáticamente.",
                    "Ideal para que el personal de recepción o los médicos tengan un pantallazo de cómo estará su jornada de trabajo, sin distracciones de citas futuras o pasadas."
                ]
            }
        ]
    });

    const [citas, setCitas] = useState([]);
    const [loading, setLoading] = useState(false);

    // Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCita, setSelectedCita] = useState(null);

    useEffect(() => {
        setTitle("Citas del Día");
        setSubtitle("Visualiza las citas agendadas para hoy.");
    }, [setTitle, setSubtitle]);

    const fetchCitasDelDia = async () => {
        try {
            setLoading(true);
            const todayStr = new Date().toISOString().split('T')[0];
            const res = await api.get("/citas", {
                params: {
                    fecha: todayStr,
                    per_page: 100
                }
            });

            setCitas(res || []);
        } catch (error) {
            console.error("Error cargando citas del día:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCitasDelDia();
    }, []);

    const totalCitas = citas.length;

    return (
        <div className="w-full bg-white dark:bg-gray-900 rounded-xl p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <PrincipalText
                    icon="today"
                    text={`Hoy, ${new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`}
                    number={totalCitas}
                />
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <AutorenewRoundedIcon sx={{ fontSize: '2.5rem' }} className="animate-spin text-primary" />
                </div>
            ) : citas.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                    <EventBusyRoundedIcon sx={{ fontSize: '3.75rem' }} className="text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">No hay citas para hoy</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 text-center">Tómate un descanso o revisa la agenda general.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {citas.map(cita => (
                        <AppointmentCard
                            key={cita.id_cita}
                            patientName={`${cita.paciente?.primer_nombre || ''} ${cita.paciente?.primer_apellido || ''}`.trim() || 'No asignado'}
                            patientDoc={cita.paciente?.documento}
                            doctorName={`Dr. ${cita.medico?.primer_nombre || ''} ${cita.medico?.primer_apellido || ''}`.trim() || 'General'}
                            doctorSpecialty={cita.medico?.especialidad?.especialidad || "Médico General"}
                            specialty={cita.tipoCita?.nombre || ""}
                            tipoServicio={cita.motivoConsulta?.motivo || "Cita Regular"}
                            time={cita.hora_inicio ? cita.hora_inicio.slice(0, 5) : "Por definir"}
                            status={cita.estado?.nombre_estado || "Pendiente"}
                            onView={() => {
                                setSelectedCita(cita);
                                setIsModalOpen(true);
                            }}
                            onCancel={() => console.log('cancel', cita.id_cita)}
                        />
                    ))}
                </div>
            )}

            <ViewCitaModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedCita(null);
                }}
                cita={selectedCita}
            />
        </div>
    );
}
