import { Link, useNavigate } from "react-router-dom";
import Layout from "./Layout";
import FormWithIcons from "../UI/FormWithIcons";
import { loginForm } from "../../data/InicioForms";
import BlueButton from "../UI/BlueButton";
import CheckBox from "../UI/CheckBox";
import api from "../../Api/axios";
import Swal from 'sweetalert2';
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userLoginSchema } from "../../schemas/authSchemas";
import { handleApiErrors } from "../../utils/formHandlers";

export default function LoginSection() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Guard: si ya hay sesión activa, redirigir al dashboard correcto
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        if (token && userStr) {
            try {
                const user = JSON.parse(userStr);
                if (user.id_rol === 1) navigate('/SuperAdmin-Dashboard', { replace: true });
                else if (user.id_rol === 2) navigate('/dashboard', { replace: true });
                else if (user.id_rol === 6) navigate('/farmacia/dashboard', { replace: true });
                else if (user.id_rol === 5) navigate('/paciente', { replace: true });
                else if (user.id_rol === 3 && user.examenes) navigate('/examenes/agenda', { replace: true });
                else if (user.id_rol === 3 && !user.examenes) navigate('/personal/dashboard', { replace: true });
                else navigate('/dashboard', { replace: true });
            } catch (e) {
                navigate('/login', { replace: true });
            }
        } else if (token) {
            navigate('/login', { replace: true });
        }
    }, [navigate]);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(userLoginSchema)
    });

    const onSubmit = async (data) => {
        setLoading(true);

        try {
            // skipGlobalHandler: true → evita que el interceptor global muestre Swal propio
            const response = await api.post('/login', data, { skipGlobalHandler: true });

            // Manejo de verificación de doble factor (2FA)
            if (response.requires_2fa) {
                sessionStorage.setItem('2fa_email', response.email);
                Swal.fire({
                    icon: 'info',
                    title: 'Verificación requerida',
                    text: response.message || 'Se ha enviado un código a tu correo.',
                    timer: 3000,
                    showConfirmButton: false,
                    timerProgressBar: true
                });
                return navigate('/verify-2fa');
            }

            const { access_token, user } = response;

            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify(user));

            Swal.fire({
                icon: 'success',
                title: 'Bienvenido',
                text: 'Inicio de sesión exitoso',
                timer: 1500,
                showConfirmButton: false
            });

            if (user.id_rol === 1) {
                navigate('/SuperAdmin-Dashboard');
            } else if (user.id_rol === 2) {
                navigate('/dashboard');
            } else if (user.id_rol === 6) {
                navigate('/farmacia/dashboard');
            } else if (user.id_rol === 5) {
                navigate('/paciente');
            } else if (user.id_rol === 3 && user.examenes) {
                navigate('/examenes/agenda');
            } else if (user.id_rol === 3 && !user.examenes) {
                navigate('/personal/dashboard');
            } else {
                navigate('/dashboard');
            }

        } catch (error) {
            const status = error.response?.status;
            const backendMessage = error.response?.data?.message;

            if (status === 401) {
                Swal.fire({
                    icon: 'error',
                    title: 'Credenciales incorrectas',
                    text: 'El correo o la contraseña son incorrectos. Por favor, verifica e intenta de nuevo.',
                    confirmButtonColor: '#3085d6',
                });
            } else if (status === 403) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Acceso restringido',
                    text: backendMessage || 'Tu empresa no tiene una licencia activa. Contacta al administrador del sistema.',
                    confirmButtonColor: '#d33',
                });
            } else if (!handleApiErrors(error, setError)) {
                console.error("Login unexpected error:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title="Iniciar sesión" description="Ingrese sus credenciales para acceder a su cuenta.">
            <FormWithIcons
                config={loginForm}
                register={register}
                errors={errors}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
            >
                <div className="flex justify-between items-center">
                    <CheckBox label="Recordar sesión" id="remember" name="remember" />
                    <Link to="/confirm-email" className="text-primary text-xs font-bold hover:underline">¿Olvidaste tu contraseña?</Link>
                </div>
                <BlueButton text={loginForm.buttonText} icon={loginForm.buttonIcon} type="submit" loading={loading} />
            </FormWithIcons>
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
                <div className="flex justify-center gap-6 mt-2">
                    <Link className="text-[#4c669a] text-xs hover:text-primary flex items-center gap-1" to="#">
                        <span className="material-symbols-outlined text-sm">support_agent</span>
                        Ayuda
                    </Link>
                </div>
            </div>
        </Layout>
    )
}
