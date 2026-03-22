import { useState } from "react";

/**
 * useTheme — hook global para manejar el modo oscuro/claro.
 * Lee el estado inicial desde localStorage y sincroniza los cambios
 * en el elemento <html> para que Tailwind los detecte.
 */
export default function useTheme() {
    const [isDark, setIsDark] = useState(
        () =>
            localStorage.getItem("theme") === "dark" ||
            (!("theme" in localStorage) &&
                window.matchMedia("(prefers-color-scheme: dark)").matches)
    );

    const toggleTheme = () => {
        const root = window.document.documentElement;
        if (isDark) {
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
            setIsDark(false);
        } else {
            root.classList.add("dark");
            localStorage.setItem("theme", "dark");
            setIsDark(true);
        }
        // Notifica a otros componentes que escuchan el storage
        window.dispatchEvent(new Event("storage"));
    };

    return { isDark, toggleTheme };
}
