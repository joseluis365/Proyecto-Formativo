import DataTable from "../UI/DataTable";
import MuiIcon from "../UI/MuiIcon";

export default function ExamenTable({ examenes, onView, onAtender }) {
    const isAtendido = (estado) => ['Atendida', 'Finalizada'].includes(estado);

    const columns = [
        {
            key: "hora_inicio",
            header: "HORA",
            render: (d) => (
                <span className="font-medium text-gray-900 dark:text-white whitespace-nowrap">
                    {d.hora_inicio?.slice(0, 5) || "--:--"}
                </span>
            ),
        },
        {
            key: "paciente",
            header: "PACIENTE / DOC",
            render: (d) => (
                <div className="whitespace-nowrap">
                    <div className="font-medium text-gray-900 dark:text-white">
                        {d.paciente ? `${d.paciente.primer_nombre} ${d.paciente.primer_apellido}` : "Paciente no encontrado"}
                    </div>
                    <div className="text-xs text-gray-500">{d.paciente?.documento}</div>
                </div>
            ),
        },
        {
            key: "examen",
            header: "TIPO EXAMEN",
            render: (d) => (
                <span className="font-medium text-gray-700 dark:text-gray-300">
                    {d.categoria_examen?.categoria ?? 'Laboratorio'}
                </span>
            ),
        },
        {
            key: "ayuno",
            header: "AYUNO",
            render: (d) => (
                d.requiere_ayuno ? (
                    <span className="bg-orange-100 text-orange-700 font-bold px-2 py-1 rounded text-xs flex items-center gap-1 w-max">
                        <MuiIcon name="restaurant" sx={{ fontSize: '14px' }} /> Sí
                    </span>
                ) : (
                    <span className="bg-green-100 text-green-700 font-bold px-2 py-1 rounded text-xs flex items-center gap-1 w-max">
                        <MuiIcon name="no_food" sx={{ fontSize: '14px' }} /> No
                    </span>
                )
            ),
        },
        {
            key: "id_estado",
            header: "ESTADO",
            render: (d) => {
                const statusName = d.estado?.nombre_estado || "Pendiente";
                return (
                    <span
                        className={`px-2.5 py-1 text-xs font-semibold leading-none rounded-full whitespace-nowrap ${isAtendido(statusName)
                                ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
                                : statusName === "Cancelada" || statusName === "Inasistencia"
                                    ? "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                                    : "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
                            }`}
                    >
                        {statusName}
                    </span>
                );
            },
        },
        {
            key: "actions",
            header: "Acciones",
            align: "center",
            render: (d) => {
                const isDone = isAtendido(d.estado?.nombre_estado);
                const todayStr = new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2, '0') + '-' + String(new Date().getDate()).padStart(2, '0');
                const isSameDay = d.fecha === todayStr;

                return (
                    <div className="flex items-center justify-center gap-2">
                        {isDone ? (
                            <button
                                disabled
                                className="p-2 rounded-full text-green-500 cursor-not-allowed flex items-center justify-center"
                                title="Atendido"
                            >
                                <MuiIcon name="check_circle" sx={{ fontSize: '20px' }} />
                            </button>
                        ) : isSameDay ? (
                            <button
                                onClick={() => onAtender(d)}
                                className="p-2 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 transition-all flex items-center justify-center cursor-pointer"
                                title="Atender Examen"
                            >
                                <MuiIcon name="science" sx={{ fontSize: '20px' }} />
                            </button>
                        ) : (
                            <button
                                disabled
                                className="p-2 rounded-full text-gray-300 dark:text-gray-600 cursor-not-allowed flex items-center justify-center"
                                title="Solo se puede atender el mismo día del examen"
                            >
                                <MuiIcon name="science" sx={{ fontSize: '20px' }} />
                            </button>
                        )}
                    </div>
                );
            },
        },
    ];

    return <DataTable columns={columns} data={examenes} />;
}
