import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormWithIcons from "../../components/UI/FormWithIcons";
import BlueButton from "../../components/UI/BlueButton";
import { superAdminResetPassword } from "../../data/SuperAdminForms";
import api from "../../Api/axios";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { superAdminResetPasswordSchema } from "../../schemas/authSchemas";

export default function SuperAdminResetPassword() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const email = sessionStorage.getItem("recovery_email");
    const code = sessionStorage.getItem("recovery_code");

    const {
        register,
        handleSubmit,
        setError,
        watch,
        trigger,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(superAdminResetPasswordSchema),
        defaultValues: { email: email || "", code: code || "", password: "", password_confirmation: "" },
        mode: "onChange"
    });

    const watchPassword = watch("password");

    useEffect(() => {
        if (watchPassword) {
            trigger("password_confirmation");
        }
    }, [watchPassword, trigger]);

    useEffect(() => {
        if (!email || !code) {
            navigate("/SuperAdmin-Login");
        }
    }, [email, code, navigate]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await api.post("/superadmin/reset-password", {
                email: data.email,
                code: data.code,
                password: data.password,
                password_confirmation: data.password_confirmation
            });

            if (response.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Éxito",
                    text: "Contraseña restablecida correctamente",
                    timer: 1500,
                    showConfirmButton: false,
                });
                // Limpiar sesión de recuperación
                sessionStorage.removeItem("recovery_email");
                sessionStorage.removeItem("recovery_code");
                navigate("/SuperAdmin-Login");
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
                const message = error.response?.data?.message || "Error al restablecer contraseña";
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
                    Restablecer Contraseña
                </h1>

                <FormWithIcons
                    config={superAdminResetPassword}
                    register={register}
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    errors={errors}
                >
                    <BlueButton
                        text={loading ? "Guardando..." : superAdminResetPassword.buttonText}
                        icon={superAdminResetPassword.buttonIcon}
                        type="submit"
                        disabled={loading}
                    />
                </FormWithIcons>
            </div>
        </div>
    );
}
