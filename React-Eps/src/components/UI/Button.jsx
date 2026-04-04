import MuiIcon from "./MuiIcon";

export default function Button({icon,text}) {
    return (
        <button className="cursor-pointer flex items-center gap-2 bg-primary-green hover:bg-primary-green/90 text-white font-semibold py-2.5 px-5 rounded-lg shadow-sm transition-colors duration-200">
            <MuiIcon name={icon} sx={{ fontSize: '1.25rem' }} />
            {text}
        </button>
    )
}
