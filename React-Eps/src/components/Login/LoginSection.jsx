import { Link } from "react-router-dom";
import Layout from "./Layout";
import Formbuilder from "../UI/Formbuilder";
import { loginForm } from "../../data/InicioForms";
import BlueButton from "../UI/BlueButton";
import CheckBox from "../UI/CheckBox";

export default function LoginSection() {
    return (
        <Layout title="Iniciar sesión" description="Ingrese sus credenciales para acceder a su cuenta.">
            <Formbuilder config={loginForm} onSubmit={(e) => {e.preventDefault(); console.log("Formulario enviado")}}/>
            <div className="flex justify-between items-center">
                <CheckBox label="Recordar sesión" id="remember" name="remember"/>
                <Link to="/confirm-email" className="text-primary text-xs font-bold hover:underline">¿Olvidaste tu contraseña?</Link>
            </div>
            <Link to="/dashboard">
                <BlueButton text={loginForm.buttonText} icon={loginForm.buttonIcon}/>
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
                <div className="flex justify-center gap-6 mt-2">
                    <Link className="text-[#4c669a] text-xs hover:text-primary flex items-center gap-1" href="#">
                        <span className="material-symbols-outlined text-sm">support_agent</span>
                        Ayuda
                    </Link>
                </div>
            </div>
        </Layout>
    )
}