import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "./Layout";
import { emailForm } from "../../data/InicioForms";
import FormWithIcons from "../UI/FormWithIcons";
import BlueButton from "../UI/BlueButton";
import api from "../../Api/axios";
import Swal from "sweetalert2";

export default function EmailSection() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        try {
            const response = await api.post("/forgot-password", { email });
            sessionStorage.setItem("recovery_email", email);
            sessionStorage.setItem("recovery_timer_end", Date.now() + 30000);
            if (response.data?.available_attempts !== undefined) {
                sessionStorage.setItem("recovery_attempts", response.data.available_attempts);
            }

            Swal.fire({
                icon: 'success',
                title: 'Código enviado',
                text: 'Revisa tu correo electrónico para ver el código de verificación',
                timer: 2000,
                showConfirmButton: false
            });

            navigate("/code-verification");
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || "Error al enviar el código",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title="Verificar Correo Electronico" description="Ingrese su correo electronico registrado para continuar">
            <FormWithIcons
                config={emailForm}
                onChange={(field, value) => setEmail(value)}
                onSubmit={handleSubmit}
            />

            <div onClick={handleSubmit}>
                <BlueButton
                    text={loading ? "Enviando..." : emailForm.buttonText}
                    icon={emailForm.buttonIcon}
                    disabled={loading}
                />
            </div>

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
