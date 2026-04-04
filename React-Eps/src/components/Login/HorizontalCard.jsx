import MuiIcon from "../UI/MuiIcon";

export default function HorizontalCard({ icon, title, description }) {
    return (
        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10">
            <MuiIcon name={icon} className="text-white" sx={{ fontSize: '1.5rem' }} />
            <div>
                <h3 className="text-white font-bold text-base">{title}</h3>
                <p className="text-white/60 text-sm">{description}</p>
            </div>
        </div>
    )
}
