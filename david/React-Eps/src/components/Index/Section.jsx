import PrincipalText from "./PrincipalText";
import BlueButton from "../UI/BlueButton";
import WhiteButton from "../UI/WhiteButton";

export default function Section({image, title, subtitle, description}) {
    return (
        <section className="px-6 md:px-10 lg:px-40 pt-8 pb-14 md:pt-10 md:pb-16 bg-white dark:bg-background-dark @container overflow-visible">
            <div className="max-w-[1280px] mx-auto flex flex-col gap-8 @[864px]:flex-row @[864px]:items-center">
                <div className="flex flex-col gap-6 flex-1">
                    <PrincipalText title={title} subtitle={subtitle} description={description}/>
                    <div className="flex flex-wrap gap-3">
                        <BlueButton text="Afíliate Ahora" icon="arrow_forward"/>
                        <WhiteButton text="Conoce Servicios"/>
                    </div>
                </div>
                <div className="flex-1 relative lg:max-w-[480px]">
                    <div className="w-full aspect-video md:aspect-4/3 bg-primary/5 rounded-2xl overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl rotate-1">
                        <div className="w-full h-full bg-center bg-cover" data-alt="Professional doctor smiling in a modern medical office
                        " style={{backgroundImage: `url(${image})`}} >
                        </div>
                    </div>
                    <div className="absolute -bottom-4 -left-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg flex items-center gap-3 border border-slate-100 dark:border-slate-700 z-10">
                        <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full text-green-600">
                            <span className="material-symbols-outlined text-xl leading-none">verified_user</span>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-900 dark:text-white">Certificados</p>
                            <p className="text-[10px] text-slate-500">ISO 9001 Calidad</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}