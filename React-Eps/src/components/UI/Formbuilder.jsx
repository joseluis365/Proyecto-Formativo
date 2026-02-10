import IconInput from "./IconInput";

export default function Formbuilder({ onSubmit, config, children }) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      {config.fields.map((field) => (
        <IconInput
          key={field.name}
          label={field.label}
          icon={field.icon}
          placeholder={field.placeholder}
          type={field.type}
          id={field.name}
          name={field.name}
          required={field.required}
          autoComplete={field.autoComplete}
        />
      ))}

      {/* Botón u otros controles del formulario */}
      {children}
    </form>
  );
}
