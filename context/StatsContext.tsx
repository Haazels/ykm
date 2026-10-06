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
  isLoading: boolean;
  isError: boolean;
  setSubBase: (n: number) => void;
  setViewBase: (n: number) => void;
  fetchLiveStats: () => Promise<void>;
}

const StatsContext = createContext<StatsContextValue | null>(null);

/** Refresh every 30 minutes — YouTube stats change slowly, and each call costs
 *  only 1 quota unit (daily budget: 10,000 units). 48 calls/day = negligible. */
const REFRESH_INTERVAL_MS = 30 * 60 * 1000;

export function StatsProvider({ children }: { children: ReactNode }) {
  const [subBase, setSubBase] = useState(21400);
  const [viewBase, setViewBase] = useState(254000);
  const [videoCount, setVideoCount] = useState(45);
  const [isLiveApi, setIsLiveApi] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchLiveStats = useCallback(async () => {
    setIsError(false);
    try {
      const res = await fetch("/api/youtube/stats");
      if (res.ok) {
        const data = await res.json();
        if (typeof data.subscribers === "number") setSubBase(data.subscribers);
        if (typeof data.views === "number") setViewBase(data.views);
        if (typeof data.videoCount === "number") setVideoCount(data.videoCount);
        if (typeof data.isLiveApi === "boolean") setIsLiveApi(data.isLiveApi);
      } else {
        setIsError(true);
      }
    } catch (err) {
      console.error("Failed to fetch YouTube stats:", err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch on mount, then refresh every 30 minutes
  useEffect(() => {
    void fetchLiveStats();
    const id = setInterval(() => void fetchLiveStats(), REFRESH_INTERVAL_MS);
    return () => clearInterval(id);
  }, [fetchLiveStats]);

  return (
    <StatsContext.Provider
      value={{
        subBase,
        viewBase,
        videoCount,
        isLiveApi,
        isLoading,
        isError,
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
