import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useLayout } from "../../LayoutContext";
import { useHelp } from "../../hooks/useHelp";
import PrincipalText from "../../components/Users/PrincipalText";
import Input from "../../components/UI/Input";
import DataTable from "../../components/UI/DataTable";
import TableSkeleton from "../../components/UI/TableSkeleton";
import SearchableSelect from "../../components/UI/SearchableSelect";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { entradaInventarioSchema, salidaInventarioSchema } from "../../utils/validations/farmaciaSchemas";
import { preventDoubleSpaces, normalizeText } from "../../utils/textUtils";
import { AnimatePresence, motion } from "framer-motion";
import api from "../../Api/axios";
import Swal from "sweetalert2";

const TIPOS = [
    { value: "", label: "Todos los tipos" },
    { value: "ingresos", label: "Entradas" },
    { value: "salidas_manuales", label: "Salidas Manuales" },
    { value: "ordenes_medicas", label: "Atención de Órdenes Médicas" },
];

export default function Movimientos() {
    const { setTitle, setSubtitle } = useLayout();

    useHelp({
        title: "Movimientos de Inventario",
        description: "Esta pantalla centraliza el control de entradas, salidas manuales y dispensaciones de medicamentos. Cada acción queda registrada con fecha, responsable y motivo.",
        sections: [
            {
                title: "¿Qué puedes hacer aquí?",
                type: "list",
                items: [
                    "Ver el historial completo de movimientos (entradas, salidas y dispensaciones).",
                    "Registrar una entrada de medicamento al inventario.",
                    "Registrar una salida manual (pérdida, vencimiento, ajuste).",
                    "Atender una orden médica buscando por ID de receta.",
                    "Filtrar movimientos por tipo o buscar por nombre de medicamento.",
                ]
            },
            {
                title: "Cómo registrar una Entrada",
                type: "steps",
                items: [
                    "Haz clic en el botón verde \"Registrar Entrada\".",
                    "Selecciona el medicamento (presentación) del listado.",
                    "Ingresa la cantidad y la fecha de vencimiento del lote.",
                    "Escribe el motivo de la entrada (ej: \"Reponer stock\").",
                    "Haz clic en \"Registrar\" para guardar.",
                ]
            },
            {
                title: "Cómo registrar una Salida Manual",
                type: "steps",
                items: [
                    "Haz clic en el botón rojo \"Salida Manual\".",
                    "Selecciona el lote del inventario. Verás el stock disponible por lote.",
                    "Ingresa la cantidad a retirar (no puede superar el stock del lote).",
                    "Indica el motivo (ej: \"Lote vencido\", \"Pérdida\").",
                    "Haz clic en \"Registrar\" para confirmar.",
                ]
            },
            {
                title: "Cómo atender una Orden Médica (Receta)",
                type: "steps",
                items: [
                    "Haz clic en \"Atender Orden\" (botón azul).",
                    "Escribe el ID de la receta médica y haz clic en \"Buscar\".",
                    "Verifica los datos del paciente y el estado de la receta.",
                    "Para cada medicamento pendiente, ingresa la cantidad a entregar y haz clic en \"Dispensar\".",
                ]
            },
            {
                title: "Problemas comunes",
                type: "warning",
                content: "Si al registrar una salida aparece el mensaje \"Stock Insuficiente\", la cantidad ingresada supera las existencias del lote seleccionado. Verifica el stock disponible antes de continuar. Si no encuentras una receta, confirma que el ID sea correcto y que la receta esté en estado activo."
            },
        ]
    });

    const [search, setSearch] = useState("");
    const [tipo, setTipo] = useState("");
    const [movimientos, setMovimientos] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [initialLoad, setInitialLoad] = useState(true);
    const [showEntradaModal, setShowEntradaModal] = useState(false);
    const [showSalidaModal, setShowSalidaModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showAtenderModal, setShowAtenderModal] = useState(false);
    const [idRecetaSearch, setIdRecetaSearch] = useState("");
    const [recetaData, setRecetaData] = useState(null);
    const [dispensarCantidades, setDispensarCantidades] = useState({});
    const [selectedMovimiento, setSelectedMovimiento] = useState(null);
    const [saving, setSaving] = useState(false);
    const [presentaciones, setPresentaciones] = useState([]);
    const [lotes, setLotes] = useState([]);

    const {
        register: registerEntrada,
        handleSubmit: handleSubmitEntrada,
        control: controlEntrada,
        formState: { errors: errorsEntrada },
        reset: resetEntrada
    } = useForm({
        resolver: zodResolver(entradaInventarioSchema),
        mode: "onChange",
        defaultValues: { id_presentacion: "", cantidad: "", fecha_vencimiento: "", motivo: "" }
    });

    const {
        register: registerSalida,
        handleSubmit: handleSubmitSalida,
        control: controlSalida,
        formState: { errors: errorsSalida },
        reset: resetSalida
    } = useForm({
        resolver: zodResolver(salidaInventarioSchema),
        mode: "onChange",
        defaultValues: { id_lote: "", cantidad: "", motivo: "" }
    });

    const location = useLocation();

    useEffect(() => {
        setTitle("Movimientos de Inventario");
        setSubtitle("Registro de entradas y salidas de medicamentos.");

        const params = new URLSearchParams(location.search);
        if (params.get("action") === "atender") {
            setShowAtenderModal(true);
        }
    }, [setTitle, setSubtitle, location.search]);

    const fetchMovimientos = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page };
            if (search.trim()) params.search = search.trim();
            if (tipo) params.tipo = tipo;
            const res = await api.get("/farmacia/movimientos", { params });
            setMovimientos(res.data ?? []);
            setTotal(res.total ?? 0);
            setLastPage(res.last_page ?? 1);
        } finally {
            setLoading(false);
            setInitialLoad(false);
        }
    }, [page, search, tipo]);

    useEffect(() => { fetchMovimientos(); }, [fetchMovimientos]);

    const fetchPresentaciones = async () => {
        const res = await api.get("/farmacia/medicamentos", { params: { page: 1 } });
        setPresentaciones(res.data ?? []);
    };

    const fetchLotes = async () => {
        const res = await api.get("/farmacia/lotes");
        setLotes(Array.isArray(res) ? res : (res.data ?? []));
    };

    const handleOpenEntrada = () => { fetchPresentaciones(); setShowEntradaModal(true); };
    const handleOpenSalida = () => { fetchLotes(); setShowSalidaModal(true); };

    const handleOpenDetails = (movimiento) => {
        setSelectedMovimiento(movimiento);
        setShowDetailsModal(true);
    };

    const handleRegistrarEntrada = async (data) => {
        setSaving(true);
        try {
            await api.post("/farmacia/inventario/entrada", data);
            Swal.fire({ icon: "success", title: "Entrada registrada", timer: 1500, showConfirmButton: false });
            setShowEntradaModal(false);
            resetEntrada();
            fetchMovimientos();
        } catch (err) {
            if (err.response?.status === 422) {
                const msgs = Object.values(err.response.data.errors).flat().join('\n');
                Swal.fire({ icon: "error", title: "Error de Validación", text: msgs });
            } else {
                Swal.fire({ icon: "error", title: "Error", text: err.response?.data?.message || "Error desconocido" });
            }
        } finally {
            setSaving(false);
        }
    };

    const handleValidationErrors = (errors) => {
        const errorMessages = Object.values(errors).map(err => err.message).join('\n');
        Swal.fire({ icon: "warning", title: "Datos incompletos o inválidos", text: errorMessages });
    };

    const handleRegistrarSalida = async (data) => {
        const loteSeleccionado = lotes.find(l => String(l.id_lote) === String(data.id_lote));
        if (loteSeleccionado && Number(data.cantidad) > Number(loteSeleccionado.stock_actual)) {
            Swal.fire({
                icon: "warning",
                title: "Stock Insuficiente",
                text: `La cantidad a retirar (${data.cantidad}) excede el stock del lote #${loteSeleccionado.id_lote} (${loteSeleccionado.stock_actual} unid.).`
            });
            return;
        }

        setSaving(true);
        try {
            await api.post("/farmacia/movimientos/salida", data);
            Swal.fire({ icon: "success", title: "Salida registrada", timer: 1500, showConfirmButton: false });
            setShowSalidaModal(false);
            resetSalida();
            fetchMovimientos();
        } catch (err) {
            if (err.response?.status === 422) {
                const msgs = Object.values(err.response.data.errors).flat().join('\n');
                Swal.fire({ icon: "error", title: "Error de Validación", text: msgs });
            } else {
                Swal.fire({ icon: "error", title: "Error", text: err.response?.data?.message || "Error desconocido" });
            }
        } finally {
            setSaving(false);
        }
    };

    const handleBuscarReceta = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        try {
            const res = await api.get(`/farmacia/receta/${idRecetaSearch}`);
            setRecetaData(res);
            const initialCants = {};
            res.items.forEach(i => {
                if (!i.dispensado) initialCants[i.id_detalle_receta] = i.cantidad_recetada || "";
            });
            setDispensarCantidades(initialCants);
        } catch (err) {
            setRecetaData(null);
            Swal.fire({ icon: "error", title: "Error", text: err.response?.data?.message || "Receta no encontrada" });
        } finally {
            setLoading(false);
        }
    };

    const handleDispensarItem = async (id_detalle_receta) => {
        const cantidad = dispensarCantidades[id_detalle_receta];
        if (!cantidad || cantidad <= 0) {
            Swal.fire("Atención", "Ingrese una cantidad válida", "warning");
            return;
        }

        setSaving(true);
        try {
            await api.post("/farmacia/dispensar", { id_detalle_receta, cantidad });
            Swal.fire({ icon: "success", title: "Dispensado", text: "Medicamento entregado con éxito", timer: 1500, showConfirmButton: false });
            handleBuscarReceta(); // Refrescar modal
            fetchMovimientos(); // Refrescar tabla de movimientos
        } catch (err) {
            Swal.fire({ icon: "error", title: "Error", text: err.response?.data?.message || "Error al dispensar" });
        } finally {
            setSaving(false);
        }
    };

    const tipoConfig = {
        Ingreso: { cls: "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400", icon: "north_east" },
        Salida: { cls: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400", icon: "south_west" },
        Reserva: { cls: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", icon: "lock" },
    };

    const columns = [
        {
            key: "tipo",
            header: "Tipo",
            render: (row) => {
                const cfg = tipoConfig[row.tipo_movimiento] ?? tipoConfig.Salida;
                return (
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${cfg.cls}`}>
                        <span className="material-symbols-outlined text-[14px]">{cfg.icon}</span>
                        {row.tipo_movimiento}
                    </div>
                );
            },
        },
        {
            key: "medicamento",
            header: "Medicamento",
            render: (row) => (
                <span className="font-semibold text-gray-900 dark:text-white">{row.medicamento}</span>
            ),
        },
        {
            key: "cantidad",
            header: "Cant.",
            render: (row) => (
                <span className="font-bold text-gray-900 dark:text-white">{row.cantidad}</span>
            ),
        },
        {
            key: "fecha",
            header: "Fecha",
            render: (row) => <span className="text-gray-600 dark:text-gray-400">{row.fecha}</span>,
        },
        {
            key: "receta",
            header: "Receta",
            render: (row) => (
                row.id_receta && row.id_receta !== 'N/A' ? (
                    <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded border border-blue-100 dark:border-blue-800">
                        #{row.id_receta}
                    </span>
                ) : (
                    <span className="text-gray-400 italic text-xs">N/A</span>
                )
            ),
        },
        {
            key: "acciones",
            header: "Detalles",
            align: "center",
            render: (row) => (
                <button
                    onClick={() => handleOpenDetails(row)}
                    className="p-2 text-gray-400 hover:text-primary transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                    title="Ver detalles"
                >
                    <span className="material-symbols-outlined text-[18px]">visibility</span>
                </button>
            ),
        },
    ];

    return (
        <>
            <div className="bg-white dark:bg-gray-900 rounded-2xl animate-fade-in p-6">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                <PrincipalText icon="swap_horiz" text="Historial de Movimientos" number={total} />
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={handleOpenEntrada}
                        className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-5 py-3 font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-green-600/20"
                    >
                        <span className="material-symbols-outlined text-lg">add_box</span>
                        <span className="hidden sm:inline">Registrar Entrada</span>
                    </button>
                    <button
                        onClick={handleOpenSalida}
                        className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-5 py-3 font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-red-600/20"
                    >
                        <span className="material-symbols-outlined text-lg">indeterminate_check_box</span>
                        <span className="hidden sm:inline">Salida Manual</span>
                    </button>
                    <button
                        onClick={() => setShowAtenderModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 py-3 font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20"
                    >
                        <span className="material-symbols-outlined text-lg">vaccines</span>
                        Atender Orden
                    </button>
                </div>
            </div>

            {/* Filtros */}
            <div className="mb-6 flex flex-wrap gap-4 items-center">
                <div className="lg:w-72 flex-1">
                    <Input
                        placeholder="Buscar por medicamento..."
                        icon="search"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    />
                </div>
                <select
                    value={tipo}
                    onChange={(e) => { setTipo(e.target.value); setPage(1); }}
                    className="border border-gray-300 dark:border-gray-700 dark:text-white dark:bg-gray-800 text-sm rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/40"
                >
                    {TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
                {initialLoad ? (
                    <TableSkeleton rows={8} cols={6} />
                ) : movimientos.length === 0 ? (
                    <div className="py-16 text-center text-gray-400 dark:text-gray-600">
                        <span className="material-symbols-outlined text-4xl mb-2 block">swap_horiz</span>
                        No hay movimientos registrados
                    </div>
                ) : (
                    <div className={`transition-opacity duration-200 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                        <DataTable columns={columns} data={movimientos} />
                    </div>
                )}
            </div>

            {lastPage > 1 && !initialLoad && (
                <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(prev => Math.max(1, prev - 1))}
                        className="px-4 py-2 text-sm rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-all font-bold"
                    >
                        ← Anterior
                    </button>

                    <div className="flex gap-1 overflow-x-auto max-w-[200px] sm:max-w-none">
                        {Array.from({ length: lastPage }, (_, i) => i + 1).map(p => (
                            <button
                                key={p}
                                onClick={() => setPage(p)}
                                className={`w-10 h-10 rounded-lg transition-all text-sm font-bold shrink-0 ${page === p
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
                        onClick={() => setPage(prev => Math.min(lastPage, prev + 1))}
                        className="px-4 py-2 text-sm rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-all font-bold"
                    >
                        Siguiente →
                    </button>
                </div>
            )}
        </div>

        {/* Modal Entrada */}
            {showEntradaModal && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-8">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-green-600">add_box</span>
                            Registrar Entrada
                        </h3>
                        <form onSubmit={handleSubmitEntrada(handleRegistrarEntrada, handleValidationErrors)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Medicamento *</label>
                                <Controller
                                    name="id_presentacion"
                                    control={controlEntrada}
                                    render={({ field }) => (
                                        <SearchableSelect
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Seleccionar medicamento..."
                                            options={presentaciones.map(p => ({
                                                value: p.id_presentacion,
                                                label: `${p.nombre} ${p.concentracion} (${p.forma})`
                                            }))}
                                        />
                                    )}
                                />
                                {errorsEntrada.id_presentacion && <p className="text-red-500 text-xs mt-1">{errorsEntrada.id_presentacion.message}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Cantidad *</label>
                                    <input type="number" min="1" {...registerEntrada("cantidad")}
                                        className={`w-full border ${errorsEntrada.cantidad ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40`} />
                                    {errorsEntrada.cantidad && <p className="text-red-500 text-xs mt-1">{errorsEntrada.cantidad.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Vencimiento *</label>
                                    <input type="date" min={new Date().toISOString().split("T")[0]} {...registerEntrada("fecha_vencimiento")}
                                        className={`w-full border ${errorsEntrada.fecha_vencimiento ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40`} />
                                    {errorsEntrada.fecha_vencimiento && <p className="text-red-500 text-xs mt-1">{errorsEntrada.fecha_vencimiento.message}</p>}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Motivo *</label>
                                <Controller
                                    name="motivo"
                                    control={controlEntrada}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            list="motivos-entrada"
                                            onChange={(e) => field.onChange(normalizeText(preventDoubleSpaces(e.target.value)))}
                                            className={`w-full border ${errorsEntrada.motivo ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40`}
                                            placeholder="Ej: Compra a proveedor..."
                                        />
                                    )}
                                />
                                <datalist id="motivos-entrada">
                                    <option value="Reponer stock" />
                                    <option value="Compra para reserva" />
                                    <option value="Ajuste positivo de inventario" />
                                </datalist>
                                {errorsEntrada.motivo && <p className="text-red-500 text-xs mt-1">{errorsEntrada.motivo.message}</p>}
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => { setShowEntradaModal(false); resetEntrada(); }} className="flex-1 py-3 rounded-xl border border-gray-300 dark:border-gray-700 font-bold text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancelar</button>
                                <button type="submit" disabled={saving} className="flex-1 py-3 rounded-xl bg-green-600 text-white font-bold text-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                                    {saving ? "Guardando..." : <><span className="material-symbols-outlined text-lg">save</span> Registrar</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Salida */}
            {showSalidaModal && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-3xl p-8">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-red-600">indeterminate_check_box</span>
                            Registrar Salida Manual
                        </h3>
                        <form onSubmit={handleSubmitSalida(handleRegistrarSalida, handleValidationErrors)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Lote / Medicamento *</label>
                                <Controller
                                    name="id_lote"
                                    control={controlSalida}
                                    render={({ field }) => (
                                        <SearchableSelect
                                            value={field.value}
                                            onChange={field.onChange}
                                            placeholder="Seleccionar lote del inventario..."
                                            options={lotes.map(l => ({
                                                value: l.id_lote,
                                                label: `${l.nombre} — Stock: ${l.stock_actual} unid. — Lote #${l.id_lote} — Vence: ${l.fecha_vencimiento}${l.vencido ? ' ⚠️ VENCIDO' : ''}`
                                            }))}
                                        />
                                    )}
                                />
                                {errorsSalida.id_lote && <p className="text-red-500 text-xs mt-1">{errorsSalida.id_lote.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Cantidad *</label>
                                <input type="number" min="1" {...registerSalida("cantidad")}
                                    className={`w-full border ${errorsSalida.cantidad ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40`} />
                                {errorsSalida.cantidad && <p className="text-red-500 text-xs mt-1">{errorsSalida.cantidad.message}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Motivo *</label>
                                <Controller
                                    name="motivo"
                                    control={controlSalida}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            list="motivos-salida"
                                            onChange={(e) => field.onChange(normalizeText(preventDoubleSpaces(e.target.value)))}
                                            className={`w-full border ${errorsSalida.motivo ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40`}
                                            placeholder="Ej: Lote vencido, Pérdida..."
                                        />
                                    )}
                                />
                                <datalist id="motivos-salida">
                                    <option value="Lote vencido" />
                                    <option value="Pérdida" />
                                    <option value="Ajuste por inventario" />
                                    <option value="Devolución a proveedor" />
                                </datalist>
                                {errorsSalida.motivo && <p className="text-red-500 text-xs mt-1">{errorsSalida.motivo.message}</p>}
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => { setShowSalidaModal(false); resetSalida(); }} className="flex-1 py-3 rounded-xl border border-gray-300 dark:border-gray-700 font-bold text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancelar</button>
                                <button type="submit" disabled={saving} className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                                    {saving ? "Guardando..." : <><span className="material-symbols-outlined text-lg">save</span> Registrar</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de Detalles */}
            {showDetailsModal && selectedMovimiento && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-8">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">info</span>
                            Detalles del Movimiento
                        </h3>

                        <div className="space-y-4 mb-6 relative">
                            <div className={`absolute top-0 right-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${tipoConfig[selectedMovimiento.tipo_movimiento]?.cls ?? tipoConfig.Salida.cls}`}>
                                <span className="material-symbols-outlined text-[14px]">{(tipoConfig[selectedMovimiento.tipo_movimiento] ?? tipoConfig.Salida).icon}</span>
                                {selectedMovimiento.tipo_movimiento}
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase">Medicamento</p>
                                <p className="text-gray-900 dark:text-white font-semibold">{selectedMovimiento.medicamento}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase">Cantidad</p>
                                    <p className="text-gray-900 dark:text-white font-semibold">{selectedMovimiento.cantidad} unidades</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase">Fecha</p>
                                    <p className="text-gray-900 dark:text-white">{selectedMovimiento.fecha}</p>
                                </div>
                            </div>

                            {selectedMovimiento.id_dispensacion && (
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase">ID Receta/Dispensación</p>
                                    <p className="font-mono text-sm text-primary bg-primary/10 w-fit px-2 py-1 rounded font-bold">
                                        #{selectedMovimiento.id_dispensacion}
                                    </p>
                                </div>
                            )}

                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                                <div className="mb-3">
                                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Motivo</p>
                                    <p className="text-gray-900 dark:text-white text-sm">{selectedMovimiento.motivo || "No especificado"}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Responsable</p>
                                    <p className="text-gray-900 dark:text-white text-sm flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">person</span>
                                        {selectedMovimiento.responsable}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex pt-2">
                            <button type="button" onClick={() => setShowDetailsModal(false)} className="w-full py-3 rounded-xl border border-gray-300 dark:border-gray-700 font-bold text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Atender Orden */}
            {showAtenderModal && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3 relative">
                                <div className="size-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                    <span className="material-symbols-outlined">vaccines</span>
                                </div>
                                Atender Orden (Receta)
                            </h3>
                            <button onClick={() => { setShowAtenderModal(false); setRecetaData(null); setIdRecetaSearch(""); }} className="p-2 text-gray-400 hover:text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                            <form onSubmit={handleBuscarReceta} className="flex gap-3">
                                <input
                                    type="text"
                                    required
                                    value={idRecetaSearch}
                                    onChange={(e) => setIdRecetaSearch(e.target.value)}
                                    placeholder="ID de la receta médica..."
                                    className="flex-1 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 dark:focus:border-blue-500 font-medium transition-colors"
                                />
                                <button type="submit" disabled={loading} className="px-6 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
                                    {loading ? "Buscando..." : "Buscar"}
                                </button>
                            </form>

                            {recetaData && (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="grid grid-cols-2 gap-4 bg-blue-50/50 dark:bg-blue-900/10 p-5 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                                        <div>
                                            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-1">Paciente</p>
                                            <p className="font-bold text-gray-900 dark:text-white truncate">{recetaData.paciente_nombre}</p>
                                            <p className="text-xs text-gray-500">Doc: {recetaData.paciente_doc}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-1">Estado de la Receta</p>
                                            <p className="font-bold text-gray-900 dark:text-white">{recetaData.estado_receta}</p>
                                            <p className="text-xs text-gray-500">Vence: {recetaData.fecha_vencimiento}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-gray-400">medication</span>
                                            Medicamentos a Entregar
                                        </h4>
                                        <div className="space-y-3">
                                            {recetaData.items.map((item) => (
                                                <div key={item.id_detalle_receta} className={`p-4 rounded-2xl border ${item.dispensado ? 'bg-green-50/50 border-green-100 dark:bg-green-900/10 dark:border-green-900/30' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'} flex items-center justify-between gap-4 transition-colors`}>
                                                    <div className="flex-1">
                                                        <h5 className={`font-bold ${item.dispensado ? 'text-green-800 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                                                            {item.medicamento}
                                                        </h5>
                                                        <div className="flex gap-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">water_drop</span>{item.dosis}</span>
                                                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">schedule</span>{item.frecuencia}</span>
                                                            <span className="flex items-center gap-1">Fin tratamiento: <span className="material-symbols-outlined text-[14px]">date_range</span>{item.duracion}</span>
                                                        </div>
                                                    </div>

                                                    {item.dispensado ? (
                                                        <span className="px-3 py-1.5 rounded-lg bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 text-xs font-bold flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-[16px]">check_circle</span> Entregado
                                                        </span>
                                                    ) : (
                                                        <div className="flex items-center gap-2 w-48">
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                placeholder="Cant."
                                                                readOnly
                                                                className="w-16 text-center border-2 border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 rounded-lg px-2 py-2 text-sm outline-none font-bold cursor-not-allowed"
                                                                value={dispensarCantidades[item.id_detalle_receta] || ""}
                                                                onChange={(e) => setDispensarCantidades(prev => ({ ...prev, [item.id_detalle_receta]: e.target.value }))}
                                                            />
                                                            <button
                                                                onClick={() => handleDispensarItem(item.id_detalle_receta)}
                                                                disabled={saving}
                                                                className="flex-1 py-2 rounded-lg bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors disabled:opacity-50"
                                                            >
                                                                Dispensar
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
