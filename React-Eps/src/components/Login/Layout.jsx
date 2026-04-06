import { Link } from "react-router-dom";
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';


export default function Layout({title, description, children}) {
    return (
        <div className="flex-1 flex flex-col justify-start md:justify-center items-center bg-white dark:bg-gray-800 px-6 py-12 overflow-y-auto min-h-full">
            <div className="w-full max-w-md flex flex-col gap-8">
                {/* Logo and Back Button for Mobile */}
                <div className="lg:hidden flex items-center justify-start gap-2 mb-2">
                    <Link to="/" className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-primary transition-colors group">
                        <ArrowBackRoundedIcon className="text-2xl group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-bold uppercase tracking-widest hidden sm:inline">Volver</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <img src="/icono.png" alt="Sanitec" className="size-8 rounded-full object-cover block dark:hidden" />
                        <img src="/icono_dark.png" alt="Sanitec" className="size-8 rounded-full object-cover hidden dark:block" />
                        <span className="text-lg font-bold text-[#0d121b] dark:text-white uppercase tracking-tight">Sanitec</span>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <h2 className="text-[#0d121b] dark:text-white text-3xl font-bold tracking-tight">{title}</h2>
                    <p className="text-[#4c669a] text-sm">{description}</p>
                </div>
                {children}
            </div>
        </div>
    )
}
