import { Link } from "react-router-dom";
import Layout from "./Layout";
import { codeForm } from "../../data/InicioForms";
import FormBuilder from "../UI/Formbuilder";
import BlueButton from "../UI/BlueButton";

export default function CodeSection() {
    return (
        <Layout title="Verificar Código" description="Ingrese el código enviado a su correo electrónico">
                <FormBuilder config={codeForm} onSubmit={(e) => {e.preventDefault(); console.log("Formulario enviado")}}/>
                <Link to="/reset-password">
                    <BlueButton text={codeForm.buttonText} icon={codeForm.buttonIcon}/>
                </Link>
                <div className="pt-6 border-t border-[#e7ebf3] dark:border-white/5 flex flex-col gap-4">
                    <div className="flex items-start gap-3 p-3 bg-background-light dark:bg-white/5 rounded-lg border border-[#cfd7e7] dark:border-white/10">
                        <span className="material-symbols-outlined text-primary text-xl mt-0.5">verified_user</span>
                        <div className="flex flex-col gap-1">
                            <p className="text-[#0d121b] dark:text-white text-xs font-bold">Acceso protegido</p>
                            <p className="text-[#4c669a] text-[11px] leading-relaxed">
                                La información médica es privada y confidencial bajo la Ley de Protección de Datos Personales.
                            </p>
                            <Link className="text-primary text-[11px] font-bold hover:underline mt-0.5" to="/privacy-policy">Política de Privacidad</Link>
                        </div>
                    </div>
                </div>
        </Layout>
    )
}