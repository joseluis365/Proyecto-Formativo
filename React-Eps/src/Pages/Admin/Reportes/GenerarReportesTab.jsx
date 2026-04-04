import { useState, useEffect, useMemo, useCallback } from "react";
import { useHelp } from "@/hooks/useHelp";
import DataTable from "@/components/UI/DataTable";
import Input from "@/components/UI/Input";
import Filter from "@/components/UI/Filter";
import TableSkeleton from "@/components/UI/TableSkeleton";
import PrincipalText from "@/components/Users/PrincipalText";
import SearchableSelect from "@/components/UI/SearchableSelect";
import { AnimatePresence, motion } from "framer-motion";
import useReports from "@/hooks/useReports";
import api from "@/Api/axios";
import Swal from "sweetalert2";
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import QueryStatsRoundedIcon from '@mui/icons-material/QueryStatsRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';

// ─── Opciones de entidad ────────────────────────────────────────────────────
const entityOptions = [
    { value: "usuario", label: "Usuarios", group: "general" },
    { value: "farmacia", label: "Farmacias", group: "general" },
    { value: "citas", label: "Citas Médicas", group: "clinical" },
    { value: "farmacia_inventario", label: "Inventario de Farmacias", group: "pharmacy" },
    { value: "farmacia_movimientos", label: "Movimientos de Farmacia", group: "pharmacy" },
    { value: "prioridades", label: "Prioridades", group: "config" },
    { value: "roles", label: "Roles", group: "config" },
    { value: "departamentos", label: "Departamentos", group: "config" },
    { value: "ciudades", label: "Ciudades", group: "config" },
    { value: "especialidades", label: "Especialidades", group: "config" },
    { value: "categoria_examen", label: "Categorías de Examen", group: "config" },
    { value: "categoria_medicamento", label: "Categorías de Medicamento", group: "config" },
];

// ─── Filtros de estado por entidad ──────────────────────────────────────────
const statusOptions = {
    default: [
        { value: "", label: "Todos los estados" },
        { value: 1, label: "Activos/Activas" },
        { value: 2, label: "Inactivos/Inactivas" },
    ],
    citas: [
        { value: "", label: "Todos los estados" },
        { value: "9", label: "Agendada" },
        { value: "10", label: "Atendida" },
        { value: "11", label: "Cancelada" },
        { value: "16", label: "Inasistencia" },
    ],
};

const estadoInventarioOptions = [
    { value: "", label: "Todos los estados de stock" },
    { value: "Normal", label: "Normal" },
    { value: "Bajo", label: "Stock Bajo" },
    { value: "Próximo", label: "Próximo a Vencer" },
    { value: "Vencido", label: "Vencido" },
];

const tipoMovimientoOptions = [
    { value: "", label: "Todos los tipos" },
    { value: "ingresos", label: "Entradas / Ingresos" },
    { value: "salidas_manuales", label: "Salidas Manuales" },
    { value: "ordenes_medicas", label: "Órdenes Médicas (Recetas)" },
];

// ─── Helpers para determinar el tipo de entidad ──────────────────────────────
const isPharmacy = (e) => e === "farmacia_inventario" || e === "farmacia_movimientos";
const isCitas = (e) => e === "citas";
const isGeneric = (e) => !isPharmacy(e) && !isCitas(e);

// ─── Columnas para entidades de farmacia ─────────────────────────────────────
const getPharmacyColumns = (entity) => {
    if (entity === "farmacia_inventario") {
        return [
            { key: "id_lote", header: "Lote #" },
            { key: "nombre", header: "Medicamento" },
            { key: "forma", header: "Forma" },
            { key: "concentracion", header: "Concentración" },
            { key: "stock_lote", header: "Stock Lote" },
            { key: "stock_total", header: "Stock Total" },
            {
                key: "estado_stock", header: "Estado", render: (r) => {
                    const colors = {
                        Normal: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
                        Bajo: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
                        Próximo: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
                        Vencido: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
                    };
                    return (
                        <span className={`px-2 py-1 text-xs font-bold rounded-full border ${colors[r.estado_stock] || "bg-gray-100 text-gray-600"}`}>
                            {r.estado_stock}
                        </span>
                    );
                }
            },
            { key: "fecha_vencimiento", header: "Vencimiento" },
        ];
    }
    if (entity === "farmacia_movimientos") {
        return [
            {
                key: "tipo_movimiento", header: "Tipo", render: (r) => {
                    const isIngreso = r.tipo_movimiento === "Ingreso";
                    return (
                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${isIngreso ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300" : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"}`}>
                            {r.tipo_movimiento}
                        </span>
                    );
                }
            },
            { key: "medicamento", header: "Medicamento" },
            { key: "cantidad", header: "Cantidad" },
            { key: "fecha", header: "Fecha" },
            { key: "motivo", header: "Motivo/Orden" },
            { key: "responsable", header: "Responsable" },
            { key: "paciente", header: "Paciente" },
        ];
    }
    return [];
};

// ─── Columnas para entidad Citas  ─────────────────────────────────────────────
const citasColumns = [
    { key: "id_cita", header: "N° Cita", render: (r) => `#${r.id_cita}` },
    { key: "paciente", header: "Paciente", render: (r) => r.paciente ? `${r.paciente.primer_nombre} ${r.paciente.primer_apellido}` : "N/A" },
    { key: "medico", header: "Médico", render: (r) => r.medico ? `${r.medico.primer_nombre} ${r.medico.primer_apellido}` : "N/A" },
    { key: "especialidad", header: "Especialidad", render: (r) => r.especialidad?.especialidad || "N/A" },
    { key: "fecha", header: "Fecha", render: (r) => r.fecha ? new Date(r.fecha).toLocaleDateString("es-CO") : "N/A" },
    { key: "estado", header: "Estado", render: (r) => {
        const nombre = r.estado?.nombre_estado || "N/A";
        const colors = {
            "Agendada": "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
            "Atendida": "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
            "Cancelada": "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
            "Inasistencia": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
        };
        return <span className={`px-2 py-1 text-xs font-bold rounded-full ${colors[nombre] || "bg-gray-100 text-gray-600"}`}>{nombre}</span>;
    }},
];

export default function GenerarReportesTab() {
    useHelp({
        title: "Centro de Reportes (Admin)",
        description: "Herramienta analítica avanzada para generar listados de todas las entidades del sistema con filtros dinámicos y exportación a PDF.",
        sections: [
            {
                title: "Tipos de reporte disponibles",
                type: "list",
                items: [
                    "Usuarios, Farmacias y Configuración: entidades generales del sistema.",
                    "Citas Médicas: con filtros por médico, especialidad, motivo, diagnóstico y fecha.",
                    "Inventario de Farmacias: con filtro por estado de stock y farmacia.",
                    "Movimientos de Farmacia: con filtro por tipo de movimiento y farmacia.",
                ]
            },
            {
                title: "Cómo generar y exportar",
                type: "steps",
                items: [
                    "Selecciona el tipo de reporte en el desplegable superior derecho.",
                    "Aplica los filtros contextuales que aparezcan para ese reporte.",
                    "Haz clic en 'Exportar PDF'. El PDF incluirá todos los registros con tus filtros.",
                ]
            }
        ]
    });

    const [entity, setEntity] = useState("usuario");

    // ── Listas para selects ──────────────────────────────────────────────────
    const [roles, setRoles] = useState([]);
    const [farmacias, setFarmacias] = useState([]);
    const [motivos, setMotivos] = useState([]);
    const [medicos, setMedicos] = useState([]);
    const [especialidades, setEspecialidades] = useState([]);
    const [enfermedades, setEnfermedades] = useState([]);

    // ── Filtros generales ────────────────────────────────────────────────────
    const {
        data: genericData, meta, loading: genericLoading,
        page, setPage, lastPage, total: genericTotal,
        search, setSearch,
        idEstado, setIdEstado,
        idRol, setIdRol,
        nitFarmacia, setNitFarmacia,
        dateFrom, setDateFrom,
        dateTo, setDateTo,
    } = useReports(isGeneric(entity) ? entity : null);

    // ── Filtros específicos para Citas ───────────────────────────────────────
    const [idMotivo, setIdMotivo] = useState("");
    const [idMedico, setIdMedico] = useState("");
    const [idEspecialidad, setIdEspecialidad] = useState("");
    const [codigoIcd, setCodigoIcd] = useState("");
    const [citasEstado, setCitasEstado] = useState("");

    // ── Estado para Farmacia/Movimientos (llamadas directas) ─────────────────
    const [pharmacySearch, setPharmacySearch] = useState("");
    const [selectedFarmacia, setSelectedFarmacia] = useState("");
    const [estadoInventario, setEstadoInventario] = useState("");
    const [tipoMovimiento, setTipoMovimiento] = useState("");
    const [pharmacyData, setPharmacyData] = useState([]);
    const [pharmacyTotal, setPharmacyTotal] = useState(0);
    const [pharmacyPage, setPharmacyPage] = useState(1);
    const [pharmacyLastPage, setPharmacyLastPage] = useState(1);
    const [pharmacyLoading, setPharmacyLoading] = useState(false);

    // ── Estado para Citas ────────────────────────────────────────────────────
    const [citasData, setCitasData] = useState([]);
    const [citasTotal, setCitasTotal] = useState(0);
    const [citasPage, setCitasPage] = useState(1);
    const [citasLastPage, setCitasLastPage] = useState(1);
    const [citasLoading, setCitasLoading] = useState(false);
    const [citasSearch, setCitasSearch] = useState("");
    const [citasDateFrom, setCitasDateFrom] = useState("");
    const [citasDateTo, setCitasDateTo] = useState("");

    // ── Carga de listas globales ─────────────────────────────────────────────
    useEffect(() => {
        api.get("/configuracion/roles", { params: { per_page: 100 } }).then(res => {
            const list = Array.isArray(res) ? res : (res?.data || []);
            setRoles(list.filter(r => !r.tipo_usu?.toLowerCase().includes("super")));
        }).catch(() => setRoles([]));

        api.get("/farmacias").then(res => {
            const list = Array.isArray(res) ? res : (res?.data || []);
            setFarmacias(list);
        }).catch(() => setFarmacias([]));

        api.get('/motivos-consulta').then(res => {
            const raw = Array.isArray(res) ? res : (res?.data || []);
            setMotivos(raw.map(m => ({ value: m.value ?? m.id_motivo, label: m.label || m.motivo || "Sin nombre" })));
        }).catch(() => setMotivos([]));

        api.get('/usuarios', { params: { id_rol: 4, per_page: 500 } }).then(res => {
            const raw = res?.data || res || [];
            setMedicos(raw.map(m => ({ value: m.documento, label: `${m.primer_nombre} ${m.primer_apellido}` })));
        }).catch(() => setMedicos([]));

        api.get('/especialidades').then(res => {
            const raw = Array.isArray(res) ? res : (res?.data || []);
            setEspecialidades(raw.map(e => ({ value: e.value ?? e.id_especialidad, label: e.label || e.especialidad || "" })));
        }).catch(() => setEspecialidades([]));

        api.get('/enfermedades', { params: { per_page: 1000 } }).then(res => {
            const raw = res?.data || res || [];
            setEnfermedades(raw);
        }).catch(() => setEnfermedades([]));
    }, []);

    // ── Reset filtros cuando cambia entidad ──────────────────────────────────
    useEffect(() => {
        setPharmacySearch(""); setEstadoInventario(""); setTipoMovimiento("");
        setPharmacyData([]); setPharmacyPage(1); setPharmacyLastPage(1); setPharmacyTotal(0);
        setCitasData([]); setCitasPage(1); setCitasLastPage(1); setCitasTotal(0);
        setCitasSearch(""); setCitasEstado(""); setIdMotivo(""); setIdMedico(""); setIdEspecialidad(""); setCodigoIcd("");
        setCitasDateFrom(""); setCitasDateTo("");
        setSelectedFarmacia("");
    }, [entity]);

    // ── Fetch de Farmacia (directo a /farmacia/reportes) ─────────────────────
    const fetchPharmacyData = useCallback(async () => {
        if (!isPharmacy(entity)) return;
        setPharmacyLoading(true);
        try {
            const realEntity = entity === "farmacia_inventario" ? "inventario" : "movimientos";
            const params = { page: pharmacyPage };
            if (pharmacySearch.trim()) params.search = pharmacySearch;
            if (selectedFarmacia) params.nit_farmacia = selectedFarmacia;
            if (entity === "farmacia_inventario" && estadoInventario) params.estado = estadoInventario;
            if (entity === "farmacia_movimientos" && tipoMovimiento) params.tipo = tipoMovimiento;

            // Usar el endpoint de reportes de farmacia pero con nit_farmacia personalizado
            // El admin no tiene farmacia propia, así que enviamos nit_farmacia
            const res = await api.get(`/farmacia/reportes/${realEntity}`, { params });
            setPharmacyData(res.data || []);
            setPharmacyTotal(res.total || 0);
            setPharmacyLastPage(res.last_page || 1);
        } catch (err) {
            console.error("Error fetching pharmacy report:", err);
            setPharmacyData([]);
        } finally {
            setPharmacyLoading(false);
        }
    }, [entity, pharmacyPage, pharmacySearch, selectedFarmacia, estadoInventario, tipoMovimiento]);

    useEffect(() => {
        if (isPharmacy(entity)) {
            const t = setTimeout(fetchPharmacyData, 400);
            return () => clearTimeout(t);
        }
    }, [fetchPharmacyData, entity]);

    // ── Fetch de Citas (directo a /personal/reportes/citas) ──────────────────
    const fetchCitasData = useCallback(async () => {
        if (!isCitas(entity)) return;
        setCitasLoading(true);
        try {
            const params = { page: citasPage };
            if (citasSearch.trim()) params.search = citasSearch;
            if (citasEstado) params.id_estado = citasEstado;
            if (citasDateFrom) params.date_from = citasDateFrom;
            if (citasDateTo) params.date_to = citasDateTo;
            if (idMotivo) params.id_motivo = idMotivo;
            if (idMedico) params.id_medico = idMedico;
            if (idEspecialidad) params.id_especialidad = idEspecialidad;
            if (citasEstado === "10" && codigoIcd) params.codigo_icd = codigoIcd;

            const res = await api.get(`/personal/reportes/citas`, { params });
            setCitasData(res.data?.data || res.data || []);
            setCitasTotal(res.data?.total || res.total || 0);
            setCitasLastPage(res.data?.last_page || res.last_page || 1);
        } catch (err) {
            console.error("Error fetching citas report:", err);
            setCitasData([]);
        } finally {
            setCitasLoading(false);
        }
    }, [entity, citasPage, citasSearch, citasEstado, citasDateFrom, citasDateTo, idMotivo, idMedico, idEspecialidad, codigoIcd]);

    useEffect(() => {
        if (isCitas(entity)) {
            const t = setTimeout(fetchCitasData, 400);
            return () => clearTimeout(t);
        }
    }, [fetchCitasData, entity]);

    // ── Exportar PDF ─────────────────────────────────────────────────────────
    const handleExportPDF = async () => {
        try {
            let url, params;

            if (isCitas(entity)) {
                params = new URLSearchParams();
                if (citasSearch) params.append("search", citasSearch);
                if (citasEstado) params.append("id_estado", citasEstado);
                if (citasDateFrom) params.append("date_from", citasDateFrom);
                if (citasDateTo) params.append("date_to", citasDateTo);
                if (idMotivo) params.append("id_motivo", idMotivo);
                if (idMedico) params.append("id_medico", idMedico);
                if (idEspecialidad) params.append("id_especialidad", idEspecialidad);
                if (citasEstado === "10" && codigoIcd) params.append("codigo_icd", codigoIcd);
                url = `/personal/reportes/citas/export`;
            } else if (isPharmacy(entity)) {
                const realEntity = entity === "farmacia_inventario" ? "inventario" : "movimientos";
                params = new URLSearchParams();
                if (pharmacySearch) params.append("search", pharmacySearch);
                if (selectedFarmacia) params.append("nit_farmacia", selectedFarmacia);
                if (entity === "farmacia_inventario" && estadoInventario) params.append("estado", estadoInventario);
                if (entity === "farmacia_movimientos" && tipoMovimiento) params.append("tipo", tipoMovimiento);
                url = `/farmacia/reportes/${realEntity}/export`;
            } else {
                params = new URLSearchParams();
                if (search) params.append("search", search);
                if (idEstado) params.append("id_estado", idEstado);
                if (idRol) params.append("id_rol", idRol);
                if (nitFarmacia) params.append("nit_farmacia", nitFarmacia);
                if (dateFrom) params.append("date_from", dateFrom);
                if (dateTo) params.append("date_to", dateTo);
                url = `/reportes/${entity}/export`;
            }

            const blob = await api.get(url, { params, responseType: 'blob' });
            const objectUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = objectUrl;
            link.setAttribute('download', `reporte_${entity}_${Date.now()}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error al exportar PDF:", error);
            Swal.fire({ title: "Error de Exportación", text: "No se pudo generar el archivo PDF.", icon: "error", confirmButtonColor: "#2563eb" });
        }
    };

    // ── Columnas para el modo genérico ───────────────────────────────────────
    const genericColumns = useMemo(() => {
        if (!meta?.columns) return [];
        return Object.entries(meta.columns).map(([key, label]) => ({
            key, header: label,
            render: (row) => {
                const value = key.split('.').reduce((acc, part) => acc && acc[part], row);
                if (key === 'created_at' && value) return new Date(value).toLocaleDateString("es-CO");
                if (key.includes('nombre_estado') || key === 'id_estado') {
                    const isActivo = row.id_estado === 1;
                    return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${isActivo ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300" : "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"}`}>{value || (isActivo ? 'Activo' : 'Inactivo')}</span>;
                }
                return <span className={key.includes('id') || key.includes('documento') || key.includes('nit') ? 'font-mono text-xs text-gray-500' : ''}>{value || "–"}</span>;
            }
        }));
    }, [meta]);

    // ── Valores actuales según entidad activa ─────────────────────────────────
    const currentData = isCitas(entity) ? citasData : isPharmacy(entity) ? pharmacyData : genericData;
    const currentLoading = isCitas(entity) ? citasLoading : isPharmacy(entity) ? pharmacyLoading : genericLoading;
    const currentTotal = isCitas(entity) ? citasTotal : isPharmacy(entity) ? pharmacyTotal : genericTotal;
    const currentColumns = isCitas(entity) ? citasColumns : isPharmacy(entity) ? getPharmacyColumns(entity) : genericColumns;
    const currentLastPage = isCitas(entity) ? citasLastPage : isPharmacy(entity) ? pharmacyLastPage : lastPage;
    const currentPage = isCitas(entity) ? citasPage : isPharmacy(entity) ? pharmacyPage : page;
    const currentSetPage = isCitas(entity) ? setCitasPage : isPharmacy(entity) ? setPharmacyPage : setPage;

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl">
            {/* ── Encabezado ─────────────────────────────────────────────────── */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                <PrincipalText icon={<AnalyticsRoundedIcon sx={{ fontSize: '2.5rem' }} />} text={meta?.report_title || entityOptions.find(o => o.value === entity)?.label || "Reporte"} number={currentTotal} />
                <div className="w-full sm:w-auto flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 p-2.5 px-4 rounded-xl border border-neutral-gray-border/20 dark:border-gray-700">
                    <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">Ver reporte de:</span>
                    <select
                        value={entity}
                        onChange={(e) => setEntity(e.target.value)}
                        className="bg-transparent border-none text-sm focus:ring-0 focus:outline-none cursor-pointer font-bold text-primary dark:text-blue-400 appearance-none pr-4 w-full"
                    >
                        {entityOptions.map(opt => (
                            <option key={opt.value} value={opt.value} className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 py-1.5 font-medium">{opt.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* ── Panel de Filtros ────────────────────────────────────────────── */}
            <div className="mb-6 space-y-4">

                {/* Fila principal: buscador + botón PDF + filtros de estado */}
                <div className="flex flex-wrap gap-4 items-center justify-between">
                    <div className="w-full md:w-80">
                        <Input
                            placeholder="Buscar en este reporte..."
                            icon="search"
                            value={isCitas(entity) ? citasSearch : isPharmacy(entity) ? pharmacySearch : search}
                            onChange={(e) => {
                                const v = e.target.value;
                                if (isCitas(entity)) { setCitasSearch(v); setCitasPage(1); }
                                else if (isPharmacy(entity)) { setPharmacySearch(v); setPharmacyPage(1); }
                                else { setSearch(v); setPage(1); }
                            }}
                        />
                    </div>

                    <div className="flex-1 w-full lg:w-auto flex flex-wrap lg:justify-end gap-3">
                        <button
                            onClick={handleExportPDF}
                            className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-sm shadow-red-200 dark:shadow-none"
                        >
                            <PictureAsPdfRoundedIcon sx={{ fontSize: '1.125rem' }} />
                            <span className="hidden sm:inline">Exportar PDF</span>
                        </button>

                        {/* Filtro Estado — según entidad */}
                        {!isPharmacy(entity) && (
                            <Filter
                                value={isCitas(entity) ? citasEstado : idEstado}
                                onChange={(v) => {
                                    if (isCitas(entity)) { setCitasEstado(v); setCitasPage(1); }
                                    else { setIdEstado(v); setPage(1); }
                                }}
                                options={isCitas(entity) ? statusOptions.citas : statusOptions.default}
                                placeholder="Filtrar por estado"
                            />
                        )}

                        {/* Filtro por Rol — solo usuarios */}
                        <AnimatePresence>
                            {entity === "usuario" && (
                                <motion.div key="rol-filter" initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} className="overflow-hidden">
                                    <div className="relative">
                                        <select value={idRol} onChange={(e) => { setIdRol(e.target.value); setPage(1); }} className="appearance-none w-full bg-gray-50 dark:bg-gray-800 border border-neutral-gray-border/50 dark:border-gray-700 rounded-lg shadow-sm py-2.5 pl-4 pr-10 focus:ring-2 focus:ring-primary/50 outline-none dark:text-white">
                                            <option value="">Todos los roles</option>
                                            {roles.map(r => <option key={r.id_rol} value={r.id_rol}>{r.tipo_usu}</option>)}
                                        </select>
                                        <ExpandMoreRoundedIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-gray-text/70 dark:text-gray-300 pointer-events-none" />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Filtro Inventario Estado */}
                        <AnimatePresence>
                            {entity === "farmacia_inventario" && (
                                <motion.div key="inv-estado" initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} className="overflow-hidden">
                                    <Filter value={estadoInventario} onChange={(v) => { setEstadoInventario(v); setPharmacyPage(1); }} options={estadoInventarioOptions} placeholder="Estado de stock" />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Filtro Movimientos Tipo */}
                        <AnimatePresence>
                            {entity === "farmacia_movimientos" && (
                                <motion.div key="mov-tipo" initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} className="overflow-hidden">
                                    <Filter value={tipoMovimiento} onChange={(v) => { setTipoMovimiento(v); setPharmacyPage(1); }} options={tipoMovimientoOptions} placeholder="Tipo de movimiento" />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Selector de Farmacia — para inventario y movimientos */}
                        <AnimatePresence>
                            {isPharmacy(entity) && (
                                <motion.div key="farmacia-filter" initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} className="overflow-hidden">
                                    <div className="relative">
                                        <select value={selectedFarmacia} onChange={(e) => { setSelectedFarmacia(e.target.value); setPharmacyPage(1); }} className="appearance-none w-full bg-gray-50 dark:bg-gray-800 border border-neutral-gray-border/50 dark:border-gray-700 rounded-lg shadow-sm py-2.5 pl-4 pr-10 focus:ring-2 focus:ring-primary/50 outline-none dark:text-white">
                                            <option value="">Todas las farmacias</option>
                                            {farmacias.map(f => <option key={f.nit} value={f.nit}>{f.nombre}</option>)}
                                        </select>
                                        <StorefrontRoundedIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-gray-text/70 dark:text-gray-300 pointer-events-none" />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* ── Filtros Avanzados para Citas ──────────────────────────── */}
                <AnimatePresence>
                    {isCitas(entity) && (
                        <motion.div key="citas-filters" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/20">
                            <SearchableSelect
                                key={`motivo-${motivos.length}`}
                                value={idMotivo}
                                onChange={(v) => { setIdMotivo(v); setCitasPage(1); }}
                                options={[{ value: "", label: "Todos los motivos" }, ...motivos]}
                                placeholder="Motivo de consulta..."
                            />
                            <SearchableSelect
                                key={`medico-${medicos.length}`}
                                value={idMedico}
                                onChange={(v) => { setIdMedico(v); setCitasPage(1); }}
                                options={[{ value: "", label: "Todos los médicos" }, ...medicos]}
                                placeholder="Buscar médico..."
                            />
                            <SearchableSelect
                                key={`especialidad-${especialidades.length}`}
                                value={idEspecialidad}
                                onChange={(v) => { setIdEspecialidad(v); setCitasPage(1); }}
                                options={[{ value: "", label: "Todas las especialidades" }, ...especialidades]}
                                placeholder="Especialidad..."
                            />
                            {citasEstado === "10" && (
                                <SearchableSelect
                                    value={codigoIcd}
                                    onChange={(v) => { setCodigoIcd(v); setCitasPage(1); }}
                                    options={[{ value: "", label: "Todos los diagnósticos" }, ...enfermedades.map(e => ({ value: e.codigo_icd, label: `[${e.codigo_icd}] ${e.nombre}` }))]}
                                    placeholder="Diagnóstico (ICD)..."
                                />
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Rango de Fechas (Citas y entidades genéricas con has_dates) ── */}
                <AnimatePresence>
                    {(isCitas(entity) || meta?.has_dates) && (
                        <motion.div key="dates" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex flex-col sm:flex-row flex-wrap gap-4 items-start sm:items-center bg-primary/5 dark:bg-primary/10 p-4 rounded-xl border border-primary/10">
                            <div className="flex items-center gap-2">
                                <CalendarMonthRoundedIcon sx={{ fontSize: '1.25rem' }} className="text-primary" />
                                <span className="text-sm font-semibold text-primary/80">Rango de fechas:</span>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                                <input type="date" value={isCitas(entity) ? citasDateFrom : dateFrom} onChange={(e) => { if (isCitas(entity)) setCitasDateFrom(e.target.value); else setDateFrom(e.target.value); }} className="w-full sm:w-auto text-sm dark:text-white border border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-lg p-2 outline-none" />
                                <span className="hidden sm:inline text-gray-400 font-medium">─</span>
                                <input type="date" value={isCitas(entity) ? citasDateTo : dateTo} onChange={(e) => { if (isCitas(entity)) setCitasDateTo(e.target.value); else setDateTo(e.target.value); }} className="w-full sm:w-auto text-sm dark:text-white border border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-lg p-2 outline-none" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ── Tabla ─────────────────────────────────────────────────────── */}
            <AnimatePresence mode="wait">
                {currentLoading ? (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <TableSkeleton rows={8} columns={currentColumns.length || 5} />
                    </motion.div>
                ) : (
                    <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        {currentData.length === 0 ? (
                            <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                                <QueryStatsRoundedIcon sx={{ fontSize: '3.75rem' }} className="text-gray-300 dark:text-gray-700 mb-4 block mx-auto" />
                                <p className="text-gray-500 dark:text-gray-400 font-medium">No se encontraron resultados para los criterios seleccionados.</p>
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-gray-800 border border-neutral-gray-border/20 dark:border-gray-700 shadow-sm overflow-hidden rounded-xl">
                                <DataTable columns={currentColumns} data={currentData} />
                            </div>
                        )}

                        {/* Paginación */}
                        {currentLastPage > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-8">
                                <button disabled={currentPage === 1} onClick={() => currentSetPage(p => Math.max(1, p - 1))} className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                                    <ChevronLeftRoundedIcon />
                                </button>
                                <div className="flex gap-1">
                                    {Array.from({ length: Math.min(currentLastPage, 7) }, (_, i) => i + 1).map(p => (
                                        <button key={p} onClick={() => currentSetPage(p)} className={`w-10 h-10 rounded-lg transition-all text-sm font-bold ${currentPage === p ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"}`}>{p}</button>
                                    ))}
                                </div>
                                <button disabled={currentPage === currentLastPage} onClick={() => currentSetPage(p => Math.min(currentLastPage, p + 1))} className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                                    <ChevronRightRoundedIcon />
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
