/*
 * Contexto global de layout.
 * Comparte titulo, subtitulo y ayuda contextual entre vistas.
 */
import { createContext, useContext, useState, useEffect } from "react";

const LayoutContext = createContext(null);

export function LayoutProvider({ children }) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [helpContent, setHelpContent] = useState(null);
  const [backPath, setBackPath] = useState(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Global F1 Help Shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "F1") {
        e.preventDefault(); // 🚫 evita la ayuda del navegador
        setIsHelpOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <LayoutContext.Provider
      value={{
        title,
        setTitle,
        subtitle,
        setSubtitle,
        backPath,
        setBackPath,
        helpContent,
        setHelpContent,
        isHelpOpen,
        setIsHelpOpen,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  return useContext(LayoutContext);
}

