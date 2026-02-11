import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import Layout from "./Layout";
import Formbuilder from "../UI/Formbuilder";
import { loginForm } from "../../data/InicioForms";
import BlueButton from "../UI/BlueButton";
import CheckBox from "../UI/CheckBox";
import api from "../../Api/axios"; // Import api instance
import Swal from 'sweetalert2'; // Import SweetAlert2
import { useState } from "react";

export default function LoginSection() {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        // Extract form data efficiently
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await api.post('/login', data);

            // Success
            const { access_token, user } = response.data;

            // Save token (localStorage for simplicity, or Context)
            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify(user));

            Swal.fire({
                icon: 'success',
                title: 'Bienvenido',
                text: 'Inicio de sesión exitoso',
                timer: 1500,
                showConfirmButton: false
            });

            // Redirect based on role
            if (user.id_rol === 1) { // Example: SuperAdmin
                navigate('/SuperAdmin-Dashboard');
            } else {
                navigate('/dashboard');
            }

        } catch (error) {
            console.error("Login error:", error);
            if (error.response?.status === 422) {
                // Validation errors
                setErrors(
                    Object.fromEntries(
                        Object.entries(error.response.data.errors).map(
                            ([key, value]) => [key, value[0]]
                        )
                    )
                );
            } else {
                const message = error.response?.data?.message || "Error al iniciar sesión";
                Swal.fire({
                    icon: 'error',
                    title: 'Error de acceso',
                    text: message,
                });
            }
        }
    };

    return (
        <Layout title="Iniciar sesión" description="Ingrese sus credenciales para acceder a su cuenta.">
            <Formbuilder config={loginForm} onSubmit={handleSubmit} errors={errors}>
                <div className="flex justify-between items-center">
                    <CheckBox label="Recordar sesión" id="remember" name="remember" />
                    <Link to="/confirm-email" className="text-primary text-xs font-bold hover:underline">¿Olvidaste tu contraseña?</Link>
                </div>
                <BlueButton text={loginForm.buttonText} icon={loginForm.buttonIcon} type="submit" loading={false} />
            </Formbuilder>
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
                    <Link className="text-[#4c669a] text-xs hover:text-primary flex items-center gap-1" href="#">
                        <span className="material-symbols-outlined text-sm">support_agent</span>
                        Ayuda
                    </Link>
                </div>
            </div>
        </Layout>
    )
}