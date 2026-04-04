import MuiIcon from "../UI/MuiIcon";

export default function InfoSection({text, title, icon}) {
    return (
        <div>
            <div className="flex gap-3 mb-3">
                <MuiIcon name={icon} className="text-gray-500 dark:text-gray-400" sx={{ fontSize: '1.25rem' }} />
                <h3 className="text-gray-800 dark:text-gray-200 text-sm font-bold uppercase tracking-wider">{title}
                </h3>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed text-left">
                {text}
            </p>
            </div>
        </div>
    )
}
