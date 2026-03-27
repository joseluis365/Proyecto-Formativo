export default function MedicalInfo({title, tableData, headerContent}) {
    return (
        <section>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{title}</h3>
                {headerContent && (
                    <div className="flex flex-col sm:flex-row gap-3">
                        {headerContent}
                    </div>
                )}
            </div>
            <div className="rounded-lg border border-neutral-gray-border/30 dark:border-gray-700 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    {tableData}
                </div>

            </div>
        </section>
    )
}
