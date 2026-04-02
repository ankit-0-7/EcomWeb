import React, { createContext, useState, useCallback } from 'react';
import { X } from 'lucide-react';

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      
      <div className="fixed bottom-8 right-8 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              pointer-events-auto flex items-center justify-between min-w-[280px] max-w-[400px] 
              px-6 py-4 shadow-2xl transition-all duration-500 ease-out animate-slide-up
              ${toast.type === 'error' ? 'bg-[#5A1218] text-[#faf8f5]' : 'bg-[#1a1a1a] text-[#faf8f5] border-l-2 border-[#5A1218]'}
            `}
          >
            <span 
              style={{ fontFamily: "'Montserrat', sans-serif" }} 
              className="text-[10px] tracking-[2px] uppercase leading-relaxed"
            >
              {toast.message}
            </span>
            <button 
              onClick={() => removeToast(toast.id)} 
              className="ml-6 text-white/50 hover:text-white transition-colors cursor-pointer bg-transparent border-none"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.4s ease-out forwards; }
      `}</style>
    </ToastContext.Provider>
  );
};