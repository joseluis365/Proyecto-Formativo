export default function FormTextArea({label, placeholder, id, name}) {
    return (
        <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1" htmlFor={id}>{label}</label>
            <textarea className="input-tight h-24 resize-none" id={id} name={name} placeholder={placeholder}></textarea>
        </div>
    )
}
