import { NavLink } from "react-router-dom";

export default function SidebarItem({ to, icon, label, onClick }) {
  return (
    <NavLink
      to={to}
      end
      onClick={onClick}
      className={({ isActive }) =>
        `
        flex items-center gap-3 px-3 py-2 rounded-lg transition
        ${
          isActive
            ? "bg-primary/20 text-primary"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        }
        `
      }
    >
      <span className="material-symbols-outlined">{icon}</span>
      <p className="text-sm font-medium leading-normal">{label}</p>
    </NavLink>
  );
}
