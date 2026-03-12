import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLayout } from "../../LayoutContext";
import api from "../../Api/axios";
import { ROLES } from "../../constants/roles";
import DataTable from "../../components/UI/DataTable";
import TableSkeleton from "../../components/UI/TableSkeleton";
import PrincipalText from "../../components/Users/PrincipalText";
import { motion } from "framer-motion";

export default function MisPacientes() {
    const navigate = useNavigate();
    const { setTitle, setSubtitle } = useLayout();
    const [pacientes, setPacientes] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPacientes = async () => {
        setLoading(true);
        try {
            const response = await api.get("/usuarios", {
                params: { id_rol: ROLES.PACIENTE, per_page: 500, status: 1 }
            });
            const data = response.data?.data || response.data || [];
            setPacientes(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error al cargar pacientes", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setTitle("Pacientes del Sistema");
        setSubtitle("Lista de todos los pacientes registrados en la EPS.");
        fetchPacientes();
    }, [setTitle, setSubtitle]);

    const columns = [
        {
            key: "documento",
            header: "DOCUMENTO",
            render: (p) => <span className="font-bold text-gray-900 dark:text-white">{p.documento}</span>
        },
        {
            key: "nombre",
            header: "PACIENTE",
            render: (p) => (
                <div className="flex flex-col">
                    <span className="font-bold text-gray-900 dark:text-white">
                        {p.primer_nombre} {p.primer_apellido}
                    </span>
                    <span className="text-xs text-gray-500">{p.email}</span>
                </div>
            )
        },
        {
            key: "fecha_nacimiento",
            header: "FECHA NACIMIENTO",
            render: (p) => p.fecha_nacimiento || "N/A"
        },
        {
            key: "genero",
            header: "GÉNERO",
            render: (p) => p.genero || "No especificado"
        },
        {
            key: "actions",
            header: "ACCIONES",
            align: "center",
            render: (p) => (
                <button
                    className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors flex items-center gap-1 font-bold text-xs cursor-pointer"
                    onClick={() => navigate(`/medico/pacientes/historial/${p.documento}`)}
                >
                    <span className="material-symbols-outlined text-base">history</span>
                    Historial
                </button>
            )
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-neutral-gray-border/10 dark:border-gray-800">
                <div className="mb-8">
                    <PrincipalText
                        icon="groups"
                        text="Pacientes Registrados"
                        number={pacientes.length}
                    />
                </div>

                {loading ? (
                    <TableSkeleton rows={5} columns={5} />
                ) : pacientes.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/20 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                        <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4 block">
                            person_search
                        </span>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">
                            No hay pacientes registrados en el sistema.
                        </p>
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={pacientes}
                        searchPlaceholder="Buscar por documento o nombre..."
                    />
                )}
            </div>
        </motion.div>
    );
}
