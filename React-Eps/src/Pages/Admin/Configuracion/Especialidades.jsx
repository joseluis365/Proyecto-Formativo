import { useState, useEffect } from "react";
import api from "@/Api/axios";
import { useLayout } from "@/LayoutContext";
import DataTable from "@/components/UI/DataTable";
import PrincipalText from "@/components/Users/PrincipalText";
import BlueButton from "@/components/UI/BlueButton";
import Input from "@/components/UI/Input";
import Filter from "@/components/UI/Filter";
import TableSkeleton from "@/components/UI/TableSkeleton";
import EspecialidadModal from "@/components/Modals/EspecialidadModal";
import Swal from "sweetalert2";
import { AnimatePresence, motion } from "framer-motion";

const statusOptions = [
    { value: "", label: "Todos" },
    { value: 1, label: "Activos" },
    { value: 2, label: "Inactivos" },
];

export default function Especialidades() {
    const { setTitle, setSubtitle } = useLayout();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    // Filtros y Paginación
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [status, setStatus] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        setTitle("Especialidades");
        setSubtitle("Gestiona las especialidades médicas del sistema.");
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        fetchData();
    }, [debouncedSearch, status, currentPage]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await api.get("/configuracion/especialidades", {
                params: {
                    search: debouncedSearch || undefined,
                    id_estado: status || undefined,
                    page: currentPage
                }
            });
            setData(response.data.data);
            setCurrentPage(response.data.meta.current_page);
            setLastPage(response.data.meta.last_page);
            setTotal(response.data.meta.total);
        } catch (error) {
            console.error("Error fetching especialidades:", error);
        } finally {
            setLoading(false);
            setIsInitialLoad(false);
        }
    };

    const handleToggleStatus = async (item) => {
        if (item.id_estado === 1) {
            const result = await Swal.fire({
                title: "¿Inactivar especialidad?",
                text: "Esta acción marcará el registro como inactivo.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, inactivar",
                cancelButtonText: "Cancelar"
            });

            if (result.isConfirmed) {
                try {
                    await api.delete(`/configuracion/especialidades/${item.id_especialidad}`);
                    Swal.fire("Inactivado", "El registro ha sido inactivado.", "success");
                    fetchData();
                } catch (error) {
                    Swal.fire("Error", "No se pudo inactivar el registro.", "error");
                }
            }
        } else {
            Swal.fire("Info", "La reactivación debe ser gestionada por soporte técnico.", "info");
        }
    };

    const columns = [
        {
            key: "especialidad",
            header: "Especialidad",
            render: (item) => <span className="font-semibold">{item.especialidad}</span>
        },
        {
            key: "id_estado",
            header: "Estado",
            render: (item) => (
                <span
                    className={`px-2.5 py-1 text-xs font-semibold rounded-full ${item.id_estado === 1
                        ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                        : "bg-red-100 text-red-800"
                        }`}
                >
                    {item.id_estado === 1 ? "Activo" : "Inactivo"}
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
                        <span className="material-symbols-outlined text-base">edit</span>
                    </button>
                    <button
                        onClick={() => handleToggleStatus(item)}
                        className="cursor-pointer p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                        title={item.id_estado === 1 ? "Inactivar" : "Activar"}
                    >
                        <span className="material-symbols-outlined text-base">
                            {item.id_estado === 1 ? "visibility_off" : "visibility"}
                        </span>
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                <PrincipalText icon="clinical_notes" text="Especialidades Médicas" number={total} />
                <BlueButton text="Nueva Especialidad" icon="add" onClick={() => { setEditData(null); setIsModalOpen(true); }} />
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
                        <TableSkeleton rows={5} columns={3} />
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
                            <DataTable
                                columns={columns}
                                data={data}
                            />
                        </div>

                        {/* Paginación */}
                        {lastPage > 1 && (
                            <div className="flex justify-center gap-2 mt-6">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                    className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Anterior
                                </button>
                                <div className="flex gap-1">
                                    {Array.from({ length: lastPage }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-4 py-2 rounded-lg transition-colors ${currentPage === page
                                                ? "bg-primary text-white font-bold"
                                                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    disabled={currentPage === lastPage}
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                    className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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
                    <EspecialidadModal
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
