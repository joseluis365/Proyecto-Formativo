import { useState, useEffect } from "react";
import { useLayout } from "@/LayoutContext";
import DataTable from "@/components/UI/DataTable";
import PrincipalText from "@/components/Users/PrincipalText";
import BlueButton from "@/components/UI/BlueButton";
import Input from "@/components/UI/Input";
import TableSkeleton from "@/components/UI/TableSkeleton";
import EstadoModal from "@/components/Modals/EstadoModal";
import { AnimatePresence, motion } from "framer-motion";

import useEstados from "@/hooks/useEstados";

export default function Estados() {
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
        fetchData: fetchEstados
    } = useEstados();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    useEffect(() => {
        setTitle("Estados");
        setSubtitle("Gestiona los estados disponibles en el sistema.");
    }, []);

    const handleEdit = (item) => {
        setEditData(item);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditData(null);
        setIsModalOpen(true);
    };

    const columns = [
        {
            key: "id_estado",
            header: "ID",
            render: (item) => <span className="text-xs text-gray-500 font-mono">{item.id_estado}</span>
        },
        {
            key: "nombre_estado",
            header: "Nombre del Estado",
            render: (item) => <span className="font-semibold">{item.nombre_estado}</span>
        },
        {
            key: "actions",
            header: "Acciones",
            align: "center",
            render: (item) => (
                <div className="flex items-center justify-center gap-2">
                    {item.id_estado >= 7 && (
                        <button
                            onClick={() => handleEdit(item)}
                            className="cursor-pointer p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            title="Editar"
                        >
                            <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                    )}
                    {item.id_estado < 7 && (
                        <span className="text-xs text-gray-400 italic">Sistema</span>
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                <PrincipalText icon="settings_accessibility" text="Gestión de Estados" number={total} />
                <BlueButton text="Nuevo Estado" icon="add" onClick={handleCreate} />
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
                        <div className="bg-white dark:bg-gray-800 border border-neutral-gray-border/20 dark:border-gray-700 shadow-sm overflow-x-auto rounded-lg">
                            <DataTable
                                columns={columns}
                                data={data}
                            />
                        </div>

                        {/* Paginación */}
                        {lastPage > 1 && (
                            <div className="flex justify-center gap-2 mt-6">
                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage(prev => prev - 1)}
                                    className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Anterior
                                </button>
                                <div className="flex gap-1 overflow-x-auto max-w-[200px] md:max-w-none">
                                    {Array.from({ length: lastPage }, (_, i) => i + 1).map(p => (
                                        <button
                                            key={p}
                                            onClick={() => setPage(p)}
                                            className={`px-4 py-2 rounded-lg transition-colors flex-shrink-0 ${page === p
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
                                    className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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
                    <EstadoModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSuccess={fetchEstados}
                        editData={editData}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
