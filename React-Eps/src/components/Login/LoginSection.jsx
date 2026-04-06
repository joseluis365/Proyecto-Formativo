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
// Icons
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import LocalPhoneRoundedIcon from '@mui/icons-material/LocalPhoneRounded';
import HelpCenterRoundedIcon from '@mui/icons-material/HelpCenterRounded';
// Modals
import BaseModal from "../Modals/BaseModal";
import ModalHeader from "../Modals/ModalHeader";
import PrivacyPolicyModal from "../Modals/PrivacyPolicyModal";


export default function LoginSection() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    // Modal states
    const [showPrivacy, setShowPrivacy] = useState(false);
    const [showHelp, setShowHelp] = useState(false);

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
                    <VerifiedUserRoundedIcon sx={{ fontSize: '1.25rem' }} className="text-primary mt-0.5" />
                    <div className="flex flex-col gap-1">
                        <p className="text-[#0d121b] dark:text-white text-xs font-bold">Acceso protegido</p>
                        <p className="text-[#4c669a] text-[11px] leading-relaxed">
                            La información médica es privada y confidencial bajo la Ley de Protección de Datos Personales.
                        </p>
                        <button 
                            type="button"
                            onClick={() => setShowPrivacy(true)}
                            className="text-primary text-[11px] font-bold hover:underline mt-0.5 text-left w-fit border-none bg-transparent p-0 cursor-pointer"
                        >
                            Política de Privacidad
                        </button>
                    </div>
                </div>
                <div className="flex justify-center gap-6 mt-2">
                    <button 
                        type="button"
                        onClick={() => setShowHelp(true)}
                        className="text-[#4c669a] text-xs hover:text-primary flex items-center gap-1 border-none bg-transparent p-0 cursor-pointer"
                    >
                        <SupportAgentRoundedIcon sx={{ fontSize: '1rem' }} />
                        Ayuda
                    </button>
                </div>
            </div>

            {/* Modal: Política de Privacidad */}
            <PrivacyPolicyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />

            {/* Modal: Ayuda */}
            {showHelp && (
                <BaseModal onClose={() => setShowHelp(false)}>
                    <ModalHeader 
                        title="Centro de Ayuda" 
                        subtitle="Asistencia al Usuario"
                        icon={<HelpCenterRoundedIcon />}
                        onClose={() => setShowHelp(false)}
                    />
                    <div className="p-6 overflow-y-auto max-h-[60vh] flex flex-col gap-6 custom-scrollbar text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex flex-col gap-4 bg-primary/5 p-4 rounded-xl border border-primary/10">
                            <h3 className="font-bold text-primary flex items-center gap-2">
                                <LocalPhoneRoundedIcon sx={{ fontSize: '1.25rem' }} />
                                Línea de Atención al Usuario
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                Si presenta dificultades técnicas o requiere asistencia inmediata, comuníquese con nosotros:
                            </p>
                            <div className="flex flex-col gap-1">
                                <p className="font-bold text-lg text-primary">01-8000-123-456</p>
                                <p className="text-[10px] uppercase font-bold text-gray-400">Horario: Lunes a Viernes 7:00 AM - 7:00 PM</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <h4 className="font-bold text-gray-800 dark:text-white uppercase text-[10px] tracking-widest">Preguntas Frecuentes</h4>
                            
                            <details className="group border-b border-gray-100 dark:border-white/5 pb-2 cursor-pointer">
                                <summary className="font-semibold text-gray-700 dark:text-gray-200 list-none flex justify-between items-center group-open:text-primary transition-colors">
                                    ¿Cómo inicio sesión por primera vez?
                                    <span className="transition-transform group-open:rotate-180">↓</span>
                                </summary>
                                <p className="mt-2 text-xs leading-relaxed">
                                    Debe utilizar el correo electrónico registrado en su EPS y la contraseña temporal enviada a su e-mail al momento de la afiliación.
                                </p>
                            </details>

                            <details className="group border-b border-gray-100 dark:border-white/5 pb-2 cursor-pointer">
                                <summary className="font-semibold text-gray-700 dark:text-gray-200 list-none flex justify-between items-center group-open:text-primary transition-colors">
                                    Olvidé mi contraseña o no es válida
                                    <span className="transition-transform group-open:rotate-180">↓</span>
                                </summary>
                                <p className="mt-2 text-xs leading-relaxed">
                                    Use el enlace "¿Olvidaste tu contraseña?". Recibirá un <strong>código de seguridad (2FA)</strong> en su correo para validar su identidad y establecer una nueva contraseña de forma segura.
                                </p>
                            </details>
                        </div>
                    </div>
                </BaseModal>
            )}
        </Layout>
    )
}
