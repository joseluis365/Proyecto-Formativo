import { useEffect, useState, useCallback } from "react";
import { useLayout } from "../../LayoutContext";
import { useHelp } from "../../hooks/useHelp";
import PrincipalText from "../../components/Users/PrincipalText";
import Input from "../../components/UI/Input";
import DataTable from "../../components/UI/DataTable";
import TableSkeleton from "../../components/UI/TableSkeleton";
import api from "../../Api/axios";
import Swal from "sweetalert2";
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import MedicationLiquidRoundedIcon from '@mui/icons-material/MedicationRounded';
import MedicationRoundedIcon from '@mui/icons-material/MedicationRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';

export default function Medicamentos() {
    const { setTitle, setSubtitle } = useLayout();

    useHelp({
        title: "Catálogo de Medicamentos",
        description: "Este catálogo contiene todos los medicamentos registrados en el sistema con sus presentaciones (concentración + forma farmacéutica). Es la base que alimenta el inventario y los movimientos.",
        sections: [
            {
                title: "¿Qué puedes hacer aquí?",
                type: "list",
                items: [
                    "Consultar todos los medicamentos registrados y sus presentaciones.",
                    "Registrar un nuevo medicamento con su categoría, concentración y forma farmacéutica.",
                    "Buscar por nombre o concentración.",
                    "Filtrar por forma farmacéutica (tabletas, jarabe, inyectable, etc.) o concentración.",
                ]
            },
            {
                title: "Diferencia entre Catálogo e Inventario",
                type: "tip",
                content: "El catálogo define QUÉ medicamentos existen. El inventario registra CUÁNTOS hay en físico. Un medicamento puede estar en el catálogo pero tener stock 0 en inventario. Para agregar existencias físicas, ve a la sección Inventario o Movimientos."
            },
            {
                title: "Cómo registrar un nuevo medicamento",
                type: "steps",
                items: [
                    "Haz clic en \"Registrar Nuevo\".",
                    "Escribe el nombre del medicamento (ej: \"Acetaminofén\").",
                    "Selecciona la categoría terapéutica.",
                    "Selecciona la concentración (ej: \"500 mg\") y la forma farmacéutica (ej: \"Tableta\").",
                    "Agrega una descripción opcional y haz clic en \"Guardar\".",
                ]
            },
            {
                title: "Problemas comunes",
                type: "warning",
                content: "Si el medicamento que buscas no aparece en el inventario ni en la lista de dispensación, primero debes crearlo aquí en el catálogo. Una vez creado, podrás registrar entradas de stock desde la pantalla de Movimientos o Inventario."
            },
        ]
    });

    const [search, setSearch] = useState("");
    const [filtroForma, setFiltroForma] = useState("");
    const [filtroConcentracion, setFiltroConcentracion] = useState("");
    const [presentaciones, setPresentaciones] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [initialLoad, setInitialLoad] = useState(true);
    const [categorias, setCategorias] = useState([]);
    const [concentraciones, setConcentraciones] = useState([]);
    const [formas, setFormas] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        nombre: "", descripcion: "", id_categoria: "",
        id_concentracion: "", id_forma_farmaceutica: ""
    });

    useEffect(() => {
        setTitle("Catálogo de Medicamentos");
        setSubtitle("Lista de medicamentos registrados en el sistema.");
    }, [setTitle, setSubtitle]);

    const fetchSelects = async () => {
        const [cat, conc, forma] = await Promise.all([
            api.get("/farmacia/categorias"),
            api.get("/farmacia/concentraciones"),
            api.get("/farmacia/formas-farmaceuticas"),
        ]);
        setCategorias(cat.data ?? []);
        setConcentraciones(conc.data ?? []);
        setFormas(forma.data ?? []);
    };

    useEffect(() => { fetchSelects(); }, []);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page };
            if (search.trim()) params.search = search.trim();
            if (filtroForma) params.id_forma = filtroForma;
            if (filtroConcentracion) params.id_concentracion = filtroConcentracion;

            const res = await api.get("/farmacia/medicamentos", { params });
            setPresentaciones(res.data ?? []);
            setTotal(res.total ?? 0);
            setLastPage(res.last_page ?? 1);
        } finally {
            setLoading(false);
            setInitialLoad(false);
        }
    }, [page, search, filtroForma, filtroConcentracion]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.post("/farmacia/medicamento", form);
            Swal.fire({ icon: "success", title: "Medicamento creado", timer: 1500, showConfirmButton: false });
            setShowModal(false);
            setForm({ nombre: "", descripcion: "", id_categoria: "", id_concentracion: "", id_forma_farmaceutica: "" });
            fetchData();
        } catch (error) {
            Swal.fire({ icon: "error", title: "Error al guardar", text: error.response?.data?.message || "Ocurrió un error" });
        } finally {
            setSaving(false);
        }
    };

    const columns = [
        {
            key: "nombre",
            header: "Medicamento",
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 flex items-center justify-center shrink-0">
                        <FolderRoundedIcon sx={{ fontSize: '0.875rem' }} />
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 dark:text-white">{row.nombre}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{row.categoria}</p>
                    </div>
                </div>
            ),
        },
        {
            key: "concentracion",
            header: "Concentración",
            render: (row) => <span className="text-sm text-gray-700 dark:text-gray-300">{row.concentracion}</span>,
        },
        {
            key: "forma",
            header: "Forma",
            render: (row) => <span className="text-sm text-gray-700 dark:text-gray-300">{row.forma}</span>,
        },
        {
            key: "acciones",
            header: "Acciones",
            align: "center",
            render: (row) => (
                <div className="flex justify-center gap-2">
                    <button
                        className="p-2 text-gray-400 hover:text-primary transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                        title="Ver detalles"
                    >
                        <VisibilityRoundedIcon sx={{ fontSize: '1.125rem' }} />
                    </button>
                    <button
                        className="p-2 text-gray-400 hover:text-primary transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                        title="Editar medicamento"
                    >
                        <EditRoundedIcon sx={{ fontSize: '1.125rem' }} />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <>
            <div className="bg-white dark:bg-gray-900 rounded-2xl animate-fade-in p-6">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                <PrincipalText icon={<MedicationRoundedIcon sx={{ fontSize: '2.5rem' }} />} text="Medicamentos Registrados" number={total} />
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-primary hover:bg-primary-dark text-white rounded-xl px-6 py-3 font-bold text-sm transition-all flex items-center gap-2 group shadow-lg shadow-primary/20"
                >
                    Registrar Nuevo
                    <AddRoundedIcon sx={{ fontSize: '1.125rem' }} className="group-hover:rotate-90 transition-transform" />
                </button>
            </div>

            <div className="mb-6 flex flex-wrap gap-4 items-center">
                <div className="lg:w-sm md:w-1/2 flex-1 min-w-[200px]">
                    <Input
                        placeholder="Buscar por nombre o concentración..."
                        icon="search"
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    />
                </div>
                <div className="flex gap-4">
                    <select
                        value={filtroForma}
                        onChange={(e) => { setFiltroForma(e.target.value); setPage(1); }}
                        className="w-40 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 text-gray-700 dark:text-gray-300 font-medium"
                    >
                        <option value="">Todas las Formas</option>
                        {formas.map(f => <option key={f.id_forma} value={f.id_forma}>{f.forma_farmaceutica}</option>)}
                    </select>
                    <select
                        value={filtroConcentracion}
                        onChange={(e) => { setFiltroConcentracion(e.target.value); setPage(1); }}
                        className="w-40 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 text-gray-700 dark:text-gray-300 font-medium"
                    >
                        <option value="">Todas las Concentraciones</option>
                        {concentraciones.map(c => <option key={c.id_concentracion} value={c.id_concentracion}>{c.concentracion}</option>)}
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
                {initialLoad ? (
                    <TableSkeleton rows={8} cols={5} />
                ) : presentaciones.length === 0 ? (
                    <div className="py-16 text-center text-gray-400 dark:text-gray-600">
                        <MedicationLiquidRoundedIcon sx={{ fontSize: '2.5rem' }} className="mb-2 block mx-auto" />
                        No se encontraron medicamentos
                    </div>
                ) : (
                    <div className={`transition-opacity duration-200 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                        <DataTable columns={columns} data={presentaciones} />
                    </div>
                )}
            </div>

            {/* Paginación */}
            {!initialLoad && lastPage > 1 && (
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

            {/* Modal nuevo medicamento */}
            {showModal && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg p-8">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <MedicationRoundedIcon sx={{ fontSize: '1.5rem' }} className="text-primary" />
                            Nuevo Medicamento
                        </h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Nombre del medicamento *</label>
                                <input required value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                                    className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                                    placeholder="Ej: Acetaminofén" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Categoría *</label>
                                <select required value={form.id_categoria} onChange={e => setForm(f => ({ ...f, id_categoria: e.target.value }))}
                                    className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40">
                                    <option value="">Seleccionar categoría</option>
                                    {categorias.map(c => <option key={c.id_categoria} value={c.id_categoria}>{c.categoria}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Concentración *</label>
                                    <select required value={form.id_concentracion} onChange={e => setForm(f => ({ ...f, id_concentracion: e.target.value }))}
                                        className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40">
                                        <option value="">Seleccionar</option>
                                        {concentraciones.map(c => <option key={c.id_concentracion} value={c.id_concentracion}>{c.concentracion}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Forma farmacéutica *</label>
                                    <select required value={form.id_forma_farmaceutica} onChange={e => setForm(f => ({ ...f, id_forma_farmaceutica: e.target.value }))}
                                        className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40">
                                        <option value="">Seleccionar</option>
                                        {formas.map(f => <option key={f.id_forma} value={f.id_forma}>{f.forma_farmaceutica}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
                                <textarea rows={2} value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
                                    className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                                    placeholder="Descripción opcional..." />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setShowModal(false)}
                                    className="flex-1 py-3 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    Cancelar
                                </button>
                                <button type="submit" disabled={saving}
                                    className="flex-1 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                                    {saving ? "Guardando..." : <><SaveRoundedIcon sx={{ fontSize: '1.125rem' }} /> Guardar</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
