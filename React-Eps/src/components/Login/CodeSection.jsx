import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "./Layout";
import { codeForm } from "../../data/InicioForms";
import FormBuilder from "../UI/Formbuilder";
import BlueButton from "../UI/BlueButton";
import api from "../../Api/axios";
import Swal from "sweetalert2";

export default function CodeSection() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [code, setCode] = useState("");
    const email = sessionStorage.getItem("recovery_email");

    useEffect(() => {
        if (!email) {
            navigate("/forgot-password");
        }
    }, [email, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!code) return;

        setLoading(true);
        try {
            await api.post("/verify-recovery-code", { email, code });
            sessionStorage.setItem("recovery_code", code);

            Swal.fire({
                icon: 'success',
                title: 'Código verificado',
                timer: 1500,
                showConfirmButton: false
            });

            navigate("/reset-password");
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || "Código inválido o expirado",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title="Verificar Código" description={`Ingrese el código enviado a ${email}`}>
            <FormBuilder
                config={codeForm}
                onChange={(field, value) => setCode(value)}
                onSubmit={handleSubmit}
            />

            <div onClick={handleSubmit}>
                <BlueButton
                    text={loading ? "Verificando..." : codeForm.buttonText}
                    icon={codeForm.buttonIcon}
                    disabled={loading}
                />
            </div>

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
            </div>
        </Layout>
    )
}