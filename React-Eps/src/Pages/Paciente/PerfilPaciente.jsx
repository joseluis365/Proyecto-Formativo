import { useEffect, useState } from "react";
import { useLayout } from "../../LayoutContext";
import api from "../../Api/axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import PrincipalText from "../../components/Users/PrincipalText";
import BlueButton from "../../components/UI/BlueButton";

export default function PerfilPaciente() {
    const { setTitle, setSubtitle } = useLayout();
    const navigate = useNavigate();
    const initialUser = JSON.parse(localStorage.getItem('user') || '{}');
    const [user, setUser] = useState(initialUser);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        telefono: initialUser.telefono || "",
        direccion: initialUser.direccion || "",
        email: initialUser.email || ""
    });

    useEffect(() => {
        setTitle("Mi Perfil");
        setSubtitle("Gestiona tu información personal y cuenta.");
        setHelpContent({
            title: "Configuración de Perfil",
            description: "En esta sección puedes consultar tus datos básicos y modificar tu información de contacto.",
            sections: [
                {
                    title: "Información Básica",
                    type: "text",
                    content: "Los campos como Nombre, Documento y Rol no pueden ser modificados directamente por seguridad. Si hay un error, contacta a soporte."
                },
                {
                    title: "Datos de Contacto",
                    type: "tip",
                    content: "Es muy importante mantener actualizado tu teléfono y correo, ya que a través de ellos recibirás recordatorios y notificaciones de citas."
                }
            ]
        });
        return () => setHelpContent(null);
    }, [setTitle, setSubtitle, setHelpContent]);

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: '¿Cerrar sesión?',
            text: "Tendrás que ingresar tus credenciales nuevamente.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Sí, cerrar sesión',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await api.post('/logout');
            } catch (error) {
                console.error("Error al cerrar sesión", error);
            } finally {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            }
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.put(`/usuario/${user.documento}`, {
                ...user,
                ...formData
            });

            // Actualizar localstorage con los nuevos datos
            const updatedUser = { ...user, ...formData };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);

            Swal.fire({
                icon: 'success',
                title: 'Perfil Actualizado',
                text: 'Tus datos se han guardado correctamente.',
                showConfirmButton: false,
                timer: 1500
            });
        } catch (error) {
            console.error("Error al actualizar perfil:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron guardar los cambios. Inténtalo de nuevo.'
            });
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = "w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-primary outline-none transition-all dark:text-white text-sm font-medium";
    const labelClasses = "text-[10px] font-black uppercase tracking-widest text-primary/60 mb-2 block ml-1";

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-10">
            <PrincipalText
                icon="account_circle"
                text="Información Personal"
            />

            <form onSubmit={handleSave} className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 md:p-10 shadow-xl border border-neutral-gray-border/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Campos No Editables */}
                    <div className="space-y-6">
                        <div>
                            <label className={labelClasses}>Nombre Completo</label>
                            <input
                                type="text"
                                readOnly
                                value={`${user.primer_nombre} ${user.primer_apellido}`}
                                className={`${inputClasses} opacity-60 cursor-not-allowed`}
                            />
                        </div>
                        <div>
                            <label className={labelClasses}>Documento de Identidad</label>
                            <input
                                type="text"
                                readOnly
                                value={user.documento}
                                className={`${inputClasses} opacity-60 cursor-not-allowed`}
                            />
                        </div>
                        <div>
                            <label className={labelClasses}>Rol en el Sistema</label>
                            <input
                                type="text"
                                readOnly
                                value="Paciente"
                                className={`${inputClasses} opacity-60 cursor-not-allowed`}
                            />
                        </div>
                    </div>

                    {/* Campos Editables */}
                    <div className="space-y-6">
                        <div>
                            <label className={labelClasses}>Teléfono de Contacto</label>
                            <input
                                type="text"
                                value={formData.telefono}
                                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                                className={inputClasses}
                                placeholder="Ingresa tu teléfono"
                            />
                        </div>
                        <div>
                            <label className={labelClasses}>Dirección de Residencia</label>
                            <input
                                type="text"
                                value={formData.direccion}
                                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                                className={inputClasses}
                                placeholder="Ingresa tu dirección"
                            />
                        </div>
                        <div>
                            <label className={labelClasses}>Correo Electrónico</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className={inputClasses}
                                placeholder="Ingresa tu correo"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-red-500 hover:text-red-600 font-black text-[10px] uppercase tracking-widest transition-all"
                    >
                        <span className="material-symbols-outlined text-lg">logout</span>
                        Cerrar Sesión
                    </button>

                    <div className="w-full sm:w-auto min-w-[200px]">
                        <BlueButton
                            text="Guardar Cambios"
                            icon="save"
                            loading={loading}
                            type="submit"
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}
