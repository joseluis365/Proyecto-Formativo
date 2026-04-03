import { useState, useEffect } from "react";

export function useTheme() {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            return savedTheme === "dark";
        }
        // Fallback a detectar la preferencia del sistema
        return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    });

    useEffect(() => {
        const root = document.documentElement;
        if (isDarkMode) {
            root.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

    // Retornamos ambos nombres para compatibilidad con componentes que usan isDark/toggleTheme
    return { 
        isDarkMode, 
        toggleDarkMode,
        isDark: isDarkMode,
        toggleTheme: toggleDarkMode
    };
}

export default useTheme;
