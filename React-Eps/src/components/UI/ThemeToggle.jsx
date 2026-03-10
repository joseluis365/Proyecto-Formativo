import { useEffect, useState } from "react";

export default function ThemeToggle() {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    });

    const toggleDarkMode = () => {
        const isDark = document.documentElement.classList.toggle("dark");
        localStorage.setItem("theme", isDark ? "dark" : "light");
        setIsDarkMode(isDark);
    };

    return (
        <button
            onClick={toggleDarkMode}
            className="size-12 rounded-2xl bg-white dark:bg-gray-800 border border-neutral-gray-border/10 flex items-center justify-center text-gray-500 hover:text-primary transition-all shadow-sm group active:scale-95 transition-all shadow-sm"
            title={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        >
            <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">
                {isDarkMode ? 'dark_mode' : 'light_mode'}
            </span>
        </button>
    );
}
