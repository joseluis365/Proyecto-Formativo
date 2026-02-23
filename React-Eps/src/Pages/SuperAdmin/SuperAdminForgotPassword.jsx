import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Formbuilder from "../../components/UI/Formbuilder";
import BlueButton from "../../components/UI/BlueButton";
import { superAdminForgotPassword } from "../../data/SuperAdminForms";
import api from "../../Api/axios";
import Swal from "sweetalert2";

export default function SuperAdminForgotPassword() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        try {
            const response = await api.post("/superadmin/forgot-password", { email });

            if (response.status === 200) {
                sessionStorage.setItem("recovery_email", email);
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
                setErrors(error.response.data.errors);
            } else {
                const message = error.response?.data?.message || "Error al enviar código";
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: message,
                    timer: 1500,
                    showConfirmButton: false,
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

                <Formbuilder
                    config={superAdminForgotPassword}
                    onChange={(field, value) => {
                        setEmail(value);
                        setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    onSubmit={handleSubmit}
                    errors={errors}
                >
                    <BlueButton
                        text={loading ? "Enviando..." : superAdminForgotPassword.buttonText}
                        icon={superAdminForgotPassword.buttonIcon}
                        type="submit"
                        disabled={loading}
                    />
                </Formbuilder>

                <div className="mt-4 text-center">
                    <Link to="/SuperAdmin-Login" className="text-blue-600 hover:underline text-sm font-semibold">
                        Volver al inicio de sesión
                    </Link>
                </div>
            </div>
        </div>
    );
}
