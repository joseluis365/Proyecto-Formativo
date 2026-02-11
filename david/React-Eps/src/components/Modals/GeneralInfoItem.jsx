export default function GeneralInfoItem({label, value}) {
    return (
        <div className="col-span-2 grid grid-cols-subgrid text-left py-2 border-b border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">{label}</p>
            <p className="text-gray-800 dark:text-gray-200">{value}</p>
        </div>
    )
}