import { useState, useEffect, useCallback, useRef } from "react";

type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

// Shared cache across all hook instances
const globalCache = new Map<string, CacheEntry<any>>();

type UseFetchOptions<T> = {
  refreshOnLoad?: boolean;
  cacheKey?: string;
  staleTime?: number; // Time in ms before cache is considered stale
};

type UseFetchResult<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};

export const useFetch = <T>(
  fetchFn: () => Promise<T>,
  options: UseFetchOptions<T> = {}
): UseFetchResult<T> => {
  const { refreshOnLoad = false, cacheKey, staleTime = 0 } = options;

  const [data, setData] = useState<T | null>(() => {
    // Initialize with cached data if available and not refreshing on load
    if (cacheKey && !refreshOnLoad) {
      const cached = globalCache.get(cacheKey);
      if (cached) {
        const age = Date.now() - cached.timestamp;
        if (age < staleTime || staleTime === 0) {
          return cached.data;
        }
      }
    }
    return null;
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const mountedRef = useRef(true);

  const fetchData = useCallback(
    async (forceRefresh = false) => {
      // Check cache if cacheKey is provided and not forcing refresh
      if (cacheKey && !forceRefresh) {
        const cached = globalCache.get(cacheKey);
        if (cached) {
          const age = Date.now() - cached.timestamp;
          if (age < staleTime || staleTime === 0) {
            setData(cached.data);
            return;
          }
        }
      }

      setLoading(true);
      setError(null);

      try {
        const result = await fetchFn();

        if (!mountedRef.current) return;

        setData(result);

        // Update cache
        if (cacheKey) {
          globalCache.set(cacheKey, {
            data: result,
            timestamp: Date.now(),
          });
        }
      } catch (err) {
        if (!mountedRef.current) return;

        setError(err instanceof Error ? err : new Error("An error occurred"));
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    },
    [fetchFn, cacheKey, staleTime]
  );

  const refetch = useCallback(async () => {
    await fetchData(true); // Force refresh on manual refetch
  }, [fetchData]);

  useEffect(() => {
    mountedRef.current = true;

    if (refreshOnLoad) {
      fetchData(true); // Force refresh on load
    } else {
      fetchData(false); // Use cache if available
    }

    return () => {
      mountedRef.current = false;
    };
  }, [fetchData, refreshOnLoad]);

  return { data, loading, error, refetch };
};

// Optional: Export cache utilities
export const clearCache = (cacheKey?: string) => {
  if (cacheKey) {
    globalCache.delete(cacheKey);
  } else {
    globalCache.clear();
  }
};
