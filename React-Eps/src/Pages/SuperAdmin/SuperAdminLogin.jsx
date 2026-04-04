import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import FormWithIcons from "../../components/UI/FormWithIcons";
import BlueButton from "../../components/UI/BlueButton";
import { superAdminLogin } from "../../data/SuperAdminForms";
import Swal from 'sweetalert2';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { superAdminLoginSchema } from "../../schemas/authSchemas";
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';


import superAdminApi from "../../Api/superadminAxios";

export default function SuperAdminLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(superAdminLoginSchema)
  });

  // Limpiar sesión al cargar el login (Incluso si viene de atrás)
  useEffect(() => {
    const token = sessionStorage.getItem("superadmin_token");
    if (token) {
      // Ejecutamos logout en backend enviando el token
      superAdminApi.post("/superadmin/logout")
        .catch(() => console.log("Logout backend fallido o sesión ya muerta"));
    }

    sessionStorage.removeItem("superadmin_token");
    sessionStorage.removeItem("superadmin_user");
    sessionStorage.removeItem("superadmin_email");
  }, []);

  /**
   * 🔹 Login REAL (solo se ejecuta una vez)
   */
  const onSubmit = async (data) => {
    // 🛑 Evita doble clic
    if (loading) return;

    try {
      setLoading(true); // 🔒 Bloquear botón inmediatamente

      const result = await superAdminApi.post("/superadmin/login", {
        email: data.email,
        password: data.password,
      });

      // 👉 Guardamos email y redirigimos INMEDIATO
      sessionStorage.setItem("superadmin_email", data.email);
      navigate("/SuperAdmin-Verify");
    } catch (error) {
      if (error.response && error.response.status === 422) {
        const backendErrors = error.response.data.errors;
        Object.keys(backendErrors).forEach((key) => {
          setError(key, {
            type: "server",
            message: backendErrors[key][0],
          });
        });
      } else {
        // El interceptor de axios ya muestra el SweetAlert de error general
        console.error("Login fallido:", error);
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          SuperAdmin Login
        </h1>

        {/* ✅ FORM CORRECTO */}
        <FormWithIcons
          config={superAdminLogin}
          register={register}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          errors={errors}
        >
          {/* ✅ BOTÓN DENTRO DEL FORM */}
          <BlueButton
            text={loading ? "Enviando código..." : superAdminLogin.buttonText}
            icon={superAdminLogin.buttonIcon}
            type="submit"
            disabled={loading}
          />
        </FormWithIcons>

        <div className="mt-4 text-center">
          <Link to="/SuperAdmin-ForgotPassword" className="text-blue-600 hover:underline text-sm font-semibold">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {/* Info */}
        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 flex items-start gap-3">
          <SecurityRoundedIcon className="text-blue-600" sx={{ fontSize: '1.5rem' }} />
          <div className="flex flex-col gap-1">
            <p className="text-gray-800 dark:text-white font-semibold text-sm">
              Acceso restringido
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-xs">
              Este módulo es únicamente para administradores. Toda acción queda registrada.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
