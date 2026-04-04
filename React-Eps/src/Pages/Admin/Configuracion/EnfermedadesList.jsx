import { useState, useEffect } from "react";
import api from "@/Api/axios";
import { useLayout } from "@/LayoutContext";
import { useHelp } from "@/hooks/useHelp";
import DataTable from "@/components/UI/DataTable";
import PrincipalText from "@/components/Users/PrincipalText";
import BlueButton from "@/components/UI/BlueButton";
import Input from "@/components/UI/Input";
import TableSkeleton from "@/components/UI/TableSkeleton";
import EnfermedadModal from "@/components/Modals/EnfermedadModal";
import EnfermedadInfoModal from "@/components/Modals/EnfermedadInfoModal";
import { AnimatePresence, motion } from "framer-motion";
import useTableData from "@/hooks/useTableData";
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import LocationCityRoundedIcon from '@mui/icons-material/LocationCityRounded';

export default function EnfermedadesList() {
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
    } = useTableData("/enfermedades");

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        setTitle("Enfermedades CIE-11");
        setSubtitle("Gestión y consulta del catálogo internacional de enfermedades.");
    }, [setTitle, setSubtitle]);

    useHelp({
        title: "Catálogo de Enfermedades (CIE-11)",
        description: "Permite gestionar el listado oficial de diagnósticos utilizados en las consultas médicas.",
        sections: [
            {
                title: "Acciones Disponibles",
                type: "list",
                items: [
                    "Búsqueda: Localiza enfermedades por su código ICD o nombre.",
                    "Ver Info: Despliega la descripción clínica completa del diagnóstico.",
                    "Editar: Modifica el nombre o la descripción de un registro existente."
                ]
            }
        ]
    });

    const columns = [
        {
            key: "codigo_icd",
            header: "Código ICD",
            render: (item) => (
                <span className="text-gray-500 font-mono text-xs uppercase">
                    {item.codigo_icd}
                </span>
            )
        },
        {
            key: "nombre",
            header: "Enfermedad",
            render: (item) => (
                <span className="font-semibold text-gray-900 dark:text-white">
                    {item.nombre}
                </span>
            )
        },
        {
            key: "descripcion",
            header: "Descripción",
            render: (item) => (
                <div className="max-w-xs">
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 italic">
                        {item.descripcion || "Sin descripción"}
                    </p>
                </div>
            )
        },
        {
            key: "actions",
            header: "Acciones",
            align: "center",
            render: (item) => (
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={() => { setSelectedItem(item); setIsInfoOpen(true); }}
                        className="cursor-pointer p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                        title="Ver Info Completa"
                    >
                        <VisibilityRoundedIcon sx={{ fontSize: "1rem" }} />
                    </button>
                    <button
                        onClick={() => { setSelectedItem(item); setIsFormOpen(true); }}
                        className="cursor-pointer p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                        title="Editar"
                    >
                        <EditRoundedIcon sx={{ fontSize: "1rem" }} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                <PrincipalText icon="vaccines" text="Listado de Enfermedades" number={total} />
                <div className="w-sl">
                    <BlueButton 
                        text="Nueva Enfermedad" 
                        icon="add" 
                        onClick={() => { setSelectedItem(null); setIsFormOpen(true); }} 
                    />
                </div>
            </div>

            <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
                <div className="w-full md:w-64">
                    <Input
                        placeholder="Buscar enfermedad..."
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
                                <div className="flex gap-1 overflow-x-auto max-w-[200px] md:max-w-none no-scrollbar">
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
                {isFormOpen && (
                    <EnfermedadModal
                        isOpen={isFormOpen}
                        onClose={() => setIsFormOpen(false)}
                        onSuccess={fetchData}
                        editData={selectedItem}
                    />
                )}
                {isInfoOpen && (
                    <EnfermedadInfoModal
                        isOpen={isInfoOpen}
                        onClose={() => setIsInfoOpen(false)}
                        enfermedad={selectedItem}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
