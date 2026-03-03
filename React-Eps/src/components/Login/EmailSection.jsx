import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "./Layout";
import { emailForm } from "../../data/InicioForms";
import FormWithIcons from "../UI/FormWithIcons";
import BlueButton from "../UI/BlueButton";
import api from "../../Api/axios";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userRecoveryEmailSchema } from "../../schemas/authSchemas";

export default function EmailSection() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(userRecoveryEmailSchema)
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await api.post("/forgot-password", { email: data.email });
            sessionStorage.setItem("recovery_email", data.email);
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
            if (error.response?.status === 422) {
                const backendErrors = error.response.data.errors;
                Object.keys(backendErrors).forEach((key) => {
                    setError(key, {
                        type: "server",
                        message: backendErrors[key][0],
                    });
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response?.data?.message || "Error al enviar el código",
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title="Verificar Correo Electronico" description="Ingrese su correo electronico registrado para continuar">
            <FormWithIcons
                config={emailForm}
                register={register}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                errors={errors}
            >
                <div>
                    <BlueButton
                        text={loading ? "Enviando..." : emailForm.buttonText}
                        icon={emailForm.buttonIcon}
                        type="submit"
                        disabled={loading}
                    />
                </div>
            </FormWithIcons>

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
