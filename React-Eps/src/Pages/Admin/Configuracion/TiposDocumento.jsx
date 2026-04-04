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
import TipoDocumentoModal from "@/components/Modals/TipoDocumentoModal";
import Swal from "sweetalert2";
import { AnimatePresence, motion } from "framer-motion";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import LocationCityRoundedIcon from '@mui/icons-material/LocationCityRounded';

import useTiposDocumento from "@/hooks/useTiposDocumento";

const statusOptions = [
    { value: "", label: "Todos" },
    { value: 1, label: "Activos" },
    { value: 2, label: "Inactivos" },
];

export default function TiposDocumento() {
    const { setTitle, setSubtitle } = useLayout();

    useHelp({
        title: "Tipos de Documento",
        description: "Administra el catálogo de tipos de documento válidos en el sistema.",
        sections: [
            {
                title: "Opciones de la Tabla",
                type: "list",
                items: [
                    "Búsqueda: Filtra los tipos de documento por nombre.",
                    "Editar: Modifica el texto del tipo de documento usando el ícono del lápiz."
                ]
            }
        ]
    });

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
        fetchData: fetchTipos
    } = useTiposDocumento();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    useEffect(() => {
        setTitle("Tipos de Documento");
        setSubtitle("Gestiona los tipos de documento de identidad del sistema.");
    }, [setTitle, setSubtitle]);

    const handleEdit = (item) => {
        setEditData(item);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditData(null);
        setIsModalOpen(true);
    };

    const handleToggleStatus = async (item) => {
        if (item.id_estado === 1) {
            const result = await Swal.fire({
                title: "¿Inactivar tipo de documento?",
                text: "Esta acción marcará el registro como inactivo.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, inactivar",
                cancelButtonText: "Cancelar"
            });

            if (result.isConfirmed) {
                try {
                    await api.delete(`/tipos-documento/${item.id_tipo_documento}`);
                    Swal.fire("Inactivado", "El registro ha sido inactivado.", "success");
                    fetchTipos();
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
            key: "id_tipo_documento",
            header: "ID",
            render: (item) => <span className="text-xs text-gray-500 font-mono">{item.id_tipo_documento}</span>
        },
        {
            key: "tipo_documento",
            header: "Tipo de Documento",
            render: (item) => <span className="font-semibold">{item.tipo_documento}</span>
        },
        {
            key: "estado",
            header: "Estado",
            render: (item) => (
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${item.id_estado === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {item.id_estado === 1 ? 'Activo' : 'Inactivo'}
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
                        className="cursor-pointer p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        title="Editar"
                    >
                        <EditRoundedIcon sx={{ fontSize: "1rem" }} />
                    </button>
                    <button
                        onClick={() => handleToggleStatus(item)}
                        className="cursor-pointer p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        title={item.id_estado === 1 ? "Inactivar" : "Activar"}
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
                <PrincipalText icon="badge" text="Tipos de Documento" number={total} />
                <div className="w-sl">
                    <BlueButton text="Nuevo Tipo" icon="add" onClick={handleCreate} />
                </div>
            </div>

            <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
                <div className="w-full md:w-64">
                    <Input
                        placeholder="Buscar por tipo..."
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
                                    className="px-4 py-2 rounded-lg bg-white dark:text-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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
                                    className="px-4 py-2 rounded-lg bg-white dark:text-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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
                    <TipoDocumentoModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSuccess={fetchTipos}
                        editData={editData}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
