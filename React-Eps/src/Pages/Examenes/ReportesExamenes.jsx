import { useEffect } from "react";
import { useLayout } from "../../LayoutContext";
import PrincipalText from "../../components/Users/PrincipalText";
import { motion } from "framer-motion";

export default function ReportesExamenes() {
    const { setTitle, setSubtitle, setHelpContent } = useLayout();

    useEffect(() => {
        setTitle("Reportes de Exámenes");
        setSubtitle("Genera tus informes estadísticos del laboratorio.");

        setHelpContent({
            title: "Reportes de Exámenes",
            description: "Módulo en construcción para visualizar métricas clave sobre exámenes procesados, tiempos de respuesta, etc.",
            sections: []
        });

        return () => setHelpContent(null);
    }, [setTitle, setSubtitle, setHelpContent]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center gap-4 mb-4">
                <PrincipalText icon="bar_chart" text="Reportes y Estadísticas" number="-" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-900 rounded-2xl p-10 shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center text-center"
            >
                <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-700 mb-4 block">construction</span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Módulo en Construcción</h3>
                <p className="text-gray-500 max-w-md">
                    Los informes y estadísticas exclusivas para el personal de laboratorio estarán disponibles próximamente en esta sección.
                </p>
            </motion.div>
        </div>
    );
}
