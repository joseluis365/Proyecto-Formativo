import { useLayout } from "../../LayoutContext";
import { useEffect, useState } from "react";
import { useHelp } from "../../hooks/useHelp";
import { Link } from "react-router-dom";
import api from "../../Api/axios";

export default function Dashboard() {
    const { setTitle, setSubtitle } = useLayout();

    useHelp({
        title: "Panel de Farmacia (Dashboard)",
        description: "Esta es tu pantalla principal. Aquí tienes un resumen del estado de tu inventario y las alertas más urgentes.",
        sections: [
            {
                title: "Alertas Superiores",
                type: "list",
                items: [
                    "Lotes vencidos: Crítico. Son medicamentos que ya pasaron su fecha de caducidad. Debes sacarlos del stock a través de una Salida Manual.",
                    "Próximos a vencer: Medicamentos que caducarán en los próximos 30 días. Suelta este stock primero (metodología FEFO).",
                    "Stock bajo: Medicamentos que están por agotarse y necesitas reabastecer (registro de Entradas)."
                ]
            },
            {
                title: "Acciones Rápidas",
                type: "steps",
                items: [
                    "Entrada: Ir directo a registrar un nuevo medicamento recibido.",
                    "Atender Orden: Dispersar medicamentos basados en una orden o receta médica.",
                    "Inventario: Ver el catálogo físico de lo que hay y lo que falta.",
                    "Historial: Revisar el registro de entradas y salidas pasadas."
                ]
            }
        ]
    });

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTitle("Panel de Farmacia");
        setSubtitle("Resumen del estado del inventario y alertas importantes.");
    }, [setTitle, setSubtitle]);

    useEffect(() => {
        api.get("/farmacia/dashboard/stats")
            .then((data) => setStats(data))
            .catch(() => setStats(null))
            .finally(() => setLoading(false));
    }, []);

    const diasLabel = (dias) => {
        if (dias === null || dias === undefined) return "";
        if (dias < 0) return `Vencido hace ${Math.abs(dias)} días`;
        if (dias === 0) return "Vence hoy";
        return `${dias} día${dias !== 1 ? "s" : ""}`;
    };

    return (
        <div className="flex flex-col gap-8 animate-fade-in">
            {/* Top Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Vencidos */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-red-100 dark:border-red-900/40 relative">
                    <div className="absolute top-0 left-0 w-8 h-8 rounded-tl-2xl border-t-4 border-l-4 border-red-500" />
                    <div className="flex justify-between items-start mb-4">
                        <div className="size-12 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center text-red-500">
                            <span className="material-symbols-outlined">cancel</span>
                        </div>
                        <span className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold px-3 py-1 rounded-full">
                            CRÍTICO
                        </span>
                    </div>
                    <h3 className="text-gray-900 dark:text-white font-bold text-lg">Lotes vencidos</h3>
                    {loading ? (
                        <p className="text-gray-400 text-sm animate-pulse">Cargando...</p>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                            <span className="text-2xl font-bold text-red-600">{stats?.lotes_vencidos ?? 0}</span> lotes con stock sin usar
                        </p>
                    )}
                    <Link to="/farmacia/inventario?estado=Vencido" className="text-primary hover:text-primary-dark text-sm font-semibold flex items-center gap-1 w-max">
                        Ver inventario <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                </div>

                {/* Próximos a vencer */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-yellow-100 dark:border-yellow-900/40 relative">
                    <div className="absolute top-0 left-0 w-8 h-8 rounded-tl-2xl border-t-4 border-l-4 border-yellow-500" />
                    <div className="flex justify-between items-start mb-4">
                        <div className="size-12 rounded-full bg-yellow-100 dark:bg-yellow-900/50 flex items-center justify-center text-yellow-600">
                            <span className="material-symbols-outlined">event</span>
                        </div>
                        <span className="bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-500 text-xs font-bold px-3 py-1 rounded-full">
                            PREVENTIVO
                        </span>
                    </div>
                    <h3 className="text-gray-900 dark:text-white font-bold text-lg">Próximos a vencer</h3>
                    {loading ? (
                        <p className="text-gray-400 text-sm animate-pulse">Cargando...</p>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                            <span className="text-2xl font-bold text-yellow-600">{stats?.lotes_proximos_vencer ?? 0}</span> lotes (en 30 días)
                        </p>
                    )}
                    <Link to="/farmacia/inventario?estado=Próximo" className="text-primary hover:text-primary-dark text-sm font-semibold flex items-center gap-1 w-max">
                        Ver inventario <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                </div>

                {/* Stock bajo */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-orange-100 dark:border-orange-900/40 relative">
                    <div className="absolute top-0 left-0 w-8 h-8 rounded-tl-2xl border-t-4 border-l-4 border-orange-400" />
                    <div className="flex justify-between items-start mb-4">
                        <div className="size-12 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center text-orange-500">
                            <span className="material-symbols-outlined">inventory_2</span>
                        </div>
                        <span className="bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-bold px-3 py-1 rounded-full">
                            REPONER
                        </span>
                    </div>
                    <h3 className="text-gray-900 dark:text-white font-bold text-lg">Stock bajo</h3>
                    {loading ? (
                        <p className="text-gray-400 text-sm animate-pulse">Cargando...</p>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                            <span className="text-2xl font-bold text-orange-600">{stats?.items_stock_bajo ?? 0}</span> medicamentos bajo el mínimo
                        </p>
                    )}
                    <Link to="/farmacia/inventario?estado=Bajo" className="text-primary hover:text-primary-dark text-sm font-semibold flex items-center gap-1 w-max">
                        Ver inventario <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                </div>
            </div>

            {/* Middle Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Próximos a vencer — lista */}
                <div className="xl:col-span-2 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Medicamentos próximos a vencer</h2>
                        <Link to="/farmacia/inventario?estado=Próximo" className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                            Ver todos
                        </Link>
                    </div>

                    <div className="flex flex-col gap-4">
                        {loading ? (
                            [1, 2, 3].map(i => (
                                <div key={i} className="bg-white dark:bg-gray-800 p-4 border border-gray-100 dark:border-gray-700 rounded-2xl animate-pulse h-[70px]" />
                            ))
                        ) : stats?.proximos_vencer?.length > 0 ? (
                            stats.proximos_vencer.map((lote) => (
                                <div key={lote.id_lote} className="bg-white dark:bg-gray-800 p-4 border border-gray-100 dark:border-gray-700 rounded-2xl flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 rounded-full bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center text-yellow-600">
                                            <span className="material-symbols-outlined">medication</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-white">{lote.medicamento}</h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {lote.forma} • Lote #{lote.id_lote} • Vence: {lote.fecha_vencimiento}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">STOCK</p>
                                            <p className="font-bold text-gray-900 dark:text-white text-sm">{lote.stock} unidades</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${lote.dias_vencimiento <= 7
                                            ? "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400"
                                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400"
                                            }`}>
                                            {diasLabel(lote.dias_vencimiento)}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white dark:bg-gray-800 p-6 border border-gray-100 dark:border-gray-700 rounded-2xl text-center text-gray-400 dark:text-gray-500">
                                <span className="material-symbols-outlined text-3xl mb-2 block mr-2">check_circle</span>
                                Sin medicamentos próximos a vencer en los próximos 30 días
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Col */}
                <div className="flex flex-col gap-8">
                    {/* Acciones Rápidas */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Acciones Rápidas</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <Link to="/farmacia/movimientos" className="bg-white dark:bg-gray-800 p-4 rounded-3xl border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center gap-2 hover:shadow-lg transition-shadow">
                                <div className="size-12 rounded-2xl bg-green-50 dark:bg-green-900/30 text-green-600 flex items-center justify-center">
                                    <span className="material-symbols-outlined">add_box</span>
                                </div>
                                <span className="text-sm font-bold text-gray-900 dark:text-white">Entrada</span>
                            </Link>

                            <Link to="/farmacia/movimientos?action=atender" className="bg-white dark:bg-gray-800 p-4 rounded-3xl border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center gap-2 hover:shadow-lg transition-shadow">
                                <div className="size-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center">
                                    <span className="material-symbols-outlined">vaccines</span>
                                </div>
                                <span className="text-sm font-bold text-gray-900 dark:text-white text-center leading-tight">Atender<br />Orden</span>
                            </Link>

                            <Link to="/farmacia/inventario" className="bg-white dark:bg-gray-800 p-4 rounded-3xl border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center gap-2 hover:shadow-lg transition-shadow">
                                <div className="size-12 rounded-2xl bg-cyan-50 dark:bg-cyan-900/30 text-cyan-500 flex items-center justify-center">
                                    <span className="material-symbols-outlined">list_alt</span>
                                </div>
                                <span className="text-sm font-bold text-gray-900 dark:text-white">Inventario</span>
                            </Link>

                            <Link to="/farmacia/reportes" className="bg-white dark:bg-gray-800 p-4 rounded-3xl border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center gap-2 hover:shadow-lg transition-shadow">
                                <div className="size-12 rounded-2xl bg-purple-50 dark:bg-purple-900/30 text-purple-500 flex items-center justify-center">
                                    <span className="material-symbols-outlined">history</span>
                                </div>
                                <span className="text-sm font-bold text-gray-900 dark:text-white">Historial</span>
                            </Link>
                        </div>
                    </div>

                    {/* El usuario ha solicitado remover la sección de movimientos recientes */}
                </div>
            </div>
        </div>
    );
}
