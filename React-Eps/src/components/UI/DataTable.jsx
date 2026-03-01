export default function DataTable({ columns, data }) {
    return (
        <div className="overflow-x-auto w-full">
            <table className="w-full text-sm text-left text-neutral-gray-text dark:text-gray-400">
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
                    {data.map((row, i) => (
                        <tr
                            key={i}
                            className="bg-white dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800 odd:bg-white even:bg-gray-50"
                        >
                            {columns.map((col) => (
                                <td
                                    key={col.key}
                                    className={`px-6 py-4 ${col.align === "center" ? "text-center" : ""
                                        }`}
                                >
                                    {col.render(row)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    )
}
