import MuiIcon from "./MuiIcon";

export default function WhiteButton({ text, icon, onClick, disabled }) {
    return (
        <button 
            onClick={onClick}
            disabled={disabled}
            className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-6 py-3 font-bold text-sm transition-all flex items-center justify-center gap-2 ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50 dark:hover:bg-slate-700 hover:shadow-md cursor-pointer'}`}
        >
            {icon && <MuiIcon name={icon} sx={{ fontSize: '1.125rem' }} />}
            {text}
        </button>
    );
}
