import React, { useEffect, useState } from "react";
import BlueButton from "../UI/BlueButton";

export default function Form({
  values = {},
  fields = [],
  onSubmit,
  onChange,
  loading,
  errors = {},
  showDeleteButton = false,
  onDelete,
}) {
  const [form, setForm] = useState(values);

  // Sincronizar con cambios externos (del padre)
  useEffect(() => {
  // Solo actualiza si los valores son realmente diferentes (evita el bucle)
  if (JSON.stringify(values) !== JSON.stringify(form)) {
    setForm(values);
  }
}, [values]);

  const handleChange = (name, value) => {
    const updated = { ...form, [name]: value };
    setForm(updated);
    onChange?.(updated);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {fields.map((field) => {
        const value = form[field.name] ?? "";
        const error = errors[field.name];

        return (
                            
          <div key={field.name} className="space-y-1">
            {/* Label */}
            <label className="text-sm font-medium text-gray-700" htmlFor={field.name}>
              {field.label}
            </label>

            {/* SELECT */}
            {field.type === "select" ? (
              <select
                id={field.name}
                name={field.name}
                readOnly={field.readOnly}
                value={value}
                onChange={(e) =>
                  handleChange(field.name, e.target.value)
                }
                className={`border rounded px-3 py-2 w-full
                ${errors[field.name] ? "border-red-500" : "border-gray-300"}
              `}
              >
                {!value && (
                  <option value="default-empty">Seleccionar</option>
                )}

                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              /* INPUT */
              <input
                id={field.name}
                name={field.name}
                readOnly={field.readOnly}
                disabled={field.disabled}
                type={field.type}
                value={value}
                onChange={(e) =>
                  handleChange(field.name, e.target.value)
                }
                placeholder={field.label}
                className={`border border-gray-300 rounded px-3 py-2 w-full ${errors[field.name] ? "border-red-500" : ""
                  }`}
              />
            )}
            {errors[field.name] && (
              <p className="text-red-500 text-sm transition-all">{errors[field.name]}</p>
            )}
          </div>
        );
      })}
      </div>
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
      <BlueButton text="Guardar" icon="save" type="submit" loading={loading} />
      
      </div>
    </form>
  );
}

