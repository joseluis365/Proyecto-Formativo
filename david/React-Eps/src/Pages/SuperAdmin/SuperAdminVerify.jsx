import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Formbuilder from "../../components/UI/Formbuilder";
import BlueButton from "../../components/UI/BlueButton";
import { superAdminVerify } from "../../data/SuperAdminForms";

export default function SuperAdminVerify() {
  const navigate = useNavigate();

  const [code, setCode] = useState("");

  const email = sessionStorage.getItem("superadmin_email");

  useEffect(() => {
    if (!email) {
      navigate("/SuperAdmin-Login");
    }
  }, [email, navigate]);

  const handleChange = (field, value) => {
    const safeField = field ? String(field).toLowerCase() : "";
    const safeValue = value ?? "";

    if (
      safeField === "code" ||
      safeField === "codigo" ||
      safeField === "otp"
    ) {
      setCode(safeValue);
    }
  };

  const handleVerify = async () => {
    if (!code || code.length !== 6) {
      alert("Ingrese el código de 6 dígitos");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/superadmin/verificar-codigo",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email,
            code: code, // ✅ NOMBRE CORRECTO
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "Código incorrecto o expirado");
        return;
      }

      // ✅ Autenticación completa
      navigate("/SuperAdmin-Dashboard");
    } catch (error) {
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          Verificar código
        </h1>

        <Formbuilder
          config={superAdminVerify}
          onChange={handleChange}
          onSubmit={(e) => {
            e.preventDefault();
            handleVerify();
          }}
        >
          <BlueButton
            text={superAdminVerify.buttonText}
            icon={superAdminVerify.buttonIcon}
            type="submit"
          />
        </Formbuilder>

        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <p className="text-gray-600 dark:text-gray-300 text-xs">
            Ingrese el código de 6 dígitos enviado a su correo electrónico.
          </p>
        </div>
      </div>
    </div>
  );
}
