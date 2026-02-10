import { NavLink } from "react-router-dom";
export default function FooterItem({ menu }) {
    return (
        <div className="flex flex-col gap-3">
            <h5 className="text-slate-900 dark:text-white text-xs font-bold uppercase tracking-wider">Compañía</h5>
            <ul className="flex flex-col gap-2 text-xs text-slate-500 dark:text-slate-400">
                {menu.map((item, index) => (
                    <li key={index}><NavLink className="hover:text-primary transition-colors" to={item.to}>{item.label}</NavLink></li>
                ))}
            </ul>
        </div>
    );
}