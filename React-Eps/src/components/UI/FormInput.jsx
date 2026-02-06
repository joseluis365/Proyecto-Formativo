export default function FormInput({label, placeholder, type, id, name}) {
    return (
        <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1" htmlFor={id}>{label}</label>
            <input className="input-tight" id={id} name={name} placeholder={placeholder} type={type}/>
        </div>
    )
}