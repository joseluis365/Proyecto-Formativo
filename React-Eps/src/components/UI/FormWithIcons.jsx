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
    onSubmit
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
                error={errors[field.name]}
                autoComplete={field.autoComplete}
                register={register}
            />
        );
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
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
