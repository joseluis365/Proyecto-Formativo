import Formbuilder from "../../components/UI/Formbuilder";
import BlueButton from "../../components/UI/BlueButton";
import { superAdminVerify } from "../../data/SuperAdminForms";
import { Link } from "react-router-dom";

export default function SuperAdminVerify() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-300 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          Verificar Codigo
        </h1>

        {/* Formulario */}
        <Formbuilder config={superAdminVerify} onSubmit={(e) => {e.preventDefault(); console.log("Formulario enviado")}}/>
            <Link to="/SuperAdmin-Dashboard">
                <BlueButton text={superAdminVerify.buttonText} icon={superAdminVerify.buttonIcon}/>
            </Link>

        {/* Información adicional */}
        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 flex items-start gap-3">
          <div className="flex flex-col gap-1">
            <p className="text-gray-600 dark:text-gray-300 text-xs">
              Ingrese el código de 6 dígitos enviado a su correo electrónico.
            </p>
          </div>
        </div>
      </div>
    </div>
    )
}