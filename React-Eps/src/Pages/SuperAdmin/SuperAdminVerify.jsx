import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormWithIcons from "../../components/UI/FormWithIcons";
import BlueButton from "../../components/UI/BlueButton";
import Swal from 'sweetalert2';
import { superAdminVerify } from "../../data/SuperAdminForms";

export default function SuperAdminVerify() {
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  // Estado local para el email por si se pierde del storage, aunque idealmente viene del login
  const email = sessionStorage.getItem("superadmin_email");

  useEffect(() => {
    const token = sessionStorage.getItem("superadmin_token");
    if (token) {
      // Ejecutamos logout en backend enviando el token (si el usuario retrocedió)
      fetch("http://127.0.0.1:8000/api/superadmin/logout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      }).catch(() => console.log("Logout backend fallido o sesión ya muerta"));

      sessionStorage.removeItem("superadmin_token");
      sessionStorage.removeItem("superadmin_user");
      sessionStorage.removeItem("superadmin_email");
      navigate("/SuperAdmin-Login");
      return;
    }

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
      // Limpiar error al escribir
      if (errors[safeField]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[safeField];
          return newErrors;
        });
      }
    }
  };

  const handleVerify = async () => {
    setErrors({});

    // Validación: Exactamente 6 dígitos, sin espacios, letras, ni negativos
    if (!/^\d{6}$/.test(code)) {
      setErrors({ code: "El código debe contener exactamente 6 dígitos numéricos." });
      return;
    }

    setLoading(true);
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
          text: 'Código incorrecto o expirado, por favor intentalo nuevamente',
          showConfirmButton: true,
        });
        setLoading(false);
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
        timer: 1500,
        timerProgressBar: true,
      });

      navigate("/SuperAdmin-Dashboard");
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error de conexión con el servidor',
        showConfirmButton: false,
        timer: 1200,
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          Verificar código
        </h1>

        <FormWithIcons
          config={superAdminVerify}
          onChange={handleChange}
          errors={errors}
          onSubmit={(e) => {
            e.preventDefault();
            handleVerify();
          }}
        >
          <div className="flex justify-center w-full" onClick={!loading ? handleVerify : undefined}>
            <BlueButton
              text={loading ? "Verificando..." : superAdminVerify.buttonText}
              icon={superAdminVerify.buttonIcon}
              disabled={loading}
              type="submit"
            />
          </div>
        </FormWithIcons>

        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
          <p className="text-gray-600 dark:text-gray-300 text-xs">
            Ingrese el código de 6 dígitos enviado a su correo electrónico.
          </p>
        </div>
      </div>
    </div>
  );
}
