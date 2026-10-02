import { useEffect, useRef, useState } from 'react';
import { apiGet } from './api';

/**
 * Polls a backend endpoint on an interval. Falls back to the given seed data
 * (and reports `connected: false`) whenever the backend can't be reached, so
 * the app stays usable offline or before the backend is deployed.
 */
export function usePoll<T>(path: string, fallback: T, intervalMs = 4000) {
  const [data, setData] = useState<T>(fallback);
  const [connected, setConnected] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    async function tick() {
      try {
        const result = await apiGet<T>(path);
        if (mounted.current) {
          setData(result);
          setConnected(true);
        }
      } catch {
        if (mounted.current) setConnected(false);
      }
    }

    tick();
    const id = setInterval(tick, intervalMs);
    return () => {
      mounted.current = false;
      clearInterval(id);
    };
  }, [path, intervalMs]);

  return { data, connected };
}
