import { useState, useEffect } from "react";
import api from "@/Api/axios";
import { useLayout } from "@/LayoutContext";
import { useHelp } from "@/hooks/useHelp";
import DataTable from "@/components/UI/DataTable";
import PrincipalText from "@/components/Users/PrincipalText";
import BlueButton from "@/components/UI/BlueButton";
import Input from "@/components/UI/Input";
import TableSkeleton from "@/components/UI/TableSkeleton";
import PresentacionModal from "@/components/Modals/PresentacionModal";
import Swal from "sweetalert2";
import { AnimatePresence, motion } from "framer-motion";
import useTableData from "@/hooks/useTableData";

export default function Presentaciones() {
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
        fetchData
    } = useTableData("/configuracion/presentaciones");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    useEffect(() => {
        setTitle("Presentaciones (Inventario)");
        setSubtitle("Gestiona las presentaciones específicas de los medicamentos.");
    }, []);

    useHelp({
        title: "Presentaciones de Medicamentos",
        description: "Enlaza un Medicamento base con una Concentración y una Forma Farmacéutica, definiendo el ítem final que se dispensa.",
        sections: [
            {
                title: "Opciones de Gestión",
                type: "list",
                items: [
                    "Crear: Genera una nueva combinación para un medicamento existente.",
                    "Busqueda: Busca directamente por el nombre del medicamento base."
                ]
            },
            {
                title: "Recomendación para Inventarios",
                type: "tip",
                content: "Asegúrate de que la presentación que vayas a eliminar no tenga existencias activas en las farmacias para evitar errores de integridad."
            }
        ]
    });

    const handleDelete = async (item) => {
        const result = await Swal.fire({
            title: "¿Eliminar presentación?",
            text: "Esta acción borrará la presentación, verifique que no cuente con existencias en farmacia.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        });

        if (result.isConfirmed) {
            try {
                await api.delete(`/configuracion/presentaciones/${item.id_presentacion}`);
                Swal.fire("Eliminado", "La presentación ha sido borrada.", "success");
                fetchData();
            } catch (error) {
                Swal.fire("Error", "No se pudo eliminar, posiblemente por restricciones de inventario.", "error");
            }
        }
    };

    const columns = [
        {
            key: "id_presentacion",
            header: "ID",
            render: (item) => <span className="text-gray-500 font-mono text-xs">{item.id_presentacion}</span>
        },
        {
            key: "medicamento",
            header: "Medicamento",
            render: (item) => <span className="font-semibold">{item.medicamento?.nombre || "N/A"}</span>
        },
        {
            key: "concentracion",
            header: "Concentración",
            render: (item) => <span className="text-gray-600 dark:text-gray-300">{item.concentracion?.concentracion || "N/A"}</span>
        },
        {
            key: "forma",
            header: "F. Farmacéutica",
            render: (item) => <span className="text-gray-600 dark:text-gray-300">{item.forma_farmaceutica?.forma_farmaceutica || "N/A"}</span>
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
                        onClick={() => handleDelete(item)}
                        className="cursor-pointer p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                        title="Eliminar"
                    >
                        <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                <PrincipalText icon="inventory_2" text="Gestión de Presentaciones" number={total} />
                <div className="w-sl">
                    <BlueButton text="Nueva Presentación" icon="add" onClick={() => { setEditData(null); setIsModalOpen(true); }} />
                </div>
            </div>

            <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
                <div className="w-full md:w-64">
                    <Input
                        placeholder="Buscar por medicamento..."
                        icon="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
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
                    <PresentacionModal
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
