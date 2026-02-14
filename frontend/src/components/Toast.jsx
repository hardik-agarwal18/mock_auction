import { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(
    ({ message, type = "info", duration = 3000 }) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, type, duration }]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [],
  );

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = {
    success: (message, duration) =>
      addToast({ message, type: "success", duration }),
    error: (message, duration) =>
      addToast({ message, type: "error", duration }),
    warning: (message, duration) =>
      addToast({ message, type: "warning", duration }),
    info: (message, duration) => addToast({ message, type: "info", duration }),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
        {toasts.map((t) => (
          <Toast key={t.id} {...t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function Toast({ message, type, onClose }) {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-400" />,
    error: <XCircle className="w-5 h-5 text-red-400" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />,
  };

  const bgColors = {
    success: "from-green-500/10 to-green-600/10 border-green-500/30",
    error: "from-red-500/10 to-red-600/10 border-red-500/30",
    warning: "from-yellow-500/10 to-yellow-600/10 border-yellow-500/30",
    info: "from-blue-500/10 to-blue-600/10 border-blue-500/30",
  };

  return (
    <div
      className={`
        pointer-events-auto
        flex items-center gap-3 p-4 rounded-lg border
        bg-gradient-to-br ${bgColors[type]}
        backdrop-blur-md shadow-xl
        animate-slideIn
        min-w-[300px] max-w-md
      `}
    >
      <div className="flex-shrink-0">{icons[type]}</div>
      <p className="flex-1 text-sm text-white">{message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
