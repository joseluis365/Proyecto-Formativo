import { useState } from "react";

export default function IconInput({ label, icon, placeholder, type, id, name, error, value, onChange, autoComplete, readOnly, required }) {
    const [showPassword, setShowPassword] = useState(false);

    const isPasswordType = type === 'password';
    const currentType = isPasswordType && showPassword ? 'text' : type;

    return (
        <div className="flex flex-col gap-1.5 pb-3">
            <label className="text-[#0d121b] dark:text-white text-sm font-semibold leading-normal" htmlFor={id}>{label}</label>
            <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#4c669a] text-xl">{icon}</span>
                <input
                    className={`form-input flex w-full rounded-lg text-[#0d121b] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 border ${error ? 'border-red-500' : 'border-[#cfd7e7] dark:border-white/30'} bg-white dark:bg-gray-800/50 h-12 pl-12 ${isPasswordType ? 'pr-12' : 'pr-4'} placeholder:text-[#4c669a]/60 text-base font-normal`}
                    placeholder={placeholder}
                    readOnly={readOnly}
                    required={required}
                    type={currentType}
                    id={id}
                    name={name}
                    value={value}
                    onChange={onChange}
                    autoComplete={autoComplete}
                />
                {isPasswordType && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4c669a] hover:text-[#0d121b] dark:hover:text-white transition-colors focus:outline-none flex items-center justify-center p-1"
                        title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                        <span className="material-symbols-outlined text-[22px]">
                            {showPassword ? 'visibility' : 'visibility_off'}
                        </span>
                    </button>
                )}
            </div>
            {error && (
                <div className="flex flex-col gap-1">
                    {Array.isArray(error) ? (
                        error.map((err, index) => (
                            <span key={index} className="text-red-500 text-xs">
                                {err}
                            </span>
                        ))
                    ) : (
                        <span className="text-red-500 text-xs">
                            {error}
                        </span>
                    )}
                </div>
            )}
        </div>
    )
}