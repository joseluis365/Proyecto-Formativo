import { useState, useEffect } from "react";
import api from "@/Api/axios";
import dayjs from "dayjs";
import "dayjs/locale/es";
import TableSkeleton from "@/components/UI/TableSkeleton";
import HistorialModal from "./HistorialModal";
import Swal from "sweetalert2";

export default function HistorialReportesTab() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    
    const [selectedReport, setSelectedReport] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchHistorial = async (pageNumber = 1) => {
        setLoading(true);
        try {
            const res = await api.get(`/reportes/historial?page=${pageNumber}`);
            setData(res?.data?.data || []);
            setLastPage(res?.data?.last_page || 1);
            setPage(res?.data?.current_page || 1);
        } catch (error) {
            console.error("Error fetching report history:", error);
            Swal.fire("Error", "No se pudo cargar el historial de reportes.", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistorial(page);
    }, [page]);

    const handleViewDetails = (report) => {
        setSelectedReport(report);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-4">
            {loading ? (
                <TableSkeleton rows={5} columns={1} />
            ) : data.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                    <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-700 mb-4 block">history</span>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Aún no hay reportes generados en el sistema.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {data.map((item) => (
                        <div 
                            key={item.id} 
                            onClick={() => handleViewDetails(item)}
                            className="bg-white dark:bg-gray-800 border border-neutral-gray-border/20 dark:border-gray-700 rounded-xl p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all cursor-pointer shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                                    <span className="material-symbols-outlined text-2xl">description</span>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                                        Reporte de {item.tabla_relacion}
                                    </h4>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="material-symbols-outlined text-sm">person</span>
                                        <span>
                                            {item.usuario ? `${item.usuario.primer_nombre} ${item.usuario.primer_apellido}` : "Usuario Desconocido"} 
                                            {item.usuario?.rol ? ` (${item.usuario.rol.tipo_usu})` : ""}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex flex-col sm:items-end w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-none border-gray-100 dark:border-gray-700">
                                <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                                    {item.num_registros} registros
                                </span>
                                <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1 mt-1">
                                    <span className="material-symbols-outlined text-[14px]">calendar_month</span>
                                    {dayjs(item.created_at).locale("es").format("D [de] MMMM [de] YYYY, h:mm a")}
                                </span>
                            </div>
                        </div>
                    ))}
                    
                    {/* Paginación */}
                    {lastPage > 1 && (
                        <div className="flex justify-center items-center gap-2 mt-6">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                                className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                            >
                                <span className="material-symbols-outlined align-middle">chevron_left</span>
                            </button>
                            <div className="flex gap-1">
                                {Array.from({ length: lastPage }, (_, i) => i + 1).map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setPage(p)}
                                        className={`w-10 h-10 rounded-lg transition-all text-sm font-bold ${
                                            page === p
                                                ? "bg-primary text-white shadow-md shadow-primary/20"
                                                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                                        }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                            <button
                                disabled={page === lastPage}
                                onClick={() => setPage((prev) => Math.min(lastPage, prev + 1))}
                                className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                            >
                                <span className="material-symbols-outlined align-middle">chevron_right</span>
                            </button>
                        </div>
                    )}
                </div>
            )}
            
            <HistorialModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                report={selectedReport} 
            />
        </div>
    );
}
