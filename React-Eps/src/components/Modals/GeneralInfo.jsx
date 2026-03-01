import GeneralInfoItem from "./GeneralInfoItem";

export default function GeneralInfo({item}) {
    return (
        <div>
            <div className="flex gap-3 mb-3">
                <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">person</span>
                <h3 className="text-gray-800 dark:text-gray-200 text-sm font-bold uppercase tracking-wider">INFORMACIÓN GENERAL
                </h3>
            </div>
            <div className="grid grid-cols-[150px_1fr] gap-x-6 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-sm">
                {item.map((info, index) => (
                    <GeneralInfoItem key={index} label={info.label} value={info.value} />
                ))}
            </div>
        </div>
    )
}
