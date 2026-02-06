import { motion } from "framer-motion";

export default function BlueButton({
  text,
  icon,
  type = "button",
  loading = false,
  disabled = false,
}) {
  return (
    <motion.button
      type={type}
      whileTap={{ scale: 0.96 }}
      disabled={loading || disabled}
      className={`
        group
        bg-primary hover:bg-primary/90
        text-white cursor-pointer rounded-lg
        px-6 py-3 font-bold text-sm
        transition-all flex items-center justify-center gap-2
        shadow-lg shadow-primary/20
        ${loading || disabled ? "opacity-70 cursor-not-allowed" : ""}
      `}
    >
      {loading ? (
        <>
          {/* Spinner */}
          <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Guardando...</span>
        </>
      ) : (
        <>
          <span>{text}</span>
          {icon && (
            <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
              {icon}
            </span>
          )}
        </>
      )}
    </motion.button>
  );
}
