import { useState, useEffect } from "react";
import api from "@/Api/axios";
import { useLayout } from "@/LayoutContext";
import DataTable from "@/components/UI/DataTable";
import PrincipalText from "@/components/Users/PrincipalText";
import BlueButton from "@/components/UI/BlueButton";
import Input from "@/components/UI/Input";
import Filter from "@/components/UI/Filter";
import TableSkeleton from "@/components/UI/TableSkeleton";
import DepartamentoModal from "@/components/Modals/DepartamentoModal";
import Swal from "sweetalert2";
import { AnimatePresence, motion } from "framer-motion";

import useDepartamentos from "@/hooks/useDepartamentos";

const statusOptions = [
    { value: "", label: "Todos" },
    { value: 1, label: "Activos" },
    { value: 2, label: "Inactivos" },
];

export default function Departamentos() {
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
        fetchData: fetchDepartamentos
    } = useDepartamentos();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    useEffect(() => {
        setTitle("Departamentos");
        setSubtitle("Gestiona los departamentos registrados en el sistema.");
    }, []);

    const handleToggleStatus = async (item) => {
        if (item.id_estado === 1) {
            const result = await Swal.fire({
                title: "¿Desactivar departamento?",
                text: "Esta acción marcará el departamento como inactivo.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, desactivar",
                cancelButtonText: "Cancelar"
            });

            if (result.isConfirmed) {
                try {
                    await api.delete(`/departamentos/${item.codigo_DANE}`);
                    Swal.fire("Desactivado", "El departamento ha sido desactivado.", "success");
                    fetchDepartamentos();
                } catch (error) {
                    Swal.fire("Error", "No se pudo desactivar el departamento.", "error");
                }
            }
        } else {
            Swal.fire("Info", "La reactivación debe ser gestionada por soporte técnico.", "info");
        }
    };

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
            key: "codigo_DANE",
            header: "Código DANE",
            render: (item) => <span className="text-xs text-gray-500 font-mono">{item.codigo_DANE}</span>
        },
        {
            key: "nombre",
            header: "Nombre",
            render: (item) => <span className="font-semibold">{item.nombre}</span>
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
                        onClick={() => handleEdit(item)}
                        className="cursor-pointer p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                        title="Editar"
                    >
                        <span className="material-symbols-outlined text-base">edit</span>
                    </button>
                    <button
                        onClick={() => handleToggleStatus(item)}
                        className="cursor-pointer p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                        title={item.id_estado === 1 ? "Desactivar" : "Activar"}
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
                <PrincipalText icon="map" text="Gestión de Departamentos" number={total} />
                <BlueButton text="Nuevo Departamento" icon="add" onClick={handleCreate} />
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
                        <TableSkeleton rows={5} columns={4} />
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
                                    disabled={page === 1}
                                    onClick={() => setPage(prev => prev - 1)}
                                    className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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
                    <DepartamentoModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSuccess={fetchDepartamentos}
                        editData={editData}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
