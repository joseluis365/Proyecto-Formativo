export default function IconInput({
  label,
  icon,
  onChange,
  ...props
}) {
  return (
    <div className="flex flex-col gap-1">
      <label>{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2">
          {icon}
        </span>
        <input
          {...props}
          className="pl-10 w-full"
          onChange={(e) => onChange?.(e.target.value)}
        />
      </div>
    </div>
  );
}
