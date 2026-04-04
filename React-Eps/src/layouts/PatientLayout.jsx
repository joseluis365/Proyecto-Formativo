import { useState } from "react";
import { Outlet, Link, NavLink } from "react-router-dom";
import { LayoutProvider, useLayout } from "../LayoutContext";
import Header from "./Layout-Components/Header";
import HelpModal from "../components/UI/HelpModal";
import useTheme from "../hooks/useTheme";
import MuiIcon from "../components/UI/MuiIcon";

/* ——— Nav item top-bar (lg) ——— */
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
            <MuiIcon name={icon} sx={{ fontSize: '1.125rem' }} />
            <span>{label}</span>
        </NavLink>
    );
}

/* ——— Nav item dropdown (md) ——— */
function NavDropItem({ to, label, icon, onClick }) {
    return (
        <NavLink
            to={to}
            end
            onClick={onClick}
            className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
                    isActive
                        ? "bg-primary text-white shadow-md"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`
            }
        >
            <MuiIcon name={icon} sx={{ fontSize: '1.25rem' }} />
            <span>{label}</span>
        </NavLink>
    );
}

/* ——— Nav item bottom-bar (sm) ——— */
function NavMobileItem({ to, icon }) {
    return (
        <NavLink to={to} end className={({ isActive }) => `size-10 sm:size-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all ${isActive ? "bg-primary text-white shadow-lg" : "text-gray-400"}`}>
            <MuiIcon name={icon} sx={{ fontSize: '1.5rem' }} className="font-bold" />
        </NavLink>
    );
}

const NAV_LINKS = [
    { to: "/paciente",             label: "Inicio",       icon: "dashboard"       },
    { to: "/paciente/agendar",     label: "Agendar",      icon: "add_circle"      },
    { to: "/paciente/citas",       label: "Mis Citas",    icon: "event_available" },
    { to: "/paciente/medicamentos",label: "Medicamentos", icon: "medication"      },
];

/* ——— PatientLayoutContent ——— */
function PatientLayoutContent() {
    const { title, subtitle, backPath } = useLayout();
    const [menuOpen, setMenuOpen] = useState(false);
    const { isDark } = useTheme();

    return (
        <div className="min-h-screen bg-neutral-gray-bg dark:bg-black font-figtree">
            <Header
                title={
                    <div className="flex items-center gap-3">
                        <img 
                            src={isDark ? "/icono_dark.png" : "/icono.png"} 
                            alt="Logo Saluvanta" 
                            className="size-10 md:size-12 object-contain"
                        />
                        <span className="tracking-tight">Saluvanta EPS</span>
                    </div>
                }
                subtitle="Estas en tu pagina personal"
                hideLogout
                /* hamburger slot — visible only md → lg */
                hamburger={
                    <div className="relative">
                        <button
                            onClick={() => setMenuOpen((v) => !v)}
                            className="size-10 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                        >
                            <MuiIcon name={menuOpen ? "close" : "menu"} sx={{ fontSize: '1.5rem' }} />
                        </button>

                        {menuOpen && (
                            <>
                                {/* Overlay */}
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setMenuOpen(false)}
                                />
                                {/* Dropdown */}
                                <div className="absolute left-0 top-12 z-50 w-52 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-2xl p-2 flex flex-col gap-1">
                                    {NAV_LINKS.map((link) => (
                                        <NavDropItem
                                            key={link.to}
                                            {...link}
                                            onClick={() => setMenuOpen(false)}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                }
            >
                {/* Top bar nav — only visible on lg+ */}
                <div className="flex items-center gap-2 bg-gray-100/50 dark:bg-gray-800/40 p-1.5 rounded-2xl border border-gray-100/50 dark:border-gray-800">
                    {NAV_LINKS.map((link) => (
                        <NavItem key={link.to} {...link} />
                    ))}
                </div>
            </Header>
            <HelpModal />

            {/* Main Content Area */}
            <div className="pt-5 md:pt-5 pb-24 md:pb-20 px-8 md:px-10 dark:bg-gray-900">
                <main className="max-w-7xl mx-auto space-y-8 md:space-y-10">

                    {/* Page Title */}
                    {(title || subtitle) && (
                        <div className="pb-6 md:pb-2 border-b border-gray-100 dark:border-gray-800/50">
                            <div className="flex items-center gap-4 mb-3">
                                {backPath && (
                                    <Link
                                        to={backPath}
                                        className="size-10 md:size-12 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-primary transition-all shadow-sm hover:shadow-md group"
                                    >
                                        <MuiIcon name="arrow_back" sx={{ fontSize: '1.5rem' }} className="group-hover:-translate-x-1 transition-transform" />
                                    </Link>
                                )}
                                <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-none">
                                    {title}
                                </h2>
                            </div>
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

            {/* Bottom mobile nav (< md / 768px) */}
            <nav className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-100 dark:border-gray-800 px-4 py-2.5 rounded-3xl shadow-2xl flex items-center justify-around gap-4 sm:gap-8 min-w-[280px]">
                {NAV_LINKS.map((link) => (
                    <NavMobileItem key={link.to} to={link.to} icon={link.icon} />
                ))}
            </nav>
        </div>
    );
}

export default function PatientLayout() {
    return (
        <LayoutProvider>
            <PatientLayoutContent />
        </LayoutProvider>
    );
}
