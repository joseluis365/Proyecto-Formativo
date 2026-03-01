import React from "react";
import IconInput from "./IconInput";

export default function FormWithIcons({
    onSubmit,
    config,
    sections,
    values, // removed '= {}' to allow undefined
    customRenderers = {},
    children,
    errors = {},
    onChange
}) {
    const renderField = (field) => {
        if (customRenderers[field.name]) {
            return <React.Fragment key={field.name}>
                {customRenderers[field.name](field, values ? values[field.name] : undefined, errors[field.name])}
            </React.Fragment>;
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
                error={errors[field.name]}
                autoComplete={field.autoComplete}
                value={values ? (values[field.name] ?? "") : undefined}
                onChange={onChange ? (e) => onChange(field.name, e.target.value) : undefined}
            />
        );
    };

    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
            {sections && sections.length > 0 ? (
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
            ) : (
                config?.fields?.map(field => renderField(field))
            )}

            {children}
        </form>
    );
}
