import React from "react";
import IconInput from "./IconInput";

export default function FormWithIcons({
    register,
    sections,
    config,
    customRenderers = {},
    children,
    errors = {},
    handleSubmit,
    onSubmit,
    values,
    onChange
}) {
    const renderField = (field) => {
        if (customRenderers[field.name]) {
            return (
                <React.Fragment key={field.name}>
                    {customRenderers[field.name](field, errors[field.name])}
                </React.Fragment>
            );
        }

        return (
            <IconInput
                key={field.name}
                label={field.label}
                icon={field.icon}
                placeholder={field.placeholder || field.label}
                type={field.type}
                id={field.name}
                name={field.name}
                required={field.required}
                readOnly={field.readOnly}
                error={errors && errors[field.name] ? errors[field.name] : null}
                autoComplete={field.autoComplete}
                register={register}
                value={values ? values[field.name] : undefined}
                onChange={onChange ? (val) => {
                    // Verificamos si onChange espera (name, value) o el evento real
                    // Dependiendo de cómo lo usen los componentes antiguos, en general era (name, value) pero lo pasamos como se hacía antes
                    // En BaseTablesForms.js no hay especificación, el modal hace `onChange(name, e.target.value)` o directo?
                    // IconInput antes emitía onChange={props.onChange} ... pasemos el comportamiento original.
                } : undefined}
                onChangeHandler={onChange}
            />
        );
    };

    return (
        <form onSubmit={handleSubmit ? handleSubmit(onSubmit) : onSubmit} className="flex flex-col gap-5">
            {sections && sections.length > 0 && (
                sections.map((section, idx) => (
                    <div key={idx} className="space-y-4">
                        {section.title && (
                            <h3 className="text-base font-medium text-gray-800 border-b pb-2 dark:text-gray-200 dark:border-gray-700">
                                {section.title}
                            </h3>
                        )}
                        <div className={`grid grid-cols-1 ${section.gridCols ? `md:grid-cols-${section.gridCols}` : 'md:grid-cols-2'} gap-4`}>
                            {section.fields.map(renderField)}
                        </div>
                    </div>
                ))
            )}

            {config && config.fields && config.fields.length > 0 && (
                <div className="flex flex-col gap-4">
                    {config.fields.map(renderField)}
                </div>
            )}

            {children}
        </form>
    );
}
