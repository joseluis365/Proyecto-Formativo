import { useState, useEffect } from "react";
import { useMatch, useLocation } from "react-router-dom";

export default function SidebarDropdown({ icon, label, basePath, children }) {
  const location = useLocation();

  // Detecta si alguna subruta pertenece a este dropdown
  const isActive = location.pathname.startsWith(basePath);

  const [open, setOpen] = useState(isActive);

  // Abre automáticamente si cambia la ruta
  useEffect(() => {
    setOpen(isActive);
  }, [isActive]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`
          flex items-center gap-3 px-3 py-2 rounded-lg w-full transition
          ${isActive
            ? "bg-primary/20 text-primary"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          }
        `}
      >
        <span className="material-symbols-outlined">{icon}</span>
        <p className="text-sm font-medium leading-normal">{label}</p>
        <span
          className={`material-symbols-outlined ml-auto transition-transform ${open ? "rotate-180" : ""
            }`}
        >
          expand_more
        </span>
      </button>

      <ul
        className={`mt-1 flex flex-col gap-1 overflow-y-auto transition-all duration-300 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800 ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        {children}
      </ul>
    </div>
  );
}
