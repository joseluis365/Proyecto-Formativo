import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Formbuilder from "../../components/UI/Formbuilder";
import BlueButton from "../../components/UI/BlueButton";
import { superAdminLogin } from "../../data/SuperAdminForms";

export default function SuperAdminLogin() {
  const navigate = useNavigate();

  // 🔹 Estado del formulario
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // 🔹 Estado de carga (bloquea múltiples envíos)
  const [loading, setLoading] = useState(false);

  /**
   * 🔹 Captura cambios del Formbuilder
   */
  const handleChange = (field, value) => {
    const safeField = field ? String(field).toLowerCase() : "";
    const safeValue = value ?? "";

    if (safeField === "correo" || safeField === "email") {
      setFormData((prev) => ({ ...prev, email: safeValue }));
    }

    if (safeField === "clave" || safeField === "password") {
      setFormData((prev) => ({ ...prev, password: safeValue }));
    }
  };

  /**
   * 🔹 Login REAL (solo se ejecuta una vez)
   */
  const handleLogin = async () => {
    // 🛑 Evita doble clic
    if (loading) return;

    if (!formData.email || !formData.password) {
      alert("Debes ingresar correo y contraseña");
      return;
    }

    try {
      setLoading(true); // 🔒 Bloquear botón inmediatamente

      const response = await fetch(
        "http://127.0.0.1:8000/api/superadmin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "Credenciales inválidas");
        setLoading(false); // 🔓 Libera si falla
        return;
      }

      // 👉 Guardamos email y redirigimos INMEDIATO
      sessionStorage.setItem("superadmin_email", formData.email);
      navigate("/SuperAdmin-Verify");
    } catch (error) {
      alert("Error de conexión con el servidor");
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
        <Formbuilder
          config={superAdminLogin}
          onChange={handleChange}
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          {/* ✅ BOTÓN DENTRO DEL FORM */}
          <BlueButton
            text={loading ? "Enviando código..." : superAdminLogin.buttonText}
            icon={superAdminLogin.buttonIcon}
            type="submit"
            disabled={loading}
          />
        </Formbuilder>

        {/* Info */}
        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 flex items-start gap-3">
          <span className="material-symbols-outlined text-blue-600 text-2xl">
            security
          </span>
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
