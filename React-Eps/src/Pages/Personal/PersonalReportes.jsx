import { useState, useEffect, useMemo } from "react";
import { useLayout } from "../../LayoutContext";
import { useHelp } from "../../hooks/useHelp";
import DataTable from "../../components/UI/DataTable";
import Input from "../../components/UI/Input";
import Filter from "../../components/UI/Filter";
import TableSkeleton from "../../components/UI/TableSkeleton";
import PrincipalText from "../../components/Users/PrincipalText";
import SearchableSelect from "../../components/UI/SearchableSelect";
import { AnimatePresence, motion } from "framer-motion";
import api from "../../Api/axios";
import Swal from "sweetalert2";

const entityOptions = [
    { value: "pacientes", label: "Pacientes" },
    { value: "citas", label: "Citas Médicas" },
    { value: "pqrs", label: "PQRS" }
];

const estadosCitas = [
    { value: "", label: "Todos los estados" },
    { value: "9", label: "Agendada" },
    { value: "10", label: "Atendida" },
    { value: "11", label: "Cancelada" },
    { value: "16", label: "Inasistencia" }
];

const estadosPacientes = [
    { value: "", label: "Todos los estados" },
    { value: "1", label: "Activo" },
    { value: "2", label: "Inactivo" }
];

const estadosPQRS = [
    { value: "", label: "Todos los estados" },
    { value: "13", label: "Pendiente" },
    { value: "10", label: "Atendido" }
];

export default function PersonalReportes() {
    const { setTitle, setSubtitle } = useLayout();

    useHelp({
        title: "Gestión de Reportes Administrativos",
        description: "Este módulo permite generar reportes detallados y consolidados sobre las diferentes entidades clave del sistema: Pacientes, Citas Médicas y PQRS.",
        sections: [
            {
                title: "¿Cómo funciona?",
                type: "text",
                content: "Selecciona una entidad de la lista desplegable (Pacientes, Citas o PQRS) para ver los registros correspondientes. Puedes aplicar múltiples filtros para refinar la búsqueda antes de exportar la información."
            },
            {
                title: "Uso de Filtros",
                type: "list",
                items: [
                    "Búsqueda: Filtra por nombre, documento o asunto según la entidad.",
                    "Estado: Filtra por el estado actual del registro (ej. Citas Atendidas).",
                    "Rango de Fechas: Útil para reportes mensuales o semanales específicos.",
                    "Filtros Especiales: Para citas atendidas, puedes filtrar por el diagnóstico médico registrado."
                ]
            },
            {
                title: "Pasos para generar un PDF",
                type: "steps",
                items: [
                    "Selecciona la entidad deseada en el primer selector.",
                    "Aplica los filtros de búsqueda, estado o fecha necesarios.",
                    "Haz clic en el botón azul 'Generar PDF' en la esquina superior derecha.",
                    "El archivo se descargará automáticamente con el formato oficial de la EPS."
                ]
            },
            {
                title: "Recomendaciones",
                type: "tip",
                content: "Para reportes más legibles, evita exportar miles de registros a la vez; utiliza los filtros de fecha para segmentar la información por periodos de tiempo manejables."
            },
            {
                title: "Seguridad de la Información",
                type: "warning",
                content: "Estos reportes contienen Datos Personales Sensibles. El manejo incorrecto de los archivos descargados puede violar las leyes de protección de datos."
            }
        ]
    });

    const [entity, setEntity] = useState("pacientes");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isFirstLoad, setIsFirstLoad] = useState(true);

    // Common Filters
    const [search, setSearch] = useState("");
    const [idEstado, setIdEstado] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    // Specific Filters for Citas
    const [idMotivo, setIdMotivo] = useState("");
    const [idMedico, setIdMedico] = useState("");
    const [idEspecialidad, setIdEspecialidad] = useState("");
    const [codigoIcd, setCodigoIcd] = useState("");

    // Lists for Selects
    const [motivos, setMotivos] = useState([]);
    const [medicos, setMedicos] = useState([]);
    const [especialidades, setEspecialidades] = useState([]);
    const [enfermedades, setEnfermedades] = useState([]);

    // Pagination
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        setTitle("Generador de Reportes");
        setSubtitle("Herramienta analítica para extraer listados e historial.");
        
        // Cargar selects iniciales
        api.get('/motivos-consulta').then(res => {
            // Con el interceptor, 'res' ya es el JSON body (data o data.data)
            const raw = Array.isArray(res) ? res : (res?.data || res || []);
            setMotivos(raw.map(m => ({
                value: m.value !== undefined ? m.value : m.id_motivo,
                label: m.label || m.motivo || "Sin nombre"
            })));
        }).catch(() => setMotivos([]));

        api.get('/usuarios', { params: { id_rol: 4, per_page: 500 } }).then(res => {
            const raw = res?.data || res || [];
            setMedicos(raw.map(m => ({
                value: m.documento,
                label: `${m.primer_nombre} ${m.primer_apellido}`
            })));
        }).catch(() => setMedicos([]));

        api.get('/especialidades').then(res => {
            const raw = Array.isArray(res) ? res : (res?.data || res || []);
            setEspecialidades(raw.map(e => ({
                value: e.value !== undefined ? e.value : e.id_especialidad,
                label: e.label || e.especialidad || "Sin nombre"
            })));
        }).catch(() => setEspecialidades([]));

        api.get('/enfermedades', { params: { per_page: 1000 } }).then(res => {
            const raw = res?.data || res || [];
            setEnfermedades(raw);
        }).catch(() => setEnfermedades([]));
    }, []);

    // Reset filtros cuando cambia la entidad
    useEffect(() => {
        setSearch("");
        setIdEstado("");
        setDateFrom("");
        setDateTo("");
        setIdMotivo("");
        setIdMedico("");
        setIdEspecialidad("");
        setCodigoIcd("");
        setPage(1);
        setIsFirstLoad(true);
    }, [entity]);

    const fetchReportData = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append('page', page);
            if (search) params.append('search', search);
            if (idEstado) params.append('id_estado', idEstado);
            if (dateFrom) params.append('date_from', dateFrom);
            if (dateTo) params.append('date_to', dateTo);
            
            if (entity === 'citas') {
                if (idMotivo) params.append('id_motivo', idMotivo);
                if (idMedico) params.append('id_medico', idMedico);
                if (idEspecialidad) params.append('id_especialidad', idEspecialidad);
                if (idEstado === "10" && codigoIcd) params.append('codigo_icd', codigoIcd);
            }

            const res = await api.get(`/personal/reportes/${entity}`, { params });
            const responseData = res.data;
            setData(responseData.data || responseData);
            setLastPage(responseData.last_page || 1);
            setTotal(responseData.total || responseData.length || 0);

        } catch (error) {
            console.error("Error fetching report data", error);
            setData([]);
        } finally {
            setLoading(false);
            setIsFirstLoad(false);
        }
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            fetchReportData();
        }, 500);
        return () => clearTimeout(handler);
    }, [entity, page, search, idEstado, dateFrom, dateTo, idMotivo, idMedico, idEspecialidad, codigoIcd]);

    const handleExportPDF = async () => {
        try {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (idEstado) params.append('id_estado', idEstado);
            if (dateFrom) params.append('date_from', dateFrom);
            if (dateTo) params.append('date_to', dateTo);
            
            if (entity === 'citas') {
                if (idMotivo) params.append('id_motivo', idMotivo);
                if (idMedico) params.append('id_medico', idMedico);
                if (idEspecialidad) params.append('id_especialidad', idEspecialidad);
                if (idEstado === "10" && codigoIcd) params.append('codigo_icd', codigoIcd);
            }

            const blob = await api.get(`/personal/reportes/${entity}/export`, {
                params,
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `reporte_${entity}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error al exportar PDF:", error);
            Swal.fire({ title: "Error", text: "No se pudo generar el PDF.", icon: "error" });
        }
    };

    const getColumns = () => {
        if (entity === 'pacientes') {
            return [
                { key: 'documento', header: 'Documento' },
                { key: 'nombre', header: 'Nombre', render: r => `${r.primer_nombre} ${r.primer_apellido}` },
                { key: 'email', header: 'Email' },
                { key: 'estado', header: 'Estado', render: r => r.id_estado === 1 ? 'Activo' : 'Inactivo' },
            ];
        }
        if (entity === 'citas') {
            return [
                { key: 'id_cita', header: 'N° Cita', render: r => `#${r.id_cita}` },
                { key: 'paciente', header: 'Paciente', render: r => r.paciente ? `${r.paciente.primer_nombre} ${r.paciente.primer_apellido}` : 'N/A' },
                { key: 'medico', header: 'Médico', render: r => r.medico ? `${r.medico.primer_nombre} ${r.medico.primer_apellido}` : 'N/A' },
                { key: 'fecha', header: 'Fecha', render: r => r.fecha ? new Date(r.fecha).toLocaleDateString() : 'N/A' },
                { key: 'estado', header: 'Estado', render: r => r.estado?.nombre_estado || 'N/A' },
            ];
        }
        if (entity === 'pqrs') {
            return [
                { key: 'id_pqr', header: 'ID', render: r => `#${r.id_pqr}` },
                { key: 'nombre_usuario', header: 'Remitente' },
                { key: 'asunto', header: 'Asunto' },
                { key: 'mensaje', header: 'Mensaje', render: r => r.mensaje ? (r.mensaje.length > 50 ? r.mensaje.substring(0, 50) + "..." : r.mensaje) : 'Sin mensaje' },
                { key: 'respuesta', header: 'Respuesta', render: r => r.respuesta ? (r.respuesta.length > 50 ? r.respuesta.substring(0, 50) + "..." : r.respuesta) : 'Sin respuesta' },
                { key: 'estado', header: 'Estado', render: r => r.estado?.nombre_estado || 'N/A' },
                { key: 'fecha', header: 'Fecha', render: r => r.created_at ? new Date(r.created_at).toLocaleDateString() : 'N/A' },
            ];
        }
        return [];
    };

    const columns = useMemo(() => getColumns(), [entity]);

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl p-2 sm:p-4">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                <PrincipalText icon="analytics" text={`Reporte de ${entityOptions.find(o => o.value === entity)?.label}`} number={total} />
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 p-2.5 px-4 rounded-xl border border-neutral-gray-border/20 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Ver reporte de:</span>
                    <select value={entity} onChange={(e) => setEntity(e.target.value)} className="bg-transparent border-none text-sm focus:ring-0 cursor-pointer font-bold text-primary dark:text-blue-400 appearance-none">
                        {entityOptions.map(opt => <option key={opt.value} value={opt.value} className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200">{opt.label}</option>)}
                    </select>
                </div>
            </div>

            {/* Filtros */}
            <div className="mb-6 space-y-4">
                <div className="flex flex-wrap gap-4 items-center justify-between">
                    <div className="w-full md:w-80">
                        <Input placeholder="Buscar en este reporte..." icon="search" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
                    </div>
                    <div className="flex-1 flex justify-end gap-3 flex-wrap">
                        <button onClick={handleExportPDF} className="bg-red-500 hover:bg-red-600 dark:bg-red-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
                            <span className="hidden sm:inline">Exportar PDF</span>
                        </button>
                        <Filter value={idEstado} onChange={(v) => { setIdEstado(v); setPage(1); }} options={entity === 'pacientes' ? estadosPacientes : entity === 'citas' ? estadosCitas : estadosPQRS} placeholder="Estado" />
                    </div>
                </div>

                {/* Filtros Citas con SearchableSelect */}
                <AnimatePresence>
                    {entity === "citas" && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-gray-50 dark:bg-gray-800/20 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                            <SearchableSelect
                                key={`motivo-${motivos.length}`}
                                value={idMotivo}
                                onChange={(v) => { setIdMotivo(v); setPage(1); }}
                                options={[
                                    { value: "", label: "Todos los motivos" },
                                    ...(Array.isArray(motivos) ? motivos : [])
                                ]}
                                placeholder="Motivo de consulta..."
                            />
                            
                            <SearchableSelect
                                key={`medico-${medicos.length}`}
                                value={idMedico}
                                onChange={(v) => { setIdMedico(v); setPage(1); }}
                                options={[
                                    { value: "", label: "Todos los médicos" },
                                    ...(Array.isArray(medicos) ? medicos : [])
                                ]}
                                placeholder="Buscar médico..."
                            />

                            <SearchableSelect
                                key={`especialidad-${especialidades.length}`}
                                value={idEspecialidad}
                                onChange={(v) => { setIdEspecialidad(v); setPage(1); }}
                                options={[
                                    { value: "", label: "Todas las especialidades" },
                                    ...(Array.isArray(especialidades) ? especialidades : [])
                                ]}
                                placeholder="Especialidad..."
                            />

                            {idEstado === "10" && (
                                <SearchableSelect
                                    value={codigoIcd}
                                    onChange={(v) => { setCodigoIcd(v); setPage(1); }}
                                    options={[
                                        { value: "", label: "Todos los diagnósticos" },
                                        ...enfermedades.map(e => ({ value: e.codigo_icd, label: `[${e.codigo_icd}] ${e.nombre}` }))
                                    ]}
                                    placeholder="Buscar diagnóstico ICD..."
                                />
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Fechas */}
                <AnimatePresence>
                    {(entity === "citas" || entity === "pqrs") && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex flex-wrap gap-4 items-center bg-primary/5 dark:bg-primary/10 p-4 rounded-xl border border-primary/10">
                            <span className="text-sm font-semibold text-primary/80">Rango de fechas:</span>
                            <div className="flex items-center gap-3">
                                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="text-sm dark:text-white border border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-lg p-2 outline-none" />
                                <span className="text-gray-400">─</span>
                                <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="text-sm dark:text-white border border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-lg p-2 outline-none" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Tabla con transición de opacidad */}
            <div className={`transition-opacity duration-300 ${loading && !isFirstLoad ? "opacity-30" : "opacity-100"}`}>
                {loading && isFirstLoad ? (
                    <TableSkeleton rows={8} columns={5} />
                ) : (
                    <div className="bg-white dark:bg-gray-800 border border-neutral-gray-border/20 dark:border-gray-700 shadow-sm overflow-hidden rounded-xl">
                        <DataTable columns={columns} data={data} />
                        {data.length === 0 && !loading && (
                            <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/30">
                                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4 block">query_stats</span>
                                <p className="text-gray-500">No hay resultados con estos filtros.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Paginación */}
            {lastPage > 1 && !isFirstLoad && (
                <div className="flex justify-center items-center gap-2 mt-6">
                    <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-2 rounded-lg border bg-white dark:bg-gray-800 disabled:opacity-30">
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <span className="text-sm font-bold dark:text-white">{page} / {lastPage}</span>
                    <button disabled={page === lastPage} onClick={() => setPage(p => p + 1)} className="p-2 rounded-lg border bg-white dark:bg-gray-800 disabled:opacity-30">
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>
            )}
        </div>
    );
}
