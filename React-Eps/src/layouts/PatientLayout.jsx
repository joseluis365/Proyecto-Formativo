import { Outlet, Link, NavLink } from "react-router-dom";
import { LayoutProvider, useLayout } from "../LayoutContext";
import ThemeToggle from "@/components/UI/ThemeToggle";

function NavItem({ to, label, icon }) {
    return (
        <NavLink
            to={to}
            end
            className={({ isActive }) => `
                flex items-center gap-2 px-6 py-3 rounded-2xl transition-all duration-300 font-bold text-sm tracking-wide
                ${isActive
                    ? "bg-primary text-white shadow-xl shadow-primary/30"
                    : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                }
            `}
        >
            <span className="material-symbols-outlined text-xl">{icon}</span>
            <span className="hidden sm:inline-block">{label}</span>
        </NavLink>
    );
}

function PatientLayoutContent() {
    const { title, subtitle } = useLayout();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <div className="min-h-screen bg-neutral-gray-bg dark:bg-black font-figtree">
            {/* Header / Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-neutral-gray-border/10">
                <div className="max-w-7xl mx-auto px-6 lg:px-10 h-24 flex items-center justify-between gap-10">

                    {/* Brand */}
                    <Link to="/paciente" className="flex items-center gap-4 shrink-0 hover:scale-105 transition-transform duration-300">
                        <div className="bg-primary size-12 rounded-[1rem] flex items-center justify-center text-white shadow-2xl shadow-primary/40 rotate-12 group-hover:rotate-0 transition-all">
                            <span className="material-symbols-outlined text-3xl font-bold">clinical_notes</span>
                        </div>
                        <div className="hidden lg:block">
                            <h1 className="text-gray-900 dark:text-white text-xl font-black tracking-tight leading-none">SaludIntegral</h1>
                            <p className="text-primary text-[10px] font-black uppercase tracking-[3px] mt-1.5 opacity-80">Portal Paciente</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-2 bg-gray-50 dark:bg-gray-800/40 p-1.5 rounded-[1.5rem] border border-gray-100 dark:border-gray-800">
                        <NavItem to="/paciente" label="Dashboard" icon="dashboard" />
                        <NavItem to="/paciente/agendar" label="Agendar Cita" icon="add_circle" />
                        <NavItem to="/paciente/citas" label="Mis Citas" icon="event_available" />
                        <NavItem to="/paciente/historial" label="Historial" icon="history" />
                    </div>

                    {/* User Profile */}
                    <div className="flex items-center gap-3 sm:gap-5 shrink-0">
                        <ThemeToggle />
                        <div className="hidden sm:flex flex-col items-end">
                            <p className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-none capitalize">
                                {user.primer_nombre} {user.primer_apellido}
                            </p>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Paciente</span>
                        </div>
                        <Link to="/paciente/perfil" className="size-12 rounded-2xl bg-primary/20 p-0.5 ring-4 ring-primary/5 shadow-inner cursor-pointer hover:ring-primary/20 transition-all overflow-hidden group">
                            <img
                                src="https://lh3.googleusercontent.com/a/default-user=s96-c"
                                alt="User Avatar"
                                className="size-full object-cover rounded-[0.8rem]"
                                onError={(e) => {
                                    e.target.src = "https://img.freepik.com/vector-premium/icono-perfil-usuario-estilo-plano-ilustracion-vector-avatar-miembro-sobre-fondo-aislado-concepto-negocio-signo-permiso-usuario_157943-15752.jpg";
                                }}
                            />
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Main Content Area */}
            < div className="pt-24 md:pt-32 pb-24 md:pb-20 px-4 md:px-10" >
                <main className="max-w-7xl mx-auto space-y-8 md:space-y-10">

                    {/* Title Header (Responsive adaptation) */}
                    {(title || subtitle) && (
                        <div className="pb-6 md:pb-10 border-b border-gray-100 dark:border-gray-800/50 flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
                            <div className="space-y-2 md:space-y-3">
                                <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-none">
                                    {title}
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 text-sm md:text-lg font-medium max-w-2xl leading-relaxed">
                                    {subtitle}
                                </p>
                            </div>
                            <div className="hidden md:flex items-center gap-3">
                                <button className="size-12 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-primary transition-all shadow-sm">
                                    <span className="material-symbols-outlined">notifications</span>
                                </button>
                                <button className="size-12 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-primary transition-all shadow-sm">
                                    <span className="material-symbols-outlined">help</span>
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="min-h-[60vh]">
                        <Outlet />
                    </div>
                </main>
            </div >

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
