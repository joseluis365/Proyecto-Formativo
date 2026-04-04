import superAdminApi from "../../Api/superadminAxios";

export default function SuperAdminVerify() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const email = sessionStorage.getItem("superadmin_email");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(superAdmin2FASchema),
    defaultValues: { email: email || "", code: "" }
  });

  useEffect(() => {
    const token = sessionStorage.getItem("superadmin_token");
    if (token) {
      // Ejecutamos logout en backend enviando el token (si el usuario retrocedió)
      superAdminApi.post("/superadmin/logout")
        .catch(() => console.log("Logout backend fallido o sesión ya muerta"));

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

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await superAdminApi.post("/superadmin/verificar-codigo", {
        email: data.email,
        code: data.code,
      });

      // ✅ Autenticación completa - Guardar Token
      // Nota: El interceptor de superAdminApi ya extrae response.data.data si existe.
      // Si el backend devuelve { success: true, data: { access_token: ... } }
      // result será { access_token: ... }
      if (result && result.access_token) {
        sessionStorage.setItem("superadmin_token", result.access_token);
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
      const errorMessage = error.response?.data?.message || 'Error de conexión con el servidor';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
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
          register={register}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          errors={errors}
        >
          <div className="flex justify-center w-full">
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
