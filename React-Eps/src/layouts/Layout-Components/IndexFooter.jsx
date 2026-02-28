import FooterItem from "./FooterItem";
import { NavLink } from "react-router-dom";

export default function IndexFooter() {
    return (
        <footer className="bg-slate-50 dark:bg-gray-900/90 border-t border-slate-200 dark:border-slate-800 px-6 md:px-10 lg:px-40 py-10">
            <div className="max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-5 gap-8">
                <div className="flex flex-col gap-4 col-span-2 md:col-span-2 pr-0 md:pr-10">
                    <div className="flex items-center gap-2 text-primary">
                        <span className="material-symbols-outlined text-2xl font-bold">health_and_safety</span>
                        <span className="text-lg font-black text-slate-900 dark:text-white">Salud Total</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed max-w-[320px]">
                        Líderes en prestación de servicios de salud con calidad humana y tecnología avanzada. Tu bienestar es nuestra misión.
                    </p>
                    <div className="flex gap-3">
                        <a className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-primary hover:text-white transition-all shadow-sm" target="blank" href="https://www.facebook.com">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path></svg>
                        </a>
                        <a className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-primary hover:text-white transition-all shadow-sm" target="blank" href="https://x.com">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path></svg>
                        </a>
                    </div>
                </div>
                <FooterItem menu={[
                    { to: "/SobreNosotros", label: "Sobre Nosotros" },
                    { to: "/SobreNosotros", label: "Trabaja con nosotros" },
                    { to: "/SobreNosotros", label: "Noticias de Salud" }
                ]} />
                <FooterItem menu={[
                    { to: "/SobreNosotros", label: "Planes de Salud" },
                    { to: "/SobreNosotros", label: "Red de Atención" },
                    { to: "/SobreNosotros", label: "Trámites" }
                ]} />
                <FooterItem menu={[
                    { to: "/Contactenos", label: "Centro de Ayuda" },
                    { to: "/Contactenos", label: "Contacto 24/7" },
                    { to: "/Contactenos", label: "PQRS" }
                ]} />
            </div>
            <div className="max-w-[1280px] mx-auto mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-400 font-medium">
                <p>© 2024 Salud Total EPS. Todos los derechos reservados.</p>
                <div className="flex gap-5">
                    <NavLink className="hover:text-primary" to="/SobreNosotros">Términos y Condiciones</NavLink>
                    <NavLink className="hover:text-primary" to="/SobreNosotros">Privacidad</NavLink>
                    <NavLink className="hover:text-primary" to="/SobreNosotros">Cookies</NavLink>
                </div>
            </div>
        </footer>
    );
}