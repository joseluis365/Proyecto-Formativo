export default function CheckBox({label, id, name}) {
    return (
        <div className="flex items-center gap-2">
            <input className="w-4 h-4 text-primary bg-white  border-[#cfd7e7] rounded focus:ring-primary/20" id={id} type="checkbox" name={name}/>
            <label className="text-sm text-[#4c669a] cursor-pointer" htmlFor={id}>{label}</label>
        </div>
    )
}
