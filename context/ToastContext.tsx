"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

type ToastTone = "default" | "accent";

interface ToastState {
  message: string;
  tone: ToastTone;
  visible: boolean;
}

interface ToastContextValue extends ToastState {
  showToast: (message: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ToastState>({
    message: "",
    tone: "default",
    visible: false,
  });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string, tone: ToastTone = "default") => {
    setState({ message, tone, visible: true });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setState((s) => ({ ...s, visible: false }));
    }, 2800);
  }, []);

  return (
    <ToastContext.Provider value={{ ...state, showToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
