import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLayout } from "../../LayoutContext";
import { useHelp } from "../../hooks/useHelp";
import api from "../../Api/axios";
import { ROLES } from "../../constants/roles";
import DataTable from "../../components/UI/DataTable";
import TableSkeleton from "../../components/UI/TableSkeleton";
import PrincipalText from "../../components/Users/PrincipalText";
import { motion } from "framer-motion";
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import PersonSearchRoundedIcon from '@mui/icons-material/PersonSearchRounded';

export default function MisPacientes() {
    const navigate = useNavigate();
    const { setTitle, setSubtitle } = useLayout();
    const [pacientes, setPacientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useHelp({
        title: "Gestión de Mis Pacientes",
        description: "En este panel puedes ver a todos los pacientes que han sido registrados o atendidos por ti en la EPS.",
        sections: [
            {
                title: "¿Cómo buscar un paciente?",
                type: "list",
                items: [
                    "Ingresa el nombre o número de documento en el buscador superior.",
                    "La tabla se filtrará automáticamente en tiempo real."
                ]
            },
            {
                title: "Acciones disponibles",
                type: "text",
                content: "Al hacer clic en el botón 'Historial' de un paciente, serás redirigido a su expediente clínico completo, donde podrás ver atenciones previas, antecedentes y resultados de exámenes."
            },
            {
                title: "Privacidad de Datos",
                type: "warning",
                content: "Recuerda que el acceso a la información del paciente debe realizarse únicamente con fines médicos y bajo los protocolos de confidencialidad de la EPS."
            }
        ]
    });

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
            render: (p) => {
                if (!p.fecha_nacimiento) return "N/A";
                const dateStr = p.fecha_nacimiento.substring(0, 10);
                const [year, month, day] = dateStr.split('-');
                const birthDate = new Date(year, month - 1, day);
                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
                return `${dateStr} (${age} años)`;
            }
        },
        {
            key: "genero",
            header: "GÉNERO",
            render: (p) => p.sexo || "No especificado"
        },
        {
            key: "actions",
            header: "ACCIONES",
            align: "center",
            render: (p) => (
                <button
                    className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors flex items-center gap-1 font-bold text-xs cursor-pointer"
                    onClick={() => navigate(`/medico/pacientes/${p.documento}/historial`)}
                >
                    <HistoryRoundedIcon sx={{ fontSize: '1rem' }} />
                    Historial
                </button>
            )
        }
    ];

    const filteredPacientes = pacientes.filter(p => {
        const search = searchTerm.toLowerCase();
        const doc = String(p.documento || "").toLowerCase();
        const name = `${p.primer_nombre || ""} ${p.primer_apellido || ""}`.toLowerCase();
        return doc.includes(search) || name.includes(search);
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-neutral-gray-border/10 dark:border-gray-800">
                <div className="mb-8">
                    <PrincipalText
                        icon={<GroupsRoundedIcon sx={{ fontSize: '2.5rem' }} />}
                        text="Pacientes Registrados"
                        number={pacientes.length}
                    />
                </div>

                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Buscar por documento o nombre..."
                        className="w-full sm:w-80 px-4 py-2 rounded-xl border dark:text-white border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {loading ? (
                    <TableSkeleton rows={5} columns={5} />
                ) : filteredPacientes.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/20 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                        <PersonSearchRoundedIcon sx={{ fontSize: '3.75rem' }} className="text-gray-300 dark:text-gray-600 mb-4 block mx-auto" />
                        <p className="text-gray-500 dark:text-gray-400 font-medium">
                            No hay pacientes registrados en el sistema.
                        </p>
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={filteredPacientes}
                    />
                )}
            </div>
        </motion.div>
    );
}
