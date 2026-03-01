import Button from "../UI/Button";
import Filter from "../UI/Filter";
import SecondButton from "../UI/SecondButton";

export default function SearchBar() {
    return (
        <div className="bg-white dark:bg-gray-900/50 rounded-xl shadow-sm border border-neutral-gray-border/20 dark:border-gray-800 p-4 mb-8">
            <div className="flex flex-wrap items-center gap-4">
                <div className="relative grow min-w-[180px]">
                    <span
                        className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-neutral-gray-text/70 dark:text-gray-400">calendar_today</span>
                    <input
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-neutral-gray-border/50 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-primary-green/50 focus:border-primary-green outline-none transition-shadow duration-200"
                        type="date" />
                </div>
                <div className="relative grow">
                    <Filter options={["dia", "semana", "mes"]} placeholder="Tiempo" />
                </div>
                <div className="relative grow">
                    <Filter options={["Atendida", "Pendiente", "Cancelada"]} placeholder="Todos los estados" />
                </div>
                <SecondButton icon="search" text="Buscar" />
                <Button icon="refresh" text="Actualizar" />
                
            </div>
        </div>
    )
}
