import MuiIcon from "../UI/MuiIcon";

export default function ActionCard({ icon, title, description, bgColor, iconColor, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`group relative flex flex-col gap-4 rounded-2xl p-6 ${bgColor} border border-transparent hover:border-primary/20 dark:hover:border-primary/30 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer text-left w-full overflow-hidden`}
        >
            {/* Arrow icon top right */}
            <MuiIcon
                name="north_east"
                className="absolute top-4 right-4 text-slate-400 dark:text-gray-500 group-hover:text-primary dark:group-hover:text-primary transition-colors"
                sx={{ fontSize: '18px' }}
            />

            {/* Icon */}
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconColor} bg-white/70 dark:bg-gray-900/40 shadow-sm`}>
                <MuiIcon name={icon} sx={{ fontSize: '22px' }} />
            </div>

            {/* Text */}
            <div>
                <p className="text-sm font-bold text-slate-800 dark:text-white pr-6">{title}</p>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 leading-relaxed">{description}</p>
            </div>
        </button>
    );
}
