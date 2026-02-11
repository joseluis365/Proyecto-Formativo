import { createContext, useContext, useState } from "react";
import Toast from "./components/UI/Toast";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = (id) => {
    setToasts((t) => t.filter((toast) => toast.id !== id));
  };

  const showToast = (type, message) => {
    const id = crypto.randomUUID();

    setToasts((t) => [...t, { id, type, message }]);

    setTimeout(() => removeToast(id), 3000);
  };

  const api = {
    success: (msg) => showToast("success", msg),
    error: (msg) => showToast("error", msg),
    info: (msg) => showToast("info", msg),
    toasts,
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <Toast />
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
