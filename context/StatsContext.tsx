"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface StatsContextValue {
  subBase: number;
  setSubBase: (n: number) => void;
}

const StatsContext = createContext<StatsContextValue | null>(null);

export function StatsProvider({ children }: { children: ReactNode }) {
  const [subBase, setSubBase] = useState(21000);
  return (
    <StatsContext.Provider value={{ subBase, setSubBase }}>
      {children}
    </StatsContext.Provider>
  );
}

export function useStats() {
  const ctx = useContext(StatsContext);
  if (!ctx) throw new Error("useStats must be used within StatsProvider");
  return ctx;
}
