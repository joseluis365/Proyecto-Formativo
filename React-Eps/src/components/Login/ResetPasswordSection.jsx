import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "./Layout";
import { resetPasswordForm } from "../../data/InicioForms";
import FormWithIcons from "../UI/FormWithIcons";
import BlueButton from "../UI/BlueButton";
import api from "../../Api/axios";
import Swal from "sweetalert2";

export default function ResetPasswordSection() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ password: "", confirmPassword: "" });

    const email = sessionStorage.getItem("recovery_email");
    const code = sessionStorage.getItem("recovery_code");

    useEffect(() => {
        if (!email || !code) {
            navigate("/forgot-password");
        }
    }, [email, code, navigate]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            Swal.fire({
                icon: 'warning',
                title: 'Contraseñas no coinciden',
                text: 'Por favor verifique que ambas contraseñas sean iguales'
            });
            return;
        }

        setLoading(true);
        try {
            await api.post("/reset-password", {
                email,
                code,
                password: formData.password
            });

            await Swal.fire({
                icon: 'success',
                title: 'Contraseña actualizada',
                text: 'Ahora puede iniciar sesión con su nueva contraseña',
                timer: 2000,
                showConfirmButton: false
            });

            sessionStorage.removeItem("recovery_email");
            sessionStorage.removeItem("recovery_code");
            navigate("/login");
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || "Error al restablecer contraseña",
            });
            setLoading(false);
        }
    };

    return (
        <Layout title="Restablecer Contraseña" description="Ingrese su nueva contraseña para restablecerla">
            <FormWithIcons
                config={resetPasswordForm}
                onChange={handleChange}
                onSubmit={handleSubmit}
            />

            <div onClick={handleSubmit}>
                <BlueButton
                    text={loading ? "Actualizando..." : resetPasswordForm.buttonText}
                    icon={resetPasswordForm.buttonIcon}
                    disabled={loading}
                />
            </div>
        </Layout>
    )
}