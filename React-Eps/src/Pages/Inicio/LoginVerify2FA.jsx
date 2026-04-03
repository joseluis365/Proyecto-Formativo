import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Login/Layout";
import FormWithIcons from "../../components/UI/FormWithIcons";
import { codeForm } from "../../data/InicioForms";
import BlueButton from "../../components/UI/BlueButton";
import api from "../../Api/axios";
import Swal from 'sweetalert2';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';


const verify2FASchema = z.object({
    code: z.string().min(6, "El código debe tener 6 dígitos").max(6, "El código debe tener 6 dígitos").regex(/^\d+$/, "Solo se permiten números")
});

export default function LoginVerify2FA() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const email = sessionStorage.getItem("2fa_email");

    useEffect(() => {
        if (!email) {
            navigate("/login");
        }
    }, [email, navigate]);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(verify2FASchema)
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await api.post("/verify-2fa", {
                email: email,
                code: data.code
            });

            const { access_token, user } = response;

            localStorage.setItem("token", access_token);
            localStorage.setItem("user", JSON.stringify(user));

            sessionStorage.removeItem("2fa_email");

            Swal.fire({
                icon: "success",
                title: "Bienvenido",
                text: "Verificación exitosa",
                timer: 1500,
                showConfirmButton: false
            });

            // Redirigir según el rol (Admin es 2)
            if (user.id_rol === 2) {
                navigate("/dashboard");
            } else if (user.id_rol === 1) {
                navigate("/SuperAdmin-Dashboard");
            } else {
                navigate("/dashboard");
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response?.data?.message || "Código incorrecto o expirado",
                confirmButtonColor: "#3085d6"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title="Verificar acceso" description="Ingrese el código de 6 dígitos que enviamos a su correo electrónico.">
            <FormWithIcons
                config={codeForm}
                register={register}
                errors={errors}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
            >
                <div className="flex flex-col gap-4">
                    <BlueButton text="Verificar Código" icon={<VerifiedRoundedIcon />} type="submit" loading={loading} />
                    <button 
                        type="button"
                        onClick={() => navigate("/login")}
                        className="text-xs text-primary font-bold hover:underline"
                    >
                        Volver al inicio de sesión
                    </button>
                </div>
            </FormWithIcons>
        </Layout>
    );
}
