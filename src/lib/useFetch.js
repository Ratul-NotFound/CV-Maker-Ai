import { useState, useEffect, useRef } from 'react';

// Global cache with TTL
const fetchCache = new Map();
const pendingRequests = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cacheKeyRef = useRef(url + JSON.stringify(options));

  useEffect(() => {
    if (!url) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      const cacheKey = cacheKeyRef.current;

      // Check cache first
      const cached = fetchCache.get(cacheKey);
      if (cached && Date.now() < cached.expiresAt) {
        setData(cached.data);
        setLoading(false);
        return;
      }

      // Check if request is already in flight
      if (pendingRequests.has(cacheKey)) {
        const promise = pendingRequests.get(cacheKey);
        promise
          .then(cachedData => setData(cachedData))
          .catch(err => setError(err))
          .finally(() => setLoading(false));
        return;
      }

      // Create new request
      const fetchPromise = (async () => {
        try {
          setLoading(true);
          const response = await fetch(url, {
            headers: {
              'Content-Type': 'application/json',
              ...options.headers,
            },
            ...options,
          });

          if (!response.ok) throw new Error('API Error');
          
          const responseData = await response.json();

          // Cache the result
          fetchCache.set(cacheKey, {
            data: responseData,
            expiresAt: Date.now() + CACHE_DURATION,
          });

          setData(responseData);
          setError(null);
          return responseData;
        } catch (err) {
          setError(err);
          throw err;
        } finally {
          setLoading(false);
          pendingRequests.delete(cacheKey);
        }
      })();

      pendingRequests.set(cacheKey, fetchPromise);
    };

    fetchData();
  }, [url, options]);

  return { data, loading, error };
}

// Clear cache when needed
export function clearFetchCache() {
  fetchCache.clear();
}

// Manual cache invalidation
export function invalidateFetchCache(url) {
  const keysToDelete = [];
  for (const key of fetchCache.keys()) {
    if (key.startsWith(url)) {
      keysToDelete.push(key);
    }
  }
  keysToDelete.forEach(key => fetchCache.delete(key));
}
