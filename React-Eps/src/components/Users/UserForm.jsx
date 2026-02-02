import React from "react";

export default function UserForm({
  initialValues = {},
  fields = [],
  onSubmit,
}) {
  const [form, setForm] = React.useState(initialValues);

  React.useEffect(() => {
    setForm(initialValues);
  }, [initialValues]);

  const handleChange = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => {
        const value = form[field.name] ?? "";

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
                className="border rounded px-3 py-2 w-full"
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
                className="border rounded px-3 py-2 w-full"
              />
            )}
          </div>
        );
      })}

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Guardar
      </button>
    </form>
  );
}

