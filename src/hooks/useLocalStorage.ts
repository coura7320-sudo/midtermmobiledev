import { useState, useEffect, useCallback } from 'react';
import { KeyValueStore } from '@/services/storageService';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        const item = await KeyValueStore.getItem<T>(key);
        if (item !== null && item !== undefined) {
          setStoredValue(item);
        }
      } catch (error) {
        console.warn(`[useLocalStorage] Error reading key "${key}":`, error);
      } finally {
        setLoading(false);
      }
    })();
  }, [key]);

  const setValue = useCallback(
    async (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        await KeyValueStore.setItem(key, valueToStore);
      } catch (error) {
        console.warn(`[useLocalStorage] Error saving key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue, loading] as const;
}
