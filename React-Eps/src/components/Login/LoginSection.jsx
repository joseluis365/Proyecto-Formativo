import { Link, useNavigate } from "react-router-dom";
import Layout from "./Layout";
import FormWithIcons from "../UI/FormWithIcons";
import { loginForm } from "../../data/InicioForms";
import BlueButton from "../UI/BlueButton";
import CheckBox from "../UI/CheckBox";
import api from "../../Api/axios";
import Swal from 'sweetalert2';
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userLoginSchema } from "../../schemas/authSchemas";
import { handleApiErrors } from "../../utils/formHandlers";
import { ROLES } from "@/constants/roles";

export default function LoginSection() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

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
            // El interceptor devuelve directamente response.data.data
            const loginData = await api.post('/login', data);

            const { access_token, user } = loginData;

            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify(user));

            Swal.fire({
                icon: 'success',
                title: 'Bienvenido',
                text: 'Inicio de sesión exitoso',
                timer: 1500,
                showConfirmButton: false
            });

            // Redirección basada en el rol del usuario
            const rolId = Number(user.id_rol);

            switch (rolId) {
                case ROLES.SUPER_ADMIN:
                    navigate('/SuperAdmin-Dashboard');
                    break;

                case ROLES.ADMIN:
                case ROLES.PERSONAL_ADMINISTRATIVO:
                    navigate('/dashboard');
                    break;

                case ROLES.MEDICO:
                    navigate('/medico/agenda');
                    break;

                case ROLES.PACIENTE:
                    navigate('/paciente');
                    break;

                case ROLES.FARMACEUTICO:
                    navigate('/farmacia');
                    break;

                default:
                    navigate('/dashboard');
                    break;
            }

        } catch (error) {
            // handleApiErrors procesa errores 422 automáticamente
            if (!handleApiErrors(error, setError)) {
                // El interceptor global ya maneja 401, 403 y 500 con Swal.
                // Aquí solo capturamos errores que no fueron manejados globalmente o lógica específica.
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
