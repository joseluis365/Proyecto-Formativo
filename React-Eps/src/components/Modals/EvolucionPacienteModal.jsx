import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from "recharts";
import { toPng } from "html-to-image";
import api from "@/Api/axios";
import Swal from "sweetalert2";

// ── Mapeo de parámetros con etiqueta y unidad ─────────────────────────────────
const VITALS_CONFIG = [
    { key: "ta_sistolica",  label: "Tensión Arterial Sistólica",  unit: "mmHg", color: "#ef4444" },
    { key: "ta_diastolica", label: "Tensión Arterial Diastólica", unit: "mmHg", color: "#f97316" },
    { key: "fc",            label: "Frecuencia Cardiaca",          unit: "lpm",  color: "#8b5cf6" },
    { key: "fr",            label: "Frecuencia Respiratoria",       unit: "rpm",  color: "#0ea5e9" },
    { key: "temperatura",   label: "Temperatura Corporal",          unit: "°C",   color: "#f59e0b" },
    { key: "peso",          label: "Peso",                          unit: "kg",   color: "#10b981" },
    { key: "talla",         label: "Talla",                         unit: "m",    color: "#6366f1" },
    { key: "saturacion_o2", label: "Saturación de Oxígeno (SpO₂)", unit: "%",    color: "#14b8a6" },
];

const formatFecha = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "2-digit" });
};

// Tooltip personalizado
const CustomTooltip = ({ active, payload, label, unit }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl px-3 py-2 text-xs">
                <p className="font-bold text-gray-500 dark:text-gray-400 mb-1">{formatFecha(label)}</p>
                <p className="font-black text-primary text-sm">
                    {payload[0].value} <span className="font-normal text-gray-500">{unit}</span>
                </p>
            </div>
        );
    }
    return null;
};

// Componente de una sola gráfica
function VitalChart({ config, data, chartRef }) {
    const chartData = data
        .filter(d => d[config.key] !== undefined && d[config.key] !== null)
        .map(d => ({ fecha: d.fecha, value: Number(d[config.key]) }));

    if (chartData.length === 0) return null;

    return (
        <div ref={chartRef} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: config.color }} />
                <h4 className="text-sm font-bold text-gray-700 dark:text-gray-200">
                    {config.label}
                    <span className="ml-2 text-xs font-normal text-gray-400 dark:text-gray-500">({config.unit})</span>
                </h4>
            </div>
            <ResponsiveContainer width="100%" height={120}>
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                        dataKey="fecha"
                        tickFormatter={formatFecha}
                        tick={{ fontSize: 9, fill: "#9ca3af" }}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fontSize: 9, fill: "#9ca3af" }}
                        tickLine={false}
                        axisLine={false}
                        width={35}
                    />
                    <Tooltip content={<CustomTooltip unit={config.unit} />} />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke={config.color}
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: config.color, strokeWidth: 0 }}
                        activeDot={{ r: 6, strokeWidth: 0, fill: config.color }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default function EvolucionPacienteModal({ doc, pacienteNombre, onClose }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);

    // Refs para capturar las gráficas
    const chartRefs = useRef({});

    const setChartRef = useCallback((key) => (el) => {
        chartRefs.current[key] = el;
    }, []);

    useEffect(() => {
        const fetchEvolucion = async () => {
            try {
                const res = await api.get(`/paciente/${doc}/historial/evolucion`);
                const payload = res.data ?? res;
                setData(payload);
            } catch {
                Swal.fire("Error", "No se pudo cargar la evolución clínica.", "error");
                onClose();
            } finally {
                setLoading(false);
            }
        };
        fetchEvolucion();
    }, [doc, onClose]);

    const handleDownloadPdf = async () => {
        setDownloading(true);
        try {
            // 1. Capturar cada gráfica visible como PNG base64
            const graficas = [];
            for (const vConfig of VITALS_CONFIG) {
                const el = chartRefs.current[vConfig.key];
                if (!el) continue;
                try {
                    const png = await toPng(el, { quality: 0.95, backgroundColor: "#fff" });
                    // Remover el prefijo "data:image/png;base64,"
                    const base64 = png.split(",")[1];
                    graficas.push({ titulo: `${vConfig.label} (${vConfig.unit})`, imagen: base64 });
                } catch (e) {
                    console.warn(`No se pudo capturar gráfica ${vConfig.key}`, e);
                }
            }

            // 2. POST al backend con las imágenes
            const resp = await api.post(
                `/paciente/${doc}/historial/evolucion/pdf`,
                { graficas },
                { responseType: "blob" }
            );

            const url = window.URL.createObjectURL(new Blob([resp], { type: "application/pdf" }));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `evolucion_clinica_${doc}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Error generando PDF de evolución", err);
            Swal.fire("Error", "No se pudo generar el PDF de evolución.", "error");
        } finally {
            setDownloading(false);
        }
    };

    const signos = data?.signos_vitales ?? [];
    const evolucionDiagnostica = data?.evolucion_diagnostica ?? [];

    // Filtrar los signos que tienen al menos un dato real
    const activeVitals = VITALS_CONFIG.filter(cfg =>
        signos.some(s => s[cfg.key] !== undefined && s[cfg.key] !== null)
    );

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center overflow-y-auto py-6 px-4"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: 20 }}
                    transition={{ duration: 0.25 }}
                    className="bg-white dark:bg-gray-900 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-linear-to-r from-primary to-blue-600 text-white px-6 py-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-black flex items-center gap-2">
                                <span className="material-symbols-outlined text-xl">monitoring</span>
                                Evolución Clínica
                            </h2>
                            <p className="text-xs text-blue-100 mt-0.5">{pacienteNombre}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl hover:bg-white/20 transition-colors cursor-pointer"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        {loading ? (
                            <div className="space-y-4 animate-pulse">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-40 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
                                ))}
                            </div>
                        ) : (activeVitals.length === 0 && evolucionDiagnostica.length === 0) ? (
                            // No hay ninguna cita registrada para el paciente
                            <div className="text-center py-16 space-y-3">
                                <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600 block">event_busy</span>
                                <p className="text-base font-bold text-gray-500 dark:text-gray-400">No hay evolución disponible</p>
                                <p className="text-sm text-gray-400 dark:text-gray-500 max-w-xs mx-auto">
                                    Este paciente no tiene citas médicas registradas. La evolución clínica se construye a partir de las atenciones realizadas.
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Gráficas de signos vitales */}
                                <div>
                                    <h3 className="text-sm font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary text-base">show_chart</span>
                                        Signos Vitales
                                    </h3>
                                    {activeVitals.length > 0 ? (
                                        <div className="space-y-3">
                                            {activeVitals.map(cfg => (
                                                <VitalChart
                                                    key={cfg.key}
                                                    config={cfg}
                                                    data={signos}
                                                    chartRef={setChartRef(cfg.key)}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-10 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl text-gray-400 dark:text-gray-500">
                                            <span className="material-symbols-outlined text-4xl block mb-2">monitor_heart</span>
                                            <p className="text-sm">No hay signos vitales registrados para este paciente.</p>
                                            <p className="text-xs mt-1 opacity-70">Los signos se registran durante cada consulta médica.</p>
                                        </div>
                                    )}
                                </div>

                                {/* Evolución diagnóstica */}
                                <div>
                                    <h3 className="text-sm font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary text-base">history</span>
                                        Evolución Diagnóstica y Terapéutica
                                    </h3>
                                    {evolucionDiagnostica.length > 0 ? (
                                        <div className="space-y-3">
                                            {evolucionDiagnostica.map((ev, idx) => (
                                                <div
                                                    key={idx}
                                                    className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 shadow-sm"
                                                >
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                                                        <span className="text-xs font-black text-primary uppercase tracking-wider">
                                                            {formatFecha(ev.fecha)}
                                                        </span>
                                                    </div>
                                                    {ev.diagnosticos?.length > 0 && (
                                                        <div className="flex flex-wrap gap-1.5 mb-2">
                                                            {ev.diagnosticos.map((d, i) => (
                                                                <span
                                                                    key={i}
                                                                    className="text-[10px] bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-lg font-bold border border-blue-100 dark:border-blue-800/30"
                                                                >
                                                                    {d}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {ev.tratamiento && (
                                                        <div className="bg-gray-50 dark:bg-gray-700/40 border-l-2 border-primary/40 pl-3 py-1.5 mt-2 rounded-r-lg">
                                                            <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold mb-0.5">Tratamiento</p>
                                                            <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                                                                {ev.tratamiento}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl text-gray-400 dark:text-gray-500">
                                            <span className="material-symbols-outlined text-4xl block mb-2">medical_services</span>
                                            <p className="text-sm">No hay diagnósticos registrados.</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Footer con descarga */}
                    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex justify-between items-center gap-3">
                        <p className="text-xs text-gray-400 dark:text-gray-500 italic">
                            Las gráficas se capturan en tiempo real para el PDF.
                        </p>
                        <button
                            onClick={handleDownloadPdf}
                            disabled={downloading || loading}
                            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-bold text-sm rounded-xl hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {downloading ? (
                                <>
                                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Generando PDF...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-lg">download</span>
                                    Descargar Evolución (PDF)
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
// Remove unused import ReferenceLine
