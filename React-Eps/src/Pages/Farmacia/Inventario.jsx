import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useLayout } from "../../LayoutContext";
import PrincipalText from "../../components/Users/PrincipalText";
import Input from "../../components/UI/Input";
import DataTable from "../../components/UI/DataTable";
import TableSkeleton from "../../components/UI/TableSkeleton";
import SearchableSelect from "../../components/UI/SearchableSelect";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { entradaInventarioSchema } from "../../utils/validations/farmaciaSchemas";
import { preventDoubleSpaces, normalizeText } from "../../utils/textUtils";
import api from "../../Api/axios";
import Swal from "sweetalert2";

export default function Inventario() {
    const { setTitle, setSubtitle } = useLayout();
    const location = useLocation();
    const [search, setSearch] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("");
    const [filtroForma, setFiltroForma] = useState("");
    const [filtroConcentracion, setFiltroConcentracion] = useState("");
    const [inventario, setInventario] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [initialLoad, setInitialLoad] = useState(true);
    const [nitFarmacia, setNitFarmacia] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [presentaciones, setPresentaciones] = useState([]);
    const [formas, setFormas] = useState([]);
    const [concentraciones, setConcentraciones] = useState([]);

    const { register, handleSubmit, control, formState: { errors }, reset } = useForm({
        resolver: zodResolver(entradaInventarioSchema),
        mode: "onChange",
        defaultValues: { id_presentacion: "", cantidad: "", fecha_vencimiento: "", motivo: "" }
    });

    useEffect(() => {
        setTitle("Inventario de Farmacia");
        setSubtitle("Control de existencias y fechas de vencimiento.");

        const params = new URLSearchParams(location.search);
        const estadoParam = params.get("estado");
        if (estadoParam) setFiltroEstado(estadoParam);
    }, [setTitle, setSubtitle, location.search]);

    const fetchSelects = async () => {
        const [conc, forma] = await Promise.all([
            api.get("/farmacia/concentraciones"),
            api.get("/farmacia/formas-farmaceuticas"),
        ]);
        setConcentraciones(conc.data ?? []);
        setFormas(forma.data ?? []);
    };

    useEffect(() => { fetchSelects(); }, []);

    const fetchInventario = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page };
            if (search.trim()) params.search = search.trim();
            if (filtroEstado) params.estado = filtroEstado;
            if (filtroForma) params.id_forma = filtroForma;
            if (filtroConcentracion) params.id_concentracion = filtroConcentracion;

            const res = await api.get("/farmacia/inventario", { params });
            setInventario(res.data ?? []);
            setTotal(res.total ?? 0);
            setLastPage(res.last_page ?? 1);
            setNitFarmacia(res.nit_farmacia ?? null);
        } finally {
            setLoading(false);
            setInitialLoad(false);
        }
    }, [page, search, filtroEstado, filtroForma, filtroConcentracion]);

    useEffect(() => { fetchInventario(); }, [fetchInventario]);

    const fetchPresentaciones = async () => {
        const res = await api.get("/farmacia/medicamentos", { params: { page: 1 } });
        setPresentaciones(res.data ?? []);
    };

    const handleOpenEntrada = () => {
        fetchPresentaciones();
        setShowModal(true);
    };

    const handleRegistrarEntrada = async (data) => {
        setSaving(true);
        try {
            await api.post("/farmacia/inventario/entrada", data);
            Swal.fire({ icon: "success", title: "Entrada registrada", timer: 1500, showConfirmButton: false });
            setShowModal(false);
            reset();
            fetchInventario();
        } catch (error) {
            if (error.response?.status === 422) {
                const msgs = Object.values(error.response.data.errors).flat().join('\n');
                Swal.fire({ icon: "error", title: "Error de Validación", text: msgs });
            } else {
                Swal.fire({ icon: "error", title: "Error", text: error.response?.data?.message || "Error desconocido" });
            }
        } finally {
            setSaving(false);
        }
    };

    const handleValidationErrors = (errors) => {
        const errorMessages = Object.values(errors).map(err => err.message).join('\n');
        Swal.fire({
            icon: "warning",
            title: "Datos incompletos o inválidos",
            text: errorMessages
        });
    };

    const estadoConfig = {
        Normal: { cls: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400" },
        Bajo: { cls: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400" },
        Próximo: { cls: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400" },
        Agotado: { cls: "bg-gray-100 text-gray-600 border-gray-300 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400" },
        Vencido: { cls: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400" },
        Crítico: { cls: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400" },
    };

    const columns = [
        {
            key: "medicamento",
            header: "Medicamento",
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-sm">medication</span>
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 dark:text-white">{row.nombre}</p>
                        <p className="text-xs text-gray-500">{row.forma} • {row.categoria}</p>
                    </div>
                </div>
            ),
        },
        {
            key: "stock",
            header: "Stock Actual",
            render: (row) => (
                <span className={`font-bold text-lg ${row.stock_actual <= 20 ? "text-red-600" : "text-gray-900 dark:text-white"}`}>
                    {row.stock_actual} <span className="text-xs font-normal text-gray-400">unid.</span>
                </span>
            ),
        },
        {
            key: "lote",
            header: "Lote FEFO",
            render: (row) => (
                <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
                    {row.lote_id ? `#${row.lote_id}` : "—"}
                </span>
            ),
        },
        {
            key: "vencimiento",
            header: "Próx. Vencimiento",
            render: (row) => (
                <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{row.fecha_vencimiento ?? "—"}</p>
                    {row.dias_vencimiento !== null && (
                        <p className={`text-xs font-semibold ${row.dias_vencimiento < 0 ? "text-red-600" : row.dias_vencimiento <= 30 ? "text-orange-500" : "text-gray-400"}`}>
                            {row.dias_vencimiento < 0 ? `Vencido hace ${Math.abs(row.dias_vencimiento)} días` :
                                row.dias_vencimiento === 0 ? "Vence hoy" : `En ${row.dias_vencimiento} días`}
                        </p>
                    )}
                </div>
            ),
        },
        {
            key: "estado_stock",
            header: "Estado",
            render: (row) => (
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${(estadoConfig[row.estado_stock] ?? estadoConfig.Normal).cls}`}>
                    {row.estado_stock}
                </span>
            ),
        },
    ];

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl animate-fade-in p-6">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                <PrincipalText icon="inventory_2" text="Inventario Actual" number={total} />
                <button
                    onClick={handleOpenEntrada}
                    className="bg-green-600 hover:bg-green-700 text-white rounded-xl px-6 py-3 font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-green-600/20"
                >
                    <span className="material-symbols-outlined text-lg">add_box</span>
                    Registrar Entrada
                </button>
            </div>

            <div className="mb-6 flex flex-wrap gap-4 items-center">
                <div className="lg:w-sm md:w-1/2 flex-1 min-w-[200px]">
                    <Input
                        placeholder="Buscar medicamento..."
                        icon="search"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    />
                </div>
                <div className="flex gap-4 flex-wrap">
                    <select
                        value={filtroEstado}
                        onChange={(e) => { setFiltroEstado(e.target.value); setPage(1); }}
                        className="w-36 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 text-gray-700 dark:text-gray-300 font-medium"
                    >
                        <option value="">Todos los Estados</option>
                        <option value="Normal">Normal</option>
                        <option value="Próximo">Próximos a Vencer</option>
                        <option value="Vencido">Vencidos</option>
                        <option value="Bajo">Stock Bajo</option>
                        <option value="Agotado">Agotados</option>
                    </select>
                    <select
                        value={filtroForma}
                        onChange={(e) => { setFiltroForma(e.target.value); setPage(1); }}
                        className="w-36 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 text-gray-700 dark:text-gray-300 font-medium"
                    >
                        <option value="">Todas las Formas</option>
                        {formas.map(f => <option key={f.id_forma} value={f.id_forma}>{f.forma_farmaceutica}</option>)}
                    </select>
                    <select
                        value={filtroConcentracion}
                        onChange={(e) => { setFiltroConcentracion(e.target.value); setPage(1); }}
                        className="w-36 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 text-gray-700 dark:text-gray-300 font-medium"
                    >
                        <option value="">Todas las Conc.</option>
                        {concentraciones.map(c => <option key={c.id_concentracion} value={c.id_concentracion}>{c.concentracion}</option>)}
                    </select>
                </div>
                {nitFarmacia && (
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">store</span>
                        Farmacia: <strong className="text-gray-600 dark:text-gray-300 ml-1">{nitFarmacia}</strong>
                    </span>
                )}
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
                {initialLoad ? (
                    <TableSkeleton rows={8} cols={6} />
                ) : inventario.length === 0 ? (
                    <div className="py-16 text-center text-gray-400 dark:text-gray-600">
                        <span className="material-symbols-outlined text-4xl mb-2 block">inventory</span>
                        No hay medicamentos en el inventario
                    </div>
                ) : (
                    <div className={`transition-opacity duration-200 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                        <DataTable columns={columns} data={inventario} />
                    </div>
                )}
            </div>

            {lastPage > 1 && !initialLoad && (
                <div className="flex justify-center gap-3 mt-6">
                    <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
                        className="px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        ← Anterior
                    </button>
                    <span className="px-4 py-2 text-sm text-gray-500">Página {page} de {lastPage}</span>
                    <button disabled={page >= lastPage} onClick={() => setPage(p => p + 1)}
                        className="px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        Siguiente →
                    </button>
                </div>
            )}

            {/* Modal Registrar Entrada */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-8">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-green-600">add_box</span>
                            Registrar Entrada de Medicamento
                        </h3>
                        <form onSubmit={handleSubmit(handleRegistrarEntrada, handleValidationErrors)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Medicamento (presentación) *</label>
                                <Controller
                                    name="id_presentacion"
                                    control={control}
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
                                {errors.id_presentacion && <p className="text-red-500 text-xs mt-1">{errors.id_presentacion.message}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Cantidad *</label>
                                    <input type="number" min="1" {...register("cantidad")}
                                        className={`w-full border ${errors.cantidad ? 'border-red-500 hover:border-red-600 focus:border-red-500 focus:ring-red-500/40' : 'border-gray-300 dark:border-gray-700'} dark:bg-gray-800 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40`}
                                        placeholder="0" />
                                    {errors.cantidad && <p className="text-red-500 text-xs mt-1">{errors.cantidad.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Fecha vencimiento *</label>
                                    <input type="date" min={new Date().toISOString().split("T")[0]} {...register("fecha_vencimiento")}
                                        className={`w-full border ${errors.fecha_vencimiento ? 'border-red-500 hover:border-red-600 focus:border-red-500 focus:ring-red-500/40' : 'border-gray-300 dark:border-gray-700'} dark:bg-gray-800 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40`} />
                                    {errors.fecha_vencimiento && <p className="text-red-500 text-xs mt-1">{errors.fecha_vencimiento.message}</p>}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Motivo / Observación *</label>
                                <Controller
                                    name="motivo"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            list="motivos-entrada"
                                            onChange={(e) => {
                                                const cleaned = preventDoubleSpaces(e.target.value);
                                                field.onChange(normalizeText(cleaned));
                                            }}
                                            className={`w-full border ${errors.motivo ? 'border-red-500 hover:border-red-600 focus:border-red-500 focus:ring-red-500/40' : 'border-gray-300 dark:border-gray-700'} dark:bg-gray-800 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40`}
                                            placeholder="Ej: Reponer stock, Compra para reserva..."
                                        />
                                    )}
                                />
                                <datalist id="motivos-entrada">
                                    <option value="Reponer stock" />
                                    <option value="Compra para reserva" />
                                    <option value="Ajuste positivo de inventario" />
                                </datalist>
                                {errors.motivo && <p className="text-red-500 text-xs mt-1">{errors.motivo.message}</p>}
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => { setShowModal(false); reset(); }}
                                    className="flex-1 py-3 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    Cancelar
                                </button>
                                <button type="submit" disabled={saving}
                                    className="flex-1 py-3 rounded-xl bg-green-600 text-white font-bold text-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                                    {saving ? "Guardando..." : <><span className="material-symbols-outlined text-lg">save</span> Registrar</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
