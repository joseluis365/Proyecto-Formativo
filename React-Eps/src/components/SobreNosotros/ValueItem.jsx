import MuiIcon from "../UI/MuiIcon";

export default function ValueItem({text, icon}) {
    return (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50">
            <div className="text-primary"><MuiIcon name={icon} sx={{ fontSize: '1.5rem' }} /></div>
            <span className="font-bold text-sm text-slate-900 dark:text-white">{text}</span>
        </div>
    )
}
