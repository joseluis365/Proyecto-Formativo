export default function PersonalInfoItem({ label, value }) {
    return (
        <div className="flex flex-col border-b border-gray-300 pb-2 gap-0.5">
            <span className="font-medium text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide">{label}</span>
            <span className="font-medium text-gray-800 dark:text-gray-200 break-all">{value}</span>
        </div>
    )
}
