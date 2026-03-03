import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "./Layout";
import { resetPasswordForm } from "../../data/InicioForms";
import FormWithIcons from "../UI/FormWithIcons";
import BlueButton from "../UI/BlueButton";
import api from "../../Api/axios";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userResetPasswordSchema } from "../../schemas/authSchemas";

export default function ResetPasswordSection() {
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
        resolver: zodResolver(userResetPasswordSchema),
        defaultValues: { email: email || "", code: code || "", password: "", confirmPassword: "" },
        mode: "onChange"
    });

    const watchPassword = watch("password");

    useEffect(() => {
        if (watchPassword) {
            trigger("confirmPassword");
        }
    }, [watchPassword, trigger]);

    useEffect(() => {
        if (!email || !code) {
            navigate("/forgot-password");
        }
    }, [email, code, navigate]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await api.post("/reset-password", {
                email: data.email,
                code: data.code,
                password: data.password
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
                    text: error.response?.data?.message || "Error al restablecer contraseña",
                });
            }
            setLoading(false);
        }
    };

    return (
        <Layout title="Restablecer Contraseña" description="Ingrese su nueva contraseña para restablecerla">
            <FormWithIcons
                config={resetPasswordForm}
                register={register}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                errors={errors}
            >
                <div>
                    <BlueButton
                        text={loading ? "Actualizando..." : resetPasswordForm.buttonText}
                        icon={resetPasswordForm.buttonIcon}
                        type="submit"
                        disabled={loading}
                    />
                </div>
            </FormWithIcons>
        </Layout>
    )
}
