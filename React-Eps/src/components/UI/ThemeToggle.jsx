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
            className="flex items-center justify-center rounded-full size-10 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
            title={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        >
            <span className="material-symbols-outlined">
                {isDarkMode ? 'dark_mode' : 'light_mode'}
            </span>
        </button>
    );
}
