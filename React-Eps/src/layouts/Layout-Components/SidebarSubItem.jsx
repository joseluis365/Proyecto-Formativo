import { NavLink } from "react-router-dom";

export default function SidebarSubItem({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `
        pl-10 pr-3 py-2 rounded-md text-sm transition
        ${
          isActive
            ? "bg-primary/10 text-primary"
            : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
        }
        `
      }
    >
      {label}
    </NavLink>
  );
}
