import React, { useEffect, useState } from "react";
import BlueButton from "../UI/BlueButton";

export default function Form({
  fields = [],
  sections = [],
  onSubmit, // Función que el padre quiere ejecutar al final (handleCreate/handleUpdate)
  handleSubmit, // Función handleSubmit de react-hook-form
  register, // Función register de react-hook-form
  loading,
  errors = {},
  showDeleteButton = false,
  onDelete,
}) {
  const togglePasswordVisibility = (fieldName) => {
    setShowPasswords(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  const renderField = (field) => {
    const error = errors[field.name];

    return (
      <div key={field.name} className="space-y-1">
        {/* Label */}
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor={field.name}>
          {field.label}
        </label>

        {/* SELECT */}
        {field.type === "select" ? (
          <select
            {...(register ? register(field.name) : {})}
            id={field.name}
            readOnly={field.readOnly}
            className={`border rounded px-3 py-2 w-full bg-white dark:bg-gray-800 dark:text-white dark:border-gray-700
          ${error ? "border-red-500" : "border-gray-300"}
        `}
          >
            <option value="">Seleccionar</option>
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          /* INPUT */
          <div className="relative">
            <input
              {...(register ? register(field.name) : {})}
              id={field.name}
              readOnly={field.readOnly}
              disabled={field.disabled}
              type={field.type === "password" && showPasswords[field.name] ? "text" : field.type}
              placeholder={field.placeholder || field.label}
              className={`border rounded px-3 py-2 w-full bg-white dark:bg-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 ${error ? "border-red-500 dark:border-red-500" : "border-gray-300 dark:border-gray-700"} ${field.type === "password" ? 'pr-12' : ''}`}
            />
            {field.type === "password" && (
              <button
                type="button"
                onClick={() => togglePasswordVisibility(field.name)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none flex items-center justify-center p-1"
                title={showPasswords[field.name] ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPasswords[field.name] ? 'visibility' : 'visibility_off'}
                </span>
              </button>
            )}
          </div>
        )}
        {error && (
          <p className="text-red-500 text-sm transition-all">{error.message || error}</p>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit ? handleSubmit(onSubmit) : onSubmit} className="space-y-4" >
      {sections && sections.length > 0 ? (
        sections.map((section, idx) => (
          <div key={idx} className="space-y-4">
            {section.title && (
              <h3 className="text-base font-medium text-gray-800 border-b pb-2 dark:text-gray-200 dark:border-gray-700">
                {section.title}
              </h3>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.fields.map(renderField)}
            </div>
          </div>
        ))
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map(renderField)}
        </div>
      )}
      <div className="flex mt-10 justify-end gap-10">
        {showDeleteButton && onDelete && (
          <button
            type="button"
            onClick={onDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700
                    text-white cursor-pointer rounded-lg
                    px-6 py-3 font-bold text-sm
                    transition-all flex items-center justify-center gap-2
                    shadow-lg shadow-red-600/20"
          >
            <span className="material-symbols-outlined">delete</span>
            Eliminar
          </button>
        )}
        <div className="w-50">
          <BlueButton text="Guardar" icon="save" type="submit" loading={loading} />
        </div>

      </div>
    </form>
  );
}

