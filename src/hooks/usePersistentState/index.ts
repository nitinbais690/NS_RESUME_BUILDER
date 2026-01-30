import { useState, useEffect } from 'react';

export function usePersistentState<T>(key: string, defaultValue: T) {
  const [state, setState] = useState<T>(() => {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved) as T;
      } catch {
        return saved as unknown as T;
      }
    }
    return defaultValue;
  });

  useEffect(() => {
    const valueToStore =
      typeof state === 'string' ? state : JSON.stringify(state);
    localStorage.setItem(key, valueToStore);
  }, [key, state]);

  return [state, setState] as const;
}
