import IconInput from "./IconInput";


export default function Formbuilder({ onSubmit, config, children, errors = {}, onChange }) {
    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
            {config.fields.map((field) => (
                <IconInput key={field.name}
                    label={field.label}
                    icon={field.icon}
                    placeholder={field.placeholder}
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    required={field.required}
                    error={errors[field.name]}
                    autoComplete={field.autoComplete}
                    onChange={onChange ? (e) => onChange(field.name, e.target.value) : undefined}
                />
            ))}
            {children}
        </form>
    )
}