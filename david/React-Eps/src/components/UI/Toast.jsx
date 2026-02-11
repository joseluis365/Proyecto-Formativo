import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "../../ToastContext";

export default function Toast() {
  const { toasts } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.25 }}
            className={`flex items-center gap-2 rounded-lg px-4 py-3 shadow-lg text-white
              ${
                t.type === "success"
                  ? "bg-green-600"
                  : t.type === "error"
                  ? "bg-red-600"
                  : "bg-blue-600"
              }
            `}
          >
            <span className="material-symbols-outlined">
              {t.type === "success"
                ? "check_circle"
                : t.type === "error"
                ? "error"
                : "info"}
            </span>

            <span className="text-sm font-medium">{t.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
