import React, { useState } from "react";
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';


/**
 * IconInput Component
 * Refactorizado para soportar validación visual inmediata y tipo select.
 */
export default function IconInput({
    label,
    icon,
    placeholder,
    type,
    id,
    name,
    error,
    register,
    autoComplete,
    readOnly,
    required,
    options, // Soporte para opciones de select
    onlyLetters, // Restricción física: solo letras
    onlyNumbers, // Restricción física: solo números (y guion para NIT)
    value,
    onChangeHandler,
    ...props
}) {
    const [showPassword, setShowPassword] = useState(false);

    /**
     * Sanitización en tiempo real para campos marcados con onlyLetters.
     * Bloquea caracteres especiales y dobles espacios físicamente en el DOM.
     */
    const handleInput = (e) => {
        if (onlyLetters) {
            let value = e.target.value;
            // Solo letras (incluyendo acentos y ñ) y un solo espacio
            value = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "");
            // Eliminar dobles espacios
            value = value.replace(/\s{2,}/g, " ");

            if (e.target.value !== value) {
                e.target.value = value;
            }
        }

        if (onlyNumbers) {
            let value = e.target.value;
            // Permite dígitos y un guion (para NITs como 900123456-7)
            value = value.replace(/[^0-9-]/g, "");
            if (e.target.value !== value) {
                e.target.value = value;
            }
        }

        // Propagar el evento original si existe en props
        if (props.onInput) props.onInput(e);
    };

    const handleKeyDown = (e) => {
        if (onlyLetters) {
            // Bloquear dígitos físicamente
            if (/^\d$/.test(e.key)) e.preventDefault();
        }
        if (onlyNumbers) {
            // Permitir: dígitos, guion, teclas de control (Backspace, Delete, Tab, flechas, Ctrl/Cmd)
            const allowed = /^[0-9-]$/.test(e.key);
            const isControl = [
                'Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'
            ].includes(e.key);
            const isCopyPaste = (e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase());
            if (!allowed && !isControl && !isCopyPaste) e.preventDefault();
        }

        if (props.onKeyDown) props.onKeyDown(e);
    };

    const isPasswordType = type === 'password';
    const isSelectType = type === 'select';
    const isCheckboxType = type === 'checkbox';
    const currentType = isPasswordType && showPassword ? 'text' : type;

    // Clases base dinámicas. Se usa "!" para forzar override sobre Tailwind Forms configurado globalmente.
    const baseClasses = `form-input flex w-full rounded-lg text-[#0d121b] dark:text-white focus:outline-0 transition-all bg-white dark:bg-gray-800/50 h-12 pl-12 placeholder:text-[#4c669a]/60 text-base font-normal border`;

    const statusClasses = error
        ? "!border-red-500 ring-1 !ring-red-500 focus:!ring-red-500 bg-red-50/10"
        : "border-[#cfd7e7] dark:border-white/30 focus:ring-2 focus:ring-primary/20";

    const commonProps = {
        ...(register ? register(name) : {}),
        id,
        name,
        placeholder,
        readOnly,
        required,
        autoComplete,
        className: isCheckboxType 
            ? `form-checkbox h-5 w-5 text-primary rounded border-[#cfd7e7] dark:border-white/30 focus:ring-primary/20 transition-all cursor-pointer`
            : `${baseClasses} ${statusClasses} ${isPasswordType ? 'pr-12' : 'pr-4'} ${isSelectType ? 'appearance-none pr-10' : ''}`,
        onInput: handleInput,
        onKeyDown: handleKeyDown,
        ...(!register && value !== undefined ? { [isCheckboxType ? 'checked' : 'value']: value } : {}),
        ...(!register && onChangeHandler ? { onChange: (e) => onChangeHandler(name, f[isCheckboxType ? 'checked' : 'value']) } : {}),
        ...props
    };

    return (
        <div className="flex flex-col gap-1.5 pb-3">
            {label && (
                <label className="text-[#0d121b] dark:text-white text-sm font-semibold leading-normal" htmlFor={id}>
                    {label}
                </label>
            )}

            <div className="relative">
                {icon && !isCheckboxType && (
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4c669a] flex items-center justify-center">
                        {typeof icon === 'string' ? (
                            <span className="material-symbols-outlined text-xl">{icon}</span>
                        ) : (
                            React.cloneElement(icon, { sx: { fontSize: '1.25rem', ...icon.props?.sx } })
                        )}
                    </span>
                )}

                {isSelectType ? (
                    <select {...commonProps}>
                        <option key="placeholder" value="">{placeholder || 'Seleccione una opción'}</option>
                        {(options || []).map((opt, index) => (
                            <option key={opt.value || index} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                ) : isCheckboxType ? (
                    <div className="flex items-center gap-2 h-12">
                         <input {...commonProps} type="checkbox" />
                         <span className="text-[#0d121b] dark:text-white text-sm font-medium">{placeholder}</span>
                    </div>
                ) : (
                    <input {...commonProps} type={currentType} />
                )}
                {isPasswordType && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4c669a] hover:text-[#0d121b] dark:hover:text-white transition-colors focus:outline-none flex items-center justify-center p-1"
                        title={showPassword ? "Ocultar" : "Mostrar"}
                    >
                        {showPassword ? <VisibilityOffRoundedIcon sx={{ fontSize: '1.25rem' }} /> : <VisibilityRoundedIcon sx={{ fontSize: '1.25rem' }} />}
                    </button>
                )}

                {isSelectType && (
                    <ExpandMoreRoundedIcon className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#4c669a]" sx={{ fontSize: '1.25rem' }} />
                )}
            </div>

            {error?.message && (
                <span className="text-red-500 text-xs mt-1 font-medium italic">
                    {error.message}
                </span>
            )}
        </div>
    );
}
