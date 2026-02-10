export default function Data({number, title}) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-3xl md:text-4xl font-black tracking-tighter text-white">{number}</span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-blue-100 opacity-80">{title}</span>
        </div>
    )
}