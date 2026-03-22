"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckIcon, XIcon } from "@/components/icons";

interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed bottom-6 right-6 z-[2000] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg min-w-[280px] ${
              toast.type === "success"
                ? "bg-brand text-white"
                : "bg-danger text-white"
            }`}
          >
            {toast.type === "success" ? (
              <CheckIcon className="w-5 h-5 shrink-0" />
            ) : (
              <XIcon className="w-5 h-5 shrink-0" />
            )}
            <span className="text-sm font-medium flex-1">{toast.message}</span>
            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 rounded-lg hover:bg-white/20 transition-colors"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
