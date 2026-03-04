export default function AppointmentCard({
    patientName,
    patientDoc,
    doctorName,
    specialty,
    time,
    status,
    onView,
    onCancel
}) {
    const STATUS_COLORS = {
        Agendada: { text: "Agendada", classes: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
        Confirmada: { text: "Confirmada", classes: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
        Cancelada: { text: "Cancelada", classes: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
        Atendida: { text: "Atendida", classes: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400" },
    };

    const statusData = STATUS_COLORS[status] || { text: status || "Pendiente", classes: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400" };

    return (
        <div className="relative w-full bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-5">
            {/* Estado */}
            <span className={`absolute top-4 right-4 px-3 py-1 text-xs font-semibold rounded-full ${statusData.classes}`}>
                {statusData.text}
            </span>

            {/* Header */}
            <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center justify-center size-12 rounded-lg bg-primary/10 text-primary">
                    <span className="material-symbols-outlined text-3xl">
                        person
                    </span>
                </div>
                <div>
                    <h2 className="text-gray-800 dark:text-gray-200 font-semibold text-lg line-clamp-1">
                        {patientName}
                    </h2>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        CC: {patientDoc}
                    </p>
                </div>
            </div>

            {/* Datos */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 space-y-4 mb-5 border border-gray-100 dark:border-gray-800">
                <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-gray-400 text-xl mt-0.5">stethoscope</span>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Médico Tratante</p>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{doctorName}</p>
                        <p className="text-xs text-primary dark:text-primary/80 mt-0.5">{specialty}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-gray-400 text-xl mt-0.5">schedule</span>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Hora de la Cita</p>
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{time}</p>
                    </div>
                </div>
            </div>

            {/* Botones */}
            <div className="flex gap-2">
                <button
                    onClick={onView}
                    className="w-full py-2 text-sm font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 transition cursor-pointer"
                >
                    Ver Detalles
                </button>
                {status === "Agendada" && (
                    <button
                        onClick={onCancel}
                        className="w-full py-2 text-sm font-semibold rounded-lg bg-white dark:bg-gray-800 text-red-600 border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20 transition cursor-pointer"
                    >
                        Cancelar
                    </button>
                )}
            </div>
        </div>
    );
}
