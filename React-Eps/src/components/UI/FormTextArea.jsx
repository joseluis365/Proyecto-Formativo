import { forwardRef } from "react";

const FormTextArea = forwardRef(({label, placeholder, id, name, error, ...rest}, ref) => {
    return (
        <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1" htmlFor={id}>{label}</label>
            <textarea 
                ref={ref}
                className={`input-tight h-24 resize-none ${error ? 'border-red-500 focus:ring-red-500' : ''}`} 
                id={id} 
                name={name} 
                placeholder={placeholder}
                {...rest}
            ></textarea>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    )
});

export default FormTextArea;
