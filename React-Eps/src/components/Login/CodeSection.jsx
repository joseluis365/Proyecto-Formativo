import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "./Layout";
import { codeForm } from "../../data/InicioForms";
import FormWithIcons from "../UI/FormWithIcons";
import BlueButton from "../UI/BlueButton";
import api from "../../Api/axios";
import Swal from "sweetalert2";

export default function CodeSection() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [code, setCode] = useState("");
    const email = sessionStorage.getItem("recovery_email");

    const [timer, setTimer] = useState(() => {
        const timerEnd = sessionStorage.getItem("recovery_timer_end");
        if (timerEnd) {
            const remaining = Math.max(0, Math.ceil((parseInt(timerEnd) - Date.now()) / 1000));
            return remaining;
        }
        return 0;
    });
    const [attempts, setAttempts] = useState(
        sessionStorage.getItem("recovery_attempts")
            ? parseInt(sessionStorage.getItem("recovery_attempts"))
            : 4
    );

    useEffect(() => {
        if (!email) {
            navigate("/forgot-password");
        }
    }, [email, navigate]);

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                const timerEnd = sessionStorage.getItem("recovery_timer_end");
                if (timerEnd) {
                    const remaining = Math.max(0, Math.ceil((parseInt(timerEnd) - Date.now()) / 1000));
                    setTimer(remaining);
                } else {
                    setTimer(0);
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleResend = async () => {
        if (timer > 0 || attempts <= 0) return;

        setResendLoading(true);
        try {
            const response = await api.post("/forgot-password", { email });

            const newAttempts = response.data?.available_attempts !== undefined ? response.data.available_attempts : attempts - 1;
            setAttempts(newAttempts);
            sessionStorage.setItem("recovery_attempts", newAttempts);
            setTimer(30);
            sessionStorage.setItem("recovery_timer_end", Date.now() + 30000);

            Swal.fire({
                icon: 'success',
                title: 'Código reenviado',
                text: 'Se ha enviado un nuevo código a tu correo.',
                timer: 2000,
                showConfirmButton: false,
            });
        } catch (error) {
            if (error.response?.status === 429) {
                const waitTime = error.response.data?.remaining_time || 30;
                setTimer(waitTime);
                sessionStorage.setItem("recovery_timer_end", Date.now() + (waitTime * 1000));

                const remainingAttempts = error.response.data?.available_attempts;
                if (remainingAttempts !== undefined) {
                    setAttempts(remainingAttempts);
                    sessionStorage.setItem("recovery_attempts", remainingAttempts);
                }

                Swal.fire({
                    icon: 'warning',
                    title: 'Límite alcanzado',
                    text: error.response?.data?.message || 'Por favor, espera antes de intentar nuevamente.',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response?.data?.message || "Error al reenviar el código",
                });
            }
        } finally {
            setResendLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!code) return;

        setLoading(true);
        try {
            await api.post("/verify-recovery-code", { email, code });
            sessionStorage.setItem("recovery_code", code);

            Swal.fire({
                icon: 'success',
                title: 'Código verificado',
                timer: 1500,
                showConfirmButton: false
            });

            navigate("/reset-password");
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || "Código inválido o expirado",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title="Verificar Código" description={`Ingrese el código enviado a ${email}`}>
            <FormWithIcons
                config={codeForm}
                onChange={(field, value) => setCode(value)}
                onSubmit={handleSubmit}
            />

            <div onClick={resendLoading ? undefined : handleSubmit}>
                <BlueButton
                    text={loading ? "Verificando..." : codeForm.buttonText}
                    icon={codeForm.buttonIcon}
                    disabled={loading || resendLoading}
                />
            </div>

            <div className="flex flex-col items-center mt-5 mb-2">
                {timer > 0 ? (
                    <p className="text-gray-500 text-sm">Tiempo restante para nuevo código: {timer}s</p>
                ) : (
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={attempts <= 0 || resendLoading}
                        className={`text-sm font-semibold transition-colors ${attempts <= 0 || resendLoading ? 'text-gray-400 cursor-not-allowed' : 'text-primary hover:text-[#0C628B] hover:underline'}`}>
                        {resendLoading ? 'Enviando...' : 'Clic aquí para enviar un nuevo código'}
                    </button>
                )}
                {attempts > 0 ? (
                    <p className="text-gray-400 text-xs mt-1">Límite: {attempts} correos restantes</p>
                ) : (
                    <p className="text-red-500 text-xs mt-1 font-semibold">Has agotado los intentos. Espera 30 minutos.</p>
                )}
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