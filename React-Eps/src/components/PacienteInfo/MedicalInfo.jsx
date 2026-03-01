export default function MedicalInfo({title, tableData}) {
    return (
        <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">{title}</h3>
            <div className="rounded-lg border border-neutral-gray-border/30 dark:border-gray-700 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    {tableData}
                </div>

            </div>
        </section>
    )
}
