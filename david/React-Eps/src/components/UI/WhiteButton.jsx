export default function WhiteButton({text}) {
    return (
        <button className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg px-6 py-3 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
            {text}
        </button>
    )
}