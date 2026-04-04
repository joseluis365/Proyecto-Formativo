import { motion } from "framer-motion";
import MuiIcon from "./MuiIcon";

export default function BlueButton({
  text,
  icon,
  type = "button",
  loading = false,
  disabled = false,
  ...props
}) {
  return (
    <motion.button
      type={type}
      whileTap={{ scale: 0.96 }}
      disabled={loading || disabled}
      {...props}
      className={`
        group
        bg-primary hover:bg-primary/90
        text-white cursor-pointer rounded-lg
        px-6 py-3 font-bold text-sm
        transition-all flex items-center justify-center gap-2
        shadow-lg shadow-primary/20 w-full
        ${loading || disabled ? "opacity-70 cursor-not-allowed" : ""}
      `}
    >
      {loading ? (
        <>
          <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>{text === "Actualizar Cambios" || text === "Actualizar" ? "Actualizando..." : "Guardando..."}</span>
        </>
      ) : (
        <>
          <span>{text}</span>
          {icon && (
            typeof icon === 'string' ? (
              <MuiIcon 
                name={icon} 
                sx={{ fontSize: '1.125rem' }} 
                className="group-hover:translate-x-1 transition-transform" 
              />
            ) : (
              <span className="flex items-center group-hover:translate-x-1 transition-transform">
                {icon}
              </span>
            )
          )}
        </>
      )}
    </motion.button>
  );
}
