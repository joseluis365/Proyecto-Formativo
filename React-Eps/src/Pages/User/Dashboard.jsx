import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppointmentCard from "../../components/Dashboard/AppointmentCard";
import ActionCard from "../../components/Dashboard/ActionCard";
import MedicationCard from "../../components/Dashboard/MedicationCard";

// ─── Sub-components ────────────────────────────────────────────────────────────

/**
 * DashboardContainer — top-level page wrapper
 */
function DashboardContainer({ children }) {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
                {children}
            </div>
        </div>
    );
}

/**
 * SectionCard — generic titled section wrapper
 */
function SectionCard({ title, subtitle, action, children }) {
    return (
        <section className="flex flex-col gap-4">
            <div className="flex items-end justify-between">
                <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">{title}</h2>
                    {subtitle && (
                        <p className="text-sm text-slate-500 dark:text-gray-400 mt-0.5">{subtitle}</p>
                    )}
                </div>
                {action && action}
            </div>
            {children}
        </section>
    );
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────

export default function Dashboard() {
    const navigate = useNavigate();

    // ── State ──────────────────────────────────────────────────────────────────
    const [userName, setUserName] = useState("Paciente");
    const [appointment, setAppointment] = useState(null);   // null = no appointment
    const [medications, setMedications] = useState([]);
    const [loading, setLoading] = useState(true);

    // ── Load user data from localStorage (token/user) ──────────────────────────
    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) {
            try {
                const user = JSON.parse(stored);
                setUserName(user.nombre || user.name || "Paciente");
            } catch {
                setUserName("Paciente");
            }
        }
        // TODO: Replace with real API calls
        // fetchDashboardData();
        setLoading(false);
    }, []);

    // ─── Actions ──────────────────────────────────────────────────────────────
    const handleRequestAppointment = () => navigate("/Usuarios-Solicitudes");
    const handleViewResults = () => navigate("/Usuarios-Ordenes");
    const handleViewAppointmentDetails = () => navigate("/Usuarios-Solicitudes");

    // ──────────────────────────────────────────────────────────────────────────
    return (
        <DashboardContainer>

            {/* ── SECTION 1: Welcome + Next Appointment ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Left — Greeting */}
                <div className="flex flex-col justify-center rounded-2xl bg-linear-to-br from-blue-50 to-sky-100 dark:from-gray-800/60 dark:to-gray-900/60 border border-blue-100 dark:border-gray-700 shadow-sm px-8 py-8 gap-2 min-h-[160px]">
                    <p className="text-sm font-medium text-slate-500 dark:text-gray-400">
                        {getGreeting()},
                    </p>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                        {loading ? (
                            <span className="inline-block w-40 h-8 rounded-lg bg-slate-200 dark:bg-gray-700 animate-pulse" />
                        ) : (
                            <>
                                <span>{userName.split(" ")[0]}</span>
                                <span className="text-primary">.</span>
                            </>
                        )}
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
                        Bienvenido a tu espacio de salud personal.
                    </p>
                </div>

                {/* Right — Next Appointment */}
                {loading ? (
                    <div className="rounded-2xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-700 shadow-sm min-h-[160px] animate-pulse" />
                ) : (
                    <AppointmentCard
                        appointment={appointment}
                        onViewDetails={handleViewAppointmentDetails}
                    />
                )}
            </div>

            {/* ── SECTION 2: Quick Actions ── */}
            <SectionCard title="Acciones Rápidas">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ActionCard
                        icon="add_circle"
                        title="Solicitar Cita"
                        description="Agenda una nueva cita médica con un especialista."
                        bgColor="bg-blue-50 dark:bg-blue-900/20"
                        iconColor="text-primary"
                        onClick={handleRequestAppointment}
                    />
                    <ActionCard
                        icon="lab_research"
                        title="Ver Resultados de Citas"
                        description="Consulta los resultados o novedades de tus citas anteriores."
                        bgColor="bg-emerald-50 dark:bg-emerald-900/20"
                        iconColor="text-primary-green"
                        onClick={handleViewResults}
                    />
                </div>
            </SectionCard>

            {/* ── SECTION 3: Current Medications ── */}
            <SectionCard
                title="Medicamentos Actuales"
                subtitle="Prescripciones activas y horario"
            >
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="rounded-2xl bg-white dark:bg-gray-900/60 border border-slate-200 dark:border-gray-700 h-36 animate-pulse"
                            />
                        ))}
                    </div>
                ) : medications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-900/30 py-10 text-center">
                        <span
                            className="material-symbols-outlined text-slate-300 dark:text-gray-600"
                            style={{ fontSize: '40px' }}
                        >
                            medication
                        </span>
                        <div>
                            <p className="text-sm font-semibold text-slate-500 dark:text-gray-400">
                                Sin medicamentos activos
                            </p>
                            <p className="text-xs text-slate-400 dark:text-gray-500 mt-0.5">
                                No tienes prescripciones registradas actualmente.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {medications.slice(0, 3).map((med, idx) => (
                            <MedicationCard
                                key={idx}
                                name={med.name}
                                dosage={med.dosage}
                                frequency={med.frequency}
                                status={med.status}
                            />
                        ))}
                    </div>
                )}
            </SectionCard>

        </DashboardContainer>
    );
}