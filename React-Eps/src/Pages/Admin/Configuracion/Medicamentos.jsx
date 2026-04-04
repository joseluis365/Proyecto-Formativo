import { useState, useEffect } from "react";
import api from "@/Api/axios";
import { useLayout } from "@/LayoutContext";
import { useHelp } from "@/hooks/useHelp";
import DataTable from "@/components/UI/DataTable";
import PrincipalText from "@/components/Users/PrincipalText";
import BlueButton from "@/components/UI/BlueButton";
import Input from "@/components/UI/Input";
import Filter from "@/components/UI/Filter";
import TableSkeleton from "@/components/UI/TableSkeleton";
import MedicamentoModal from "@/components/Modals/MedicamentoModal";
import Swal from "sweetalert2";
import { AnimatePresence, motion } from "framer-motion";
import useTableData from "@/hooks/useTableData";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import LocationCityRoundedIcon from '@mui/icons-material/LocationCityRounded';

const statusOptions = [
    { value: "", label: "Todos" },
    { value: 1, label: "Activos" },
    { value: 2, label: "Inactivos" },
];

export default function Medicamentos() {
    const { setTitle, setSubtitle } = useLayout();
    const {
        data,
        loading,
        isInitialLoad,
        page,
        setPage,
        lastPage,
        total,
        search,
        setSearch,
        status,
        setStatus,
        fetchData
    } = useTableData("/configuracion/medicamentos");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    useEffect(() => {
        setTitle("Medicamentos");
        setSubtitle("Catálogo base de medicamentos en el sistema.");
    }, []);

    useHelp({
        title: "Medicamentos (Catálogo Base)",
        description: "Administra el catálogo general de medicamentos. Sobre estos se configuran las diversas presentaciones dispensables.",
        sections: [
            {
                title: "Opciones de la Tabla",
                type: "list",
                items: [
                    "Búsqueda: Filtra el catálogo por el nombre del medicamento.",
                    "Filtro: Permite ver solo los medicamentos activos o inactivos.",
                    "Inactivar: Dar de baja un medicamento impide que se sigan creando nuevas presentaciones o recetando bajo este nombre general."
                ]
            },
            {
                title: "Recomendación de Uso",
                type: "tip",
                content: "Inactiva un medicamento solo si ya no es fabricado ni será recetado. Esto mantendrá la integridad en el histórico de recetas medicas."
            }
        ]
    });

    const handleToggleStatus = async (item) => {
        if (item.id_estado === 1) {
            const result = await Swal.fire({
                title: "¿Desactivar medicamento?",
                text: "Esta acción marcará el medicamento como inactivo para nuevas prescripciones.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, desactivar",
                cancelButtonText: "Cancelar"
            });

            if (result.isConfirmed) {
                try {
                    await api.delete(`/configuracion/medicamentos/${item.id_medicamento}`);
                    Swal.fire("Desactivado", "El Medicamento ha sido desactivado.", "success");
                    fetchData();
                } catch (error) {
                    Swal.fire("Error", "No se pudo desactivar.", "error");
                }
            }
        } else {
            Swal.fire("Info", "La reactivación debe ser gestionada modificándolo en edición o contactando a soporte.", "info");
        }
    };

    const columns = [
        {
            key: "id_medicamento",
            header: "ID",
            render: (item) => <span className="text-gray-500 font-mono text-xs">{item.id_medicamento}</span>
        },
        {
            key: "nombre",
            header: "Nombre",
            render: (item) => <span className="font-semibold">{item.nombre}</span>
        },
        {
            key: "categoria",
            header: "Categoría",
            render: (item) => <span className="text-sm font-medium text-primary">{item.categoria_medicamento?.categoria || "N/A"}</span>
        },
        {
            key: "id_estado",
            header: "Estado",
            render: (item) => (
                <span
                    className={`px-2.5 py-1 text-xs font-semibold rounded-full ${item.id_estado === 1
                        ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
                        }`}
                >
                    {item.estado?.nombre_estado || (item.id_estado === 1 ? "Activo" : "Inactivo")}
                </span>
            )
        },
        {
            key: "actions",
            header: "Acciones",
            align: "center",
            render: (item) => (
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={() => { setEditData(item); setIsModalOpen(true); }}
                        className="cursor-pointer p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                        title="Editar"
                    >
                        <EditRoundedIcon sx={{ fontSize: "1rem" }} />
                    </button>
                    <button
                        onClick={() => handleToggleStatus(item)}
                        className="cursor-pointer p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                        title={item.id_estado === 1 ? "Desactivar" : "Activar"}
                    >
                        {item.id_estado === 1 ? <VisibilityOffRoundedIcon sx={{ fontSize: '1rem' }} /> : <VisibilityRoundedIcon sx={{ fontSize: '1rem' }} />}
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                <PrincipalText icon="vaccines" text="Gestión de Medicamentos" number={total} />
                <div className="w-sl">
                    <BlueButton text="Nuevo Medicamento" icon="add" onClick={() => { setEditData(null); setIsModalOpen(true); }} />
                </div>
            </div>

            <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
                <div className="w-full md:w-64">
                    <Input
                        placeholder="Buscar por nombre..."
                        icon="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Filter
                    value={status}
                    onChange={setStatus}
                    options={statusOptions}
                    placeholder="Filtrar por estado"
                />
            </div>

            <AnimatePresence mode="wait">
                {loading && isInitialLoad && (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <TableSkeleton rows={5} columns={5} />
                    </motion.div>
                )}

                {!loading && data.length === 0 && (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-10"
                    >
                        <p className="text-gray-500 dark:text-gray-400">No se encontraron registros</p>
                    </motion.div>
                )}

                {data.length > 0 && (
                    <motion.div
                        key="data"
                        animate={{ opacity: loading ? 0.6 : 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="bg-white dark:bg-gray-800 border border-neutral-gray-border/20 dark:border-gray-700 shadow-sm overflow-x-auto">
                            <DataTable columns={columns} data={data} />
                        </div>

                        {lastPage > 1 && (
                            <div className="flex justify-center gap-2 mt-6">
                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage(prev => prev - 1)}
                                    className="p-2 rounded-lg bg-white dark:text-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Anterior
                                </button>
                                <div className="flex gap-1 overflow-x-auto max-w-[200px] md:max-w-none">
                                    {Array.from({ length: lastPage }, (_, i) => i + 1).map(p => (
                                        <button
                                            key={p}
                                            onClick={() => setPage(p)}
                                            className={`px-4 py-2 rounded-lg transition-colors shrink-0 ${page === p
                                                ? "bg-primary text-white font-bold"
                                                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    disabled={page === lastPage}
                                    onClick={() => setPage(prev => prev + 1)}
                                    className="p-2 rounded-lg bg-white dark:text-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Siguiente
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isModalOpen && (
                    <MedicamentoModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSuccess={fetchData}
                        editData={editData}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
