import { forwardRef } from "react";

const FormInput = forwardRef(({label, placeholder, type, id, name, error, gridCols, ...rest}, ref) => {
    return (
        <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1" htmlFor={id}>{label}</label>
            <input 
                ref={ref}
                className={`input-tight ${error ? 'border-red-500 focus:ring-red-500' : ''}`} 
                id={id} 
                name={name} 
                placeholder={placeholder} 
                type={type}
                {...rest}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    )
});

export default FormInput;
