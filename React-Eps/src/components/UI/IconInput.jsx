export default function IconInput({
  label,
  icon,
  placeholder,
  type,
  id,
  name,
  error,
  onChange,
  ...props
}) {
  return (
    <div className="flex flex-col gap-1.5 pb-3">
      <label
        className="text-[#0d121b] dark:text-white text-sm font-semibold leading-normal"
        htmlFor={id}
      >
        {label}
      </label>

      <div className="relative">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#4c669a] text-xl">
          {icon}
        </span>

        <input
          {...props}
          className={`form-input flex w-full rounded-lg text-[#0d121b] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 border ${
            error ? "border-red-500" : "border-[#cfd7e7] dark:border-white/10"
          } bg-white dark:bg-background-dark/50 h-12 pl-12 placeholder:text-[#4c669a]/60 text-base font-normal`}
          placeholder={placeholder}
          type={type}
          id={id}
          name={name}
          onChange={(e) => onChange?.(e.target.value)}
        />
      </div>

      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  );
}
