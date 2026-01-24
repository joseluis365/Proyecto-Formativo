
import { Background } from "../../data/PacienteInfo";
import BackgroundItem from "./BackgroundItem";

export default function BackgroundInfo() {
    return (
        <section>
            <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-primary-green text-2xl">assignment</span>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Antecedentes Personales
                </h3>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 space-y-2 text-sm list-disc list-inside">
                {Background.map((item) => (
                    <BackgroundItem key={item.label} label={item.label} items={item.items} />
                ))}
            </ul>
        </section>
    )
}