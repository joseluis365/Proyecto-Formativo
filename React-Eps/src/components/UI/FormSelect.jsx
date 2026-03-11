import { forwardRef } from "react";

const FormSelect = forwardRef(({label, options, id, name, error, ...rest}, ref) => {
    return (
        <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1" htmlFor={id}>{label}</label>
            <select ref={ref} className={`input-tight ${error ? 'border-red-500 focus:ring-red-500' : ''}`} id={id} name={name} {...rest}>
                <option value="">Seleccione una opción</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                ))}
            </select>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    )
});

export default FormSelect;
