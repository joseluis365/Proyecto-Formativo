import React, { useEffect, useState } from "react";
import BlueButton from "../UI/BlueButton";

export default function UserForm({
  initialValues = {},
  fields = [],
  onSubmit,
  onChange,
  loading,
  errors = {},
}) {
  const [form, setForm] = useState(initialValues);

  // Sincronizar con cambios externos (del padre)
  useEffect(() => {
    setForm(initialValues);
  }, [initialValues]);

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
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => {
        const value = form[field.name] ?? "";
        const error = errors[field.name];

        return (
          <div key={field.name} className="space-y-1">
            {/* Label */}
            <label className="text-sm font-medium text-gray-700">
              {field.label}
            </label>

            {/* SELECT */}
            {field.type === "select" ? (
              <select
                value={value}
                onChange={(e) =>
                  handleChange(field.name, e.target.value)
                }
                className={`border rounded px-3 py-2 w-full
                ${errors[field.name] ? "border-red-500" : "border-gray-300"}
              `}
              >
                {!value && (
                  <option value="">Seleccionar</option>
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
                type={field.type}
                value={value}
                onChange={(e) =>
                  handleChange(field.name, e.target.value)
                }
                placeholder={field.label}
                className={`border rounded px-3 py-2 w-full ${errors[field.name] ? "border-red-500" : ""
                  }`}
              />
            )}
            {errors[field.name] && (
              <p className="text-red-500 text-sm transition-all">{errors[field.name]}</p>
            )}
          </div>
        );
      })}

      <BlueButton text="Guardar" icon="save" type="submit" loading={loading} />
    </form>
  );
}

