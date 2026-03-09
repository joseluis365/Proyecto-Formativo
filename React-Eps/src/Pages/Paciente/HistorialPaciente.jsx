import { useEffect, useMemo } from "react";
import { useLayout } from "../../LayoutContext";
import useCitas from "../../hooks/useCitas";
import DataTable from "../../components/UI/DataTable";
import PrincipalText from "../../components/Users/PrincipalText";
import TableSkeleton from "../../components/UI/TableSkeleton";
import { motion } from "framer-motion";

export default function HistorialPaciente() {
    const { setTitle, setSubtitle } = useLayout();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Obtenemos todas las citas históricas del paciente
    const { citas, loading } = useCitas();

    useEffect(() => {
        setTitle("Mi Historial Médico");
        setSubtitle("Consulta tus atenciones pasadas y diagnósticos recibidos.");
    }, [setTitle, setSubtitle]);

    // Filtramos solo las citas atendidas del paciente actual
    const historialAtendido = useMemo(() => {
        if (!citas) return [];
        return citas
            .filter(c => c.doc_paciente === user.documento && c.estado?.nombre_estado === "Atendida")
            .map(c => ({
                id: c.id_cita,
                fecha: c.fecha,
                medico: `Dr. ${c.medico?.primer_nombre} ${c.medico?.primer_apellido}`,
                especialidad: c.medico?.especialidad?.especialidad || "General",
                diagnostico: c.historial_detalle?.diagnostico || "Sin registro",
                tratamiento: c.historial_detalle?.tratamiento || "Sin registro",
            }));
    }, [citas, user.documento]);

    const columns = [
        { key: "fecha", header: "FECHA" },
        {
            key: "medico",
            header: "MÉDICO",
            render: (d) => (
                <div className="flex flex-col">
                    <span className="font-bold text-gray-900 dark:text-white">{d.medico}</span>
                    <span className="text-[10px] uppercase font-bold text-primary">{d.especialidad}</span>
                </div>
            )
        },
        { key: "diagnostico", header: "DIAGNÓSTICO" },
        { key: "tratamiento", header: "TRATAMIENTO" }
    ];

    return (
        <div className="space-y-8">
            <PrincipalText
                icon="history_edu"
                text="Resumen de Atenciones"
                subtext="Registro histórico de tus consultas finalizadas."
            />

            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-neutral-gray-border/10 overflow-hidden">
                {loading ? (
                    <TableSkeleton rows={5} columns={4} />
                ) : historialAtendido.length === 0 ? (
                    <div className="text-center py-20">
                        <span className="material-symbols-outlined text-6xl text-gray-200 dark:text-gray-700 mb-4 block">folder_open</span>
                        <p className="text-gray-400 dark:text-gray-500 font-medium">Aún no tienes registros de atenciones finalizadas.</p>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    >
                        <DataTable columns={columns} data={historialAtendido} />
                    </motion.div>
                )}
            </div>
        </div>
    );
}
