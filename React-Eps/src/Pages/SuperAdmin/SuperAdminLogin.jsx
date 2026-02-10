import React, { useState } from "react";
import Formbuilder from "../../components/UI/Formbuilder";
import BlueButton from "../../components/UI/BlueButton";
import { superAdminLogin } from "../../data/SuperAdminForms";
import { Link } from "react-router-dom";

export default function SuperAdminLogin() {

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-300 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
          SuperAdmin Login
        </h1>

        {/* Formulario */}
        <Formbuilder config={superAdminLogin} onSubmit={(e) => {e.preventDefault(); console.log("Formulario enviado")}}/>
            <Link to="/SuperAdmin-Verify">
                <BlueButton text={superAdminLogin.buttonText} icon={superAdminLogin.buttonIcon}/>
            </Link>

        {/* Información adicional */}
        <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 flex items-start gap-3">
          <span className="material-symbols-outlined text-blue-600 text-2xl">security</span>
          <div className="flex flex-col gap-1">
            <p className="text-gray-800 dark:text-white font-semibold text-sm">Acceso restringido</p>
            <p className="text-gray-600 dark:text-gray-300 text-xs">
              Este módulo es únicamente para administradores. Toda acción queda registrada.
            </p>
          </div>
        </div>

        {/* Soporte */}
        <div className="mt-4 text-center">
          <a href="#" className="text-blue-600 dark:text-blue-400 text-sm hover:underline flex justify-center items-center gap-1">
            <span className="material-symbols-outlined text-sm">support_agent</span>
            Soporte
          </a>
        </div>
      </div>
    </div>
    )
}