import PersonalInfo from "./PersonalInfo";
import BackgroundInfo from "./BackgroundInfo";
import { Info } from "../../data/PacienteInfo";

export default function InfoPanel({nombre}) {
    return (
        <div className="max-w-7xl mx-auto bg-white dark:bg-gray-900/50 rounded-xl shadow-lg border border-neutral-gray-border/20 dark:border-gray-800">
            {/* Header */}
            <div className="bg-primary-green/90 dark:bg-primary-green/50 backdrop-blur-sm text-white p-6 rounded-t-xl flex items-center gap-4">
                <span className="material-symbols-outlined text-3xl">clinical_notes</span>
                <h2 className="text-xl sm:text-2xl font-bold">HISTORIAL CLÍNICO – {nombre}</h2>
            </div>
            {/* Body */}
            <div className="p-6 sm:p-8 space-y-8">
                <PersonalInfo Info={Info} />
                <hr className="border-gray-300" />
                <BackgroundInfo />
            </div>
            
        </div>
    )
}