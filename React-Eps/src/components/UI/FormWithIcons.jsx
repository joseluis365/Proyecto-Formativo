import React from "react";
import IconInput from "./IconInput";
import Swal from "sweetalert2";

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
    const onInvalid = (errs) => {
        console.warn("Validation failed:", errs);
        Swal.fire({
            icon: 'warning',
            title: 'Formulario incompleto',
            text: 'Verifique los campos marcados en rojo antes de continuar.',
            confirmButtonColor: '#3085d6',
            toast: true,
            position: 'top-end',
            timer: 3000,
            showConfirmButton: false
        });
    };

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
                {...field}
                placeholder={field.placeholder || field.label}
                key={field.name}
                id={field.id || field.name}
                error={errors && errors[field.name] ? errors[field.name] : null}
                register={register}
                value={values ? values[field.name] : undefined}
                onChangeHandler={onChange}
            />
        );
    };

    return (
        <form
            onSubmit={handleSubmit ? handleSubmit(onSubmit, onInvalid) : onSubmit}
            className="flex flex-col gap-5"
        >
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
