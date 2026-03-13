import { useEffect } from "react";
import { useLayout } from "../LayoutContext";

/**
 * Hook para registrar el contenido de ayuda de una vista.
 *
 * Uso en cualquier página:
 *   useHelp({
 *     title: "Título de la vista",
 *     description: "Descripción general...",
 *     sections: [
 *       { title: "¿Qué puedes hacer?", type: "list", items: ["...", "..."] },
 *       { title: "Pasos",              type: "steps", items: ["...", "..."] },
 *       { title: "Descripción",        type: "text",  content: "..." },
 *       { title: "Imagen",             type: "image", src: "/img.png", alt: "..." },
 *       { title: "Advertencia",        type: "warning", content: "..." },
 *     ]
 *   })
 *
 * Al desmontar la vista, el contenido de ayuda se limpia automáticamente.
 */
export function useHelp(helpData) {
    const { setHelpContent } = useLayout();

    useEffect(() => {
        setHelpContent(helpData);
        return () => setHelpContent(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}
