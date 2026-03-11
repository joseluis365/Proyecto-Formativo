import { useEffect } from 'react';
import { useLayout } from "../../../LayoutContext";
import AppointmentCard from "../../../components/Citas/AppointmentCard";
import PrincipalText from "../../../components/Users/PrincipalText";
import TableSkeleton from "../../../components/UI/TableSkeleton";
import useCitas from "../../../hooks/useCitas";

export default function CitasDelDia() {
    const { setTitle, setSubtitle } = useLayout();

    // Fecha de hoy en formato YYYY-MM-DD para el filtro de servidor
    const todayStr = new Date().toISOString().split('T')[0];

    // ✅ Usa el hook universal con filtro de fecha — sin api.get directo
    const { citas, loading } = useCitas({ fecha: todayStr });

    useEffect(() => {
        setTitle("Citas del Día");
        setSubtitle("Visualiza las citas agendadas para hoy.");
    }, [setTitle, setSubtitle]);

    return (
        <div className="w-full bg-white dark:bg-gray-900 rounded-xl p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <PrincipalText
                    icon="today"
                    text={`Hoy, ${new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`}
                    number={citas.length}
                />
            </div>

            {loading ? (
                <TableSkeleton rows={4} columns={5} />
            ) : citas.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                    <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">event_busy</span>
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
                            specialty={cita.tipoCita?.tipo || "General"}
                            time={cita.hora_inicio ? cita.hora_inicio.slice(0, 5) : "Por definir"}
                            status={cita.estado?.nombre_estado || "Pendiente"}
                            onView={() => console.log('view', cita.id_cita)}
                            onCancel={() => console.log('cancel', cita.id_cita)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
