import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormWithIcons from "../../components/UI/FormWithIcons";
import BlueButton from "../../components/UI/BlueButton";
import { superAdminRecoveryCode } from "../../data/SuperAdminForms";
import api from "../../Api/axios";
import Swal from "sweetalert2";

export default function SuperAdminRecoveryCode() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [code, setCode] = useState("");
    const [errors, setErrors] = useState({});
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
            navigate("/SuperAdmin-ForgotPassword");
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
            const response = await api.post("/superadmin/forgot-password", { email });

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
                timerProgressBar: true,
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
                    showConfirmButton: true,
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response?.data?.message || "Error al reenviar el código",
                    showConfirmButton: true,
                });
            }
        } finally {
            setResendLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post("/superadmin/verify-recovery-code", { email, code });

            if (response.status === 200) {
                sessionStorage.setItem("recovery_code", code); // Guardar código verificado para el reset
                Swal.fire({
                    icon: "success",
                    title: "Código verificado",
                    text: "El código es correcto. Procede a cambiar tu contraseña.",
                    showConfirmButton: true,
                });
                navigate("/SuperAdmin-ResetPassword");
            }
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                const message = error.response?.data?.message || "Código inválido";
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: message,
                    showConfirmButton: true,
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-300 dark:bg-gray-900">
            <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
                    Verificar Código
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 text-center">
                    Hemos enviado un código a <strong>{email}</strong>
                </p>

                <FormWithIcons
                    config={superAdminRecoveryCode}
                    onChange={(field, value) => {
                        setCode(value);
                        setErrors((prev) => ({ ...prev, code: undefined }));
                    }}
                    onSubmit={handleSubmit}
                    errors={errors}
                >
                    <BlueButton
                        text={loading ? "Verificando..." : superAdminRecoveryCode.buttonText}
                        icon={superAdminRecoveryCode.buttonIcon}
                        type="submit"
                        disabled={loading || resendLoading}
                    />
                </FormWithIcons>

                <div className="flex flex-col items-center mt-6">
                    {timer > 0 ? (
                        <p className="text-gray-500 text-sm">Tiempo restante para nuevo código: {timer}s</p>
                    ) : (
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={attempts <= 0 || resendLoading}
                            className={`text-sm font-semibold transition-colors ${attempts <= 0 || resendLoading ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800 hover:underline'}`}>
                            {resendLoading ? 'Enviando...' : 'Clic aquí para enviar un nuevo código'}
                        </button>
                    )}
                    {attempts > 0 ? (
                        <p className="text-gray-400 text-xs mt-1">Límite: {attempts} códigos restantes</p>
                    ) : (
                        <p className="text-red-500 text-xs mt-1 font-semibold">Has agotado los intentos. Espera 30 minutos.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
