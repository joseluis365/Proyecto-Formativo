import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UpcomingCitaCard from "../../components/Dashboard/UpcomingCitaCard";
import SolicitudCitaRow from "../../components/Dashboard/SolicitudCitaRow";

// ─── Shared layout helpers (same visual language as Dashboard) ─────────────────

function PageContainer({ children }) {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
                {children}
            </div>
        </div>
    );
}

function SectionCard({ title, subtitle, children }) {
    return (
        <section className="flex flex-col gap-4">
            <div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-white">{title}</h2>
                {subtitle && (
                    <p className="text-sm text-slate-500 dark:text-gray-400 mt-0.5">{subtitle}</p>
                )}
            </div>
            {children}
        </section>
    );
}

// ─── State-badge helper ────────────────────────────────────────────────────────

function EstadoBadge({ estado }) {
    const variants = {
        realizada: {
            cls: "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800",
            icon: "check_circle",
        },
        cancelada: {
            cls: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800",
            icon: "cancel",
        },
        noAsistio: {
            cls: "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800",
            icon: "warning",
        },
        default: {
            cls: "text-slate-600 dark:text-gray-400 bg-slate-100 dark:bg-gray-800 border-slate-200 dark:border-gray-700",
            icon: "info",
        },
    };

    const key = estado?.toLowerCase().replace(/\s/g, "");
    const v =
        variants[key] ||
        variants[
        Object.keys(variants).find((k) =>
            key?.includes(k.replace(/([A-Z])/g, (m) => m.toLowerCase()))
        )
        ] ||
        variants.default;

    return (
        <span
            className={`inline-flex items-center gap-1.5 text-[10px] font-bold border rounded-full px-2.5 py-1 uppercase tracking-wider ${v.cls}`}
        >
            <span className="material-symbols-outlined fill" style={{ fontSize: "12px" }}>
                {v.icon}
            </span>
            {estado}
        </span>
    );
}

// ─── Empty state widget ────────────────────────────────────────────────────────

function EmptyState({ icon, title, description }) {
    return (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-900/30 py-10 text-center">
            <span
                className="material-symbols-outlined text-slate-300 dark:text-gray-600"
                style={{ fontSize: "40px" }}
            >
                {icon}
            </span>
            <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-gray-400">{title}</p>
                <p className="text-xs text-slate-400 dark:text-gray-500 mt-0.5">{description}</p>
            </div>
        </div>
    );
}

// ─── Skeleton loaders ─────────────────────────────────────────────────────────

function CardSkeleton({ count = 2, height = "h-36" }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className={`rounded-2xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-700 ${height} animate-pulse`}
                />
            ))}
        </div>
    );
}

function RowSkeleton({ count = 2 }) {
    return (
        <div className="flex flex-col gap-3">
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="rounded-2xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-700 h-20 animate-pulse"
                />
            ))}
        </div>
    );
}

// ─── Historial table ──────────────────────────────────────────────────────────

function HistorialTable({ historial }) {
    if (!historial.length) {
        return (
            <EmptyState
                icon="history"
                title="Sin historial"
                description="Aún no tienes citas anteriores registradas."
            />
        );
    }

    return (
        <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900/60 shadow-sm">
            {/* Header */}
            <div className="grid grid-cols-4 px-5 py-3 bg-slate-50 dark:bg-gray-800/60 border-b border-slate-200 dark:border-gray-700">
                {["Fecha", "Doctor", "Especialidad", "Estado"].map((h) => (
                    <span key={h} className="text-xs font-semibold text-slate-400 dark:text-gray-500 uppercase tracking-wider">
                        {h}
                    </span>
                ))}
            </div>

            {/* Rows */}
            <div className="divide-y divide-slate-100 dark:divide-gray-800">
                {historial.map((cita, idx) => (
                    <div
                        key={idx}
                        className="grid grid-cols-4 items-center px-5 py-4 hover:bg-slate-50/60 dark:hover:bg-gray-800/30 transition-colors"
                    >
                        <span className="text-sm text-slate-700 dark:text-gray-200 font-medium">{cita.fecha}</span>
                        <span className="text-sm text-sky-500 dark:text-sky-400 font-medium">{cita.doctorName}</span>
                        <span className="text-sm text-slate-500 dark:text-gray-400">{cita.especialidad}</span>
                        <EstadoBadge estado={cita.estado} />
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Main Citas Page ──────────────────────────────────────────────────────────

export default function Citas() {
    const navigate = useNavigate();

    // ── State — all driven by API data (null/[] = loading or empty) ────────────
    /**
     * proximasCitas:  citas with estado === "agendada" AND future date/time
     * solicitudes:    citas with estado === "pendiente"
     * historial:      ALL past/completed/cancelled citas
     */
    const [proximasCitas, setProximasCitas] = useState([]);
    const [solicitudes, setSolicitudes] = useState([]);
    const [historial, setHistorial] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // TODO: Replace with real API call, e.g.:
        // const { data } = await api.get('/citas');
        // const now = new Date();
        //
        // setProximasCitas(
        //   data.filter(c =>
        //     c.estado?.toLowerCase() === 'agendada' &&
        //     new Date(`${c.fecha}T${c.hora}`) > now
        //   )
        // );
        // setSolicitudes(data.filter(c => c.estado?.toLowerCase() === 'pendiente'));
        // setHistorial(data.filter(c => !['agendada','pendiente'].includes(c.estado?.toLowerCase())));
        setLoading(false);
    }, []);

    const handleViewDetails = (id) => {
        // TODO: navigate to detail page or open modal
        console.log("Ver detalles cita:", id);
    };

    const handleCancel = (id) => {
        // TODO: call API to cancel solicitud, then refresh list
        console.log("Cancelar solicitud:", id);
    };

    return (
        <PageContainer>

            {/* ── Page header ── */}
            <div>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Citas</h1>
                <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
                    Gestiona tus solicitudes y consulta tu historial de citas médicas.
                </p>
            </div>

            {/* ── SECTION 1: Próximas citas (estado: agendada + fecha futura) ── */}
            <SectionCard
                title="Próximas citas"
                subtitle="Citas confirmadas con fecha y hora asignada"
            >
                {loading ? (
                    <CardSkeleton count={2} height="h-48" />
                ) : proximasCitas.length === 0 ? (
                    <EmptyState
                        icon="calendar_month"
                        title="Sin próximas citas"
                        description="No tienes citas confirmadas próximamente."
                    />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {proximasCitas.map((cita, idx) => (
                            <UpcomingCitaCard
                                key={cita.id ?? idx}
                                cita={cita}
                                onViewDetails={() => handleViewDetails(cita.id)}
                            />
                        ))}
                    </div>
                )}
            </SectionCard>

            {/* ── SECTION 2: Solicitudes de cita (estado: pendiente) ── */}
            <SectionCard
                title="Solicitudes de cita"
                subtitle="Solicitudes en espera de confirmación"
            >
                {loading ? (
                    <RowSkeleton count={2} />
                ) : solicitudes.length === 0 ? (
                    <EmptyState
                        icon="pending_actions"
                        title="Sin solicitudes pendientes"
                        description="No tienes solicitudes de cita en espera."
                    />
                ) : (
                    <div className="flex flex-col gap-3">
                        {solicitudes.map((sol, idx) => (
                            <SolicitudCitaRow
                                key={sol.id ?? idx}
                                solicitud={sol}
                                onCancel={() => handleCancel(sol.id)}
                                onViewDetails={() => handleViewDetails(sol.id)}
                            />
                        ))}
                    </div>
                )}
            </SectionCard>

            {/* ── SECTION 3: Historial de citas (todas las pasadas) ── */}
            <SectionCard
                title="Historial de citas"
                subtitle="Registro completo de tus atenciones médicas"
            >
                {loading ? (
                    <div className="rounded-2xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-700 h-40 animate-pulse" />
                ) : (
                    <HistorialTable historial={historial} />
                )}
            </SectionCard>

        </PageContainer>
    );
}