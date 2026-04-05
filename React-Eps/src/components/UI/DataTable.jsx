import SearchOffRoundedIcon from '@mui/icons-material/SearchOffRounded';
export default function DataTable({ columns, data }) {
    return (
        <div className="overflow-x-auto w-full max-w-full scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-800">
            <table className="w-full text-sm text-left text-neutral-gray-text dark:text-gray-400 table-auto">
                <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-primary/10 dark:bg-primary/20">
                    <tr>
                        {columns.map((col) => (
                            <th key={col.key}
                                scope="col"
                                className={`px-6 py-4 font-semibold text-primary-blue dark:text-primary-blue/90 ${col.align === 'center' ? 'text-center' : ''
                                    }`}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400 italic">
                                <div className="flex flex-col items-center gap-2">
                                    <SearchOffRoundedIcon sx={{ fontSize: '2.5rem' }} className="opacity-20" />
                                    <span>No se encontraron resultados que coincidan con los filtros aplicados.</span>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        data.map((row, i) => (
                            <tr
                                key={i}
                                className="bg-white dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800 odd:bg-white even:bg-gray-50"
                            >
                                {columns.map((col) => (
                                    <td
                                        key={col.key}
                                        className={`px-6 py-4 dark:bg-gray-900  ${col.align === "center" ? "text-center" : ""
                                            }`}
                                    >
                                        {col.render ? col.render(row) : (row[col.key] || "-")}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

        </div>
    )
}
