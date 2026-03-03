import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import FormWithIcons from "../../components/UI/FormWithIcons";
import BlueButton from "../../components/UI/BlueButton";
import { superAdminForgotPassword } from "../../data/SuperAdminForms";
import api from "../../Api/axios";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { superAdminRecoveryEmailSchema } from "../../schemas/authSchemas";

export default function SuperAdminForgotPassword() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(superAdminRecoveryEmailSchema)
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await api.post("/superadmin/forgot-password", { email: data.email });

            if (response.status === 200) {
                sessionStorage.setItem("recovery_email", data.email);
                sessionStorage.setItem("recovery_timer_end", Date.now() + 30000);
                if (response.data?.available_attempts !== undefined) {
                    sessionStorage.setItem("recovery_attempts", response.data.available_attempts);
                }
                Swal.fire({
                    icon: "success",
                    title: "Código enviado",
                    text: "Código de verificación enviado a tu correo",
                    timer: 1500,
                    showConfirmButton: false,
                });
                navigate("/SuperAdmin-RecoveryCode");
            }
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
                const message = error.response?.data?.message || "Error al enviar código";
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
                    Recuperar Contraseña
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 text-center">
                    Ingrese su correo electrónico para recibir un código de recuperación.
                </p>

                <FormWithIcons
                    config={superAdminForgotPassword}
                    register={register}
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    errors={errors}
                >
                    <BlueButton
                        text={loading ? "Enviando..." : superAdminForgotPassword.buttonText}
                        icon={superAdminForgotPassword.buttonIcon}
                        type="submit"
                        disabled={loading}
                    />
                </FormWithIcons>

                <div className="mt-4 text-center">
                    <Link to="/SuperAdmin-Login" className="text-blue-600 hover:underline text-sm font-semibold">
                        Volver al inicio de sesión
                    </Link>
                </div>
            </div>
        </div>
    );
}
