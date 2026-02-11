import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Formbuilder from "../../components/UI/Formbuilder";
import BlueButton from "../../components/UI/BlueButton";
import { superAdminRecoveryCode } from "../../data/SuperAdminForms";
import api from "../../Api/axios";

export default function SuperAdminRecoveryCode() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [code, setCode] = useState("");
    const email = sessionStorage.getItem("recovery_email");

    useEffect(() => {
        if (!email) {
            navigate("/SuperAdmin-ForgotPassword");
        }
    }, [email, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!code) return alert("Ingrese el código");

        setLoading(true);
        try {
            const response = await api.post("/superadmin/verify-recovery-code", { email, code });

            if (response.status === 200) {
                sessionStorage.setItem("recovery_code", code); // Guardar código verificado para el reset
                navigate("/SuperAdmin-ResetPassword");
            }
        } catch (error) {
            const message = error.response?.data?.message || "Código inválido";
            alert(message);
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

                <Formbuilder
                    config={superAdminRecoveryCode}
                    onChange={(field, value) => setCode(value)}
                    onSubmit={handleSubmit}
                >
                    <BlueButton
                        text={loading ? "Verificando..." : superAdminRecoveryCode.buttonText}
                        icon={superAdminRecoveryCode.buttonIcon}
                        type="submit"
                        disabled={loading}
                    />
                </Formbuilder>
            </div>
        </div>
    );
}
