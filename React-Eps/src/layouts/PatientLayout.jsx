import { Outlet, Link, NavLink } from "react-router-dom";
import { LayoutProvider, useLayout } from "../LayoutContext";
import Header from "./Layout-Components/Header";

function NavItem({ to, label, icon }) {
    return (
        <NavLink
            to={to}
            end
            className={({ isActive }) => `
                flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300 font-bold text-xs tracking-wide
                ${isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                }
            `}
        >
            <span className="material-symbols-outlined text-lg">{icon}</span>
            <span>{label}</span>
        </NavLink>
    );
}

function PatientLayoutContent() {
    const { title, subtitle } = useLayout();

    return (
        <div className="min-h-screen bg-neutral-gray-bg dark:bg-black font-figtree">
            {/* Unified Topbar Header */}
            <Header title="SaludIntegral" subtitle="Portal Paciente">
                <div className="flex items-center gap-2 bg-gray-100/50 dark:bg-gray-800/40 p-1.5 rounded-2xl border border-gray-100/50 dark:border-gray-800">
                    <NavItem to="/paciente" label="Dashboard" icon="dashboard" />
                    <NavItem to="/paciente/agendar" label="Agendar" icon="add_circle" />
                    <NavItem to="/paciente/citas" label="Mis Citas" icon="event_available" />
                    <NavItem to="/paciente/historial" label="Historial" icon="history" />
                </div>
            </Header>

            {/* Main Content Area */}
            <div className="pt-10 md:pt-14 pb-24 md:pb-20 px-4 md:px-10">
                <main className="max-w-7xl mx-auto space-y-8 md:space-y-10">

                    {/* Page Specific Title Header */}
                    {(title || subtitle) && (
                        <div className="pb-6 md:pb-8 border-b border-gray-100 dark:border-gray-800/50">
                            <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-none mb-3">
                                {title}
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm md:text-lg font-medium max-w-2xl leading-relaxed">
                                {subtitle}
                            </p>
                        </div>
                    )}

                    <div className="min-h-[60vh]">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Simple Mobile Nav Wrapper (Visual only for now if needed, but the prompt says top bar) */}
            < nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-100 dark:border-gray-800 px-6 py-4 rounded-[2rem] shadow-2xl flex items-center justify-around gap-8 min-w-[320px]" >
                <NavMobileItem to="/paciente" icon="dashboard" />
                <NavMobileItem to="/paciente/agendar" icon="add_circle" />
                <NavMobileItem to="/paciente/citas" icon="event_available" />
                <NavMobileItem to="/paciente/historial" icon="history" />
            </nav >
        </div >
    )
}

function NavMobileItem({ to, icon }) {
    return (
        <NavLink to={to} end className={({ isActive }) => `size-12 rounded-2xl flex items-center justify-center transition-all ${isActive ? 'bg-primary text-white shadow-lg' : 'text-gray-400'}`}>
            <span className="material-symbols-outlined text-2xl font-bold">{icon}</span>
        </NavLink>
    );
}

export default function PatientLayout() {
    return (
        <LayoutProvider>
            <PatientLayoutContent />
        </LayoutProvider>
    )
}
