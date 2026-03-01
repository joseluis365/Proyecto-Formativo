export default function PersonalInfoItem({ label, value }) {
    return (
        <div className="flex justify-between border-b border-gray-300 pb-2">
            <span className="font-medium text-gray-500 dark:text-gray-400">{label}:</span>
            <span className="font-medium text-gray-800 dark:text-gray-200">{value}</span>
        </div>
    )
}
