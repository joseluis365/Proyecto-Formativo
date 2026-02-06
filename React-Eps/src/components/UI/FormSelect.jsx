export default function FormSelect({label, options, id, name}) {
    return (
        <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1" htmlFor={id}>{label}</label>
            <select className="input-tight" id={id} name={name}>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                ))}
            </select>
        </div>
    )
}