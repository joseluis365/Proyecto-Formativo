import { useState, useEffect } from "react";

export default function useTheme() {
    const getTheme = () =>
        localStorage.getItem("theme") === "dark" ||
        (!("theme" in localStorage) &&
            window.matchMedia("(prefers-color-scheme: dark)").matches);

    const [isDark, setIsDark] = useState(getTheme());

    useEffect(() => {
        const handleStorageChange = () => {
            setIsDark(getTheme());
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

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
        window.dispatchEvent(new Event("storage"));
    };

    return { isDark, toggleTheme };
}
