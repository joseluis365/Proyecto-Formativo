import React, { useEffect, useState } from "react";
import BlueButton from "../UI/BlueButton";

export default function UserForm({
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

  // 🔥 Sincroniza solo cuando cambian realmente los valores externos
  useEffect(() => {
    setForm(values);
  }, [JSON.stringify(values)]);

  const handleChange = (name, value) => {
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      onChange?.(updated);
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field) => {
          const value = form[field.name] ?? "";
          const error = errors[field.name];

          return (
            <div key={field.name} className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                {field.label}
              </label>

              {field.type === "select" ? (
                <select
                  disabled={field.readOnly}
                  value={value}
                  onChange={(e) =>
                    handleChange(field.name, e.target.value)
                  }
                  className={`border rounded px-3 py-2 w-full ${
                    error ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Seleccionar</option>

                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  disabled={field.readOnly}
                  type={field.type}
                  value={value}
                  onChange={(e) =>
                    handleChange(field.name, e.target.value)
                  }
                  placeholder={field.label}
                  className={`border rounded px-3 py-2 w-full ${
                    error ? "border-red-500" : "border-gray-300"
                  }`}
                />
              )}

              {error && (
                <p className="text-red-500 text-sm">
                  {error}
                </p>
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
            <span className="material-symbols-outlined">
              delete
            </span>
            Eliminar
          </button>
        )}

        <BlueButton
          text="Guardar"
          icon="save"
          type="submit"
          loading={loading}
        />
      </div>
    </form>
  );
}
