import HorizontalCard from "./HorizontalCard";
import BackArrow from "../UI/BackArrow";

export default function LeftSection() {
    return (
        <div className="relative hidden lg:flex lg:w-3/5 flex-col justify-center px-12 xl:px-24 bg-linear-to-br from-[#0a1e4d] to-primary overflow-hidden">
            
            <div className="absolute inset-0 medical-pattern"></div>
            <div className="absolute top-8 left-12 xl:left-24 z-20 group flex items-center">
    <BackArrow />
    
    {/* El Tooltip */}
    <span className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity absolute left-12 ml-2 px-2 py-1 text-xs font-medium text-white bg-black/60 backdrop-blur-sm rounded-md whitespace-nowrap">
        Volver al inicio
    </span>
</div>
            <div className="relative z-10 flex flex-col gap-8">
                <div className="flex items-center gap-3 text-white">
                    
                    <div className="size-10">
                        <img src="/icono_dark.png" alt="Saluvanta EPS Logo" className="w-full h-full object-contain" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight">Saluvanta EPS</span>
                </div>
                <div className="flex flex-col gap-4 max-w-lg">
                    <h1 className="text-white text-5xl font-black leading-tight tracking-tight">
                        
                        Acceso al portal de Saluvanta EPS
                    </h1>
                    <p className="text-lg font-medium text-white/80 leading-relaxed">
                        Plataforma institucional para el acceso seguro a servicios de salud. Autorizado solo para personal y afiliados vinculados.
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-4 max-w-lg mt-4">
                    <HorizontalCard icon="calendar_today" title="Consulta de citas médicas" description="Agenda y cancela en línea de forma ágil." />
                    <HorizontalCard icon="description" title="Gestión de autorizaciones" description="Trámites rápidos sin salir de casa." />
                    <HorizontalCard icon="lock" title="Acceso seguro a información" description="Protección avanzada de sus datos médicos." />
                </div>
            </div>
            <div className="absolute bottom-10 left-12 xl:left-24">
                <p className="text-white/40 text-xs font-medium">© 2024 Saluvanta EPS. Todos los derechos reservados.</p>
            </div>
        </div>
    )
}
