import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Formbuilder from "../../components/UI/Formbuilder";
import BlueButton from "../../components/UI/BlueButton";
import Swal from 'sweetalert2';
import { superAdminVerify } from "../../data/SuperAdminForms";

export default function SuperAdminVerify() {
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  // Estado local para el email por si se pierde del storage, aunque idealmente viene del login
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
            code: code,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Código incorrecto o expirado',
          showConfirmButton: false,
          timer: 1000,
        });
        return;
      }

      // ✅ Autenticación completa - Guardar Token
      if (result.access_token) {
        sessionStorage.setItem("superadmin_token", result.access_token);
        // Opcional: Guardar usuario si se devuelve
        if (result.user) {
          sessionStorage.setItem("superadmin_user", JSON.stringify(result.user));
        }
      }

      Swal.fire({
        icon: 'success',
        title: 'Verificado',
        text: 'Código verificado correctamente',
        showConfirmButton: false,
        timer: 1000,
      });

      navigate("/SuperAdmin-Dashboard");
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error de conexión con el servidor',
        showConfirmButton: false,
        timer: 1000,
      });
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
