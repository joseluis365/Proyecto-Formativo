import { useEffect } from "react";
import { useLayout } from "../../LayoutContext";
import DoctorInfo from "../../components/DoctorSchedule/DoctorInfo";
import SearchBar from "../../components/DoctorSchedule/SearchBar";
import ScheduleTable from "../../components/DoctorSchedule/ScheduleTable";

const mockDates = [
    {
        time: "08:00",
        patient: "Juan Pérez",
        reason: "Consulta de seguimiento",
        status: "Atendida",
    },
    {
        time: "09:00",
        patient: "María López",
        reason: "Consulta de seguimiento",
        status: "Cancelada",
    },
    {
        time: "10:00",
        patient: "Pedro Rodríguez",
        reason: "Consulta de seguimiento",
        status: "Pendiente",
    },
];

export default function AgendaMedico() {
    const { setTitle, setSubtitle } = useLayout();
    useEffect(() => {
        setTitle("Agenda Medico");
        setSubtitle("Gestión de agenda de medicos");
    }, []);
    return (
        <div>
            <div className="mb-8">
                <DoctorInfo name="Carlos Ramirez" specialty="Cardiología" office="302" status="ACTIVO" />
            </div>
            <SearchBar />
            <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-primary-green">event_note</span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Agenda del día – Viernes, 27 de Octubre
                    2023</h3>
            </div>
            <ScheduleTable dates={mockDates} />
        </div>
    )
}
