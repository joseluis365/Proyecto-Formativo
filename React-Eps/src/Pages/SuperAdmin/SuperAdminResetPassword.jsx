import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Formbuilder from "../../components/UI/Formbuilder";
import BlueButton from "../../components/UI/BlueButton";
import { superAdminResetPassword } from "../../data/SuperAdminForms";
import api from "../../Api/superadminAxios";

export default function SuperAdminResetPassword() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ password: "", password_confirmation: "" });

    const email = sessionStorage.getItem("recovery_email");
    const code = sessionStorage.getItem("recovery_code");

    useEffect(() => {
        if (!email || !code) {
            navigate("/SuperAdmin-ForgotPassword");
        }
    }, [email, code, navigate]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.password_confirmation) {
            return alert("Las contraseñas no coinciden");
        }

        setLoading(true);
        try {
            const response = await api.post("/superadmin/reset-password", {
                email,
                code,
                password: formData.password,
                password_confirmation: formData.password_confirmation
            });

            if (response.status === 200) {
                alert("Contraseña restablecida correctamente");
                // Limpiar sesión de recuperación
                sessionStorage.removeItem("recovery_email");
                sessionStorage.removeItem("recovery_code");
                navigate("/SuperAdmin-Login");
            }
        } catch (error) {
            const message = error.response?.data?.message || "Error al restablecer contraseña";
            alert(message);
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

                <Formbuilder
                    config={superAdminResetPassword}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                >
                    <BlueButton
                        text={loading ? "Guardando..." : superAdminResetPassword.buttonText}
                        icon={superAdminResetPassword.buttonIcon}
                        type="submit"
                        disabled={loading}
                    />
                </Formbuilder>
            </div>
        </div>
    );
}
