import MuiIcon from "./MuiIcon";

export default function SecondButton({icon,text}) {
    return (
        <button
            className="grow sm:grow-0 flex items-center justify-center gap-2 bg-primary-green/10 hover:bg-primary-green/20 text-primary-green font-semibold py-2.5 px-5 rounded-lg transition-colors duration-200">
            <MuiIcon name={icon} sx={{ fontSize: '1rem' }} /> {text}
        </button>
    )
}
