export default function WhiteButton({icon,text}) {
    return (
        <button className="cursor-pointer w-full sm:w-auto flex items-center justify-center gap-2 border border-primary-green text-primary-green font-semibold py-2.5 px-5 rounded-lg shadow-sm hover:bg-primary-green/5 dark:hover:bg-primary-green/10 transition-colors duration-200">
            <span className="material-symbols-outlined">{icon}</span>
            {text}  
        </button>
    )
}