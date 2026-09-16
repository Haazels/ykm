"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface StatsContextValue {
  subBase: number;
  viewBase: number;
  videoCount: number;
  isLiveApi: boolean;
  setSubBase: (n: number) => void;
  setViewBase: (n: number) => void;
  fetchLiveStats: () => Promise<void>;
}

const StatsContext = createContext<StatsContextValue | null>(null);

export function StatsProvider({ children }: { children: ReactNode }) {
  const [subBase, setSubBase] = useState(21400);
  const [viewBase, setViewBase] = useState(254000);
  const [videoCount, setVideoCount] = useState(45);
  const [isLiveApi, setIsLiveApi] = useState(false);

  const fetchLiveStats = useCallback(async () => {
    try {
      const res = await fetch("/api/youtube/stats");
      if (res.ok) {
        const data = await res.json();
        if (typeof data.subscribers === "number") {
          setSubBase(data.subscribers);
        }
        if (typeof data.views === "number") {
          setViewBase(data.views);
        }
        if (typeof data.videoCount === "number") {
          setVideoCount(data.videoCount);
        }
        if (typeof data.isLiveApi === "boolean") {
          setIsLiveApi(data.isLiveApi);
        }
      }
    } catch (err) {
      console.error("Failed to fetch YouTube stats:", err);
    }
  }, []);

  useEffect(() => {
    void fetchLiveStats();
  }, [fetchLiveStats]);

  return (
    <StatsContext.Provider
      value={{
        subBase,
        viewBase,
        videoCount,
        isLiveApi,
        setSubBase,
        setViewBase,
        fetchLiveStats,
      }}
    >
      {children}
    </StatsContext.Provider>
  );
}

export function useStats() {
  const ctx = useContext(StatsContext);
  if (!ctx) throw new Error("useStats must be used within StatsProvider");
  return ctx;
}
