// =============================================================================
// Local Storage Service (Key-Value Store, Secure Storage & SQLite Abstraction)
// Implements requirements:
//  - Store data locally (sqlite, or key-value store and secure storage)
// =============================================================================

import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

const docDir = (FileSystem as any).documentDirectory || '';
const STORAGE_FILE = `${docDir}whatsapp_storage.json`;
const SECURE_STORAGE_FILE = `${docDir}whatsapp_secure.json`;

// In-memory runtime cache for instant synchronous access
const memoryCache: Record<string, string> = {};
const secureCache: Record<string, string> = {};
let isInitialized = false;

// Initialize storage from persistent disk / localStorage
async function initStorage(): Promise<void> {
  if (isInitialized) return;

  try {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        for (let i = 0; i < window.localStorage.length; i++) {
          const key = window.localStorage.key(i);
          if (key && key.startsWith('wa_')) {
            memoryCache[key] = window.localStorage.getItem(key) || '';
          }
        }
      }
    } else {
      // Native FileSystem storage
      const fileInfo = await FileSystem.getInfoAsync(STORAGE_FILE);
      if (fileInfo.exists) {
        const content = await FileSystem.readAsStringAsync(STORAGE_FILE);
        const parsed = JSON.parse(content);
        Object.assign(memoryCache, parsed);
      }

      const secInfo = await FileSystem.getInfoAsync(SECURE_STORAGE_FILE);
      if (secInfo.exists) {
        const secContent = await FileSystem.readAsStringAsync(SECURE_STORAGE_FILE);
        const secParsed = JSON.parse(secContent);
        Object.assign(secureCache, secParsed);
      }
    }
  } catch (err) {
    console.warn('[Storage] Init warning, falling back to memory cache:', err);
  } finally {
    isInitialized = true;
  }
}

// Persist memory cache to disk
async function persistStore(): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.localStorage) {
        Object.keys(memoryCache).forEach((k) => {
          window.localStorage.setItem(k, memoryCache[k]);
        });
      }
    } else {
      await FileSystem.writeAsStringAsync(STORAGE_FILE, JSON.stringify(memoryCache));
    }
  } catch (err) {
    console.error('[Storage] Error persisting data:', err);
  }
}

async function persistSecureStore(): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        Object.keys(secureCache).forEach((k) => {
          window.sessionStorage.setItem(`sec_${k}`, secureCache[k]);
        });
      }
    } else {
      await FileSystem.writeAsStringAsync(SECURE_STORAGE_FILE, JSON.stringify(secureCache));
    }
  } catch (err) {
    console.error('[Storage] Error persisting secure data:', err);
  }
}

// -----------------------------------------------------------------------------
// 1. Key-Value Store API
// -----------------------------------------------------------------------------
export const KeyValueStore = {
  async getItem<T>(key: string, defaultValue: T | null = null): Promise<T | null> {
    await initStorage();
    const namespacedKey = `wa_${key}`;
    const raw = memoryCache[namespacedKey];
    if (raw === undefined || raw === null) {
      return defaultValue;
    }
    try {
      return JSON.parse(raw) as T;
    } catch {
      return raw as unknown as T;
    }
  },

  async setItem<T>(key: string, value: T): Promise<void> {
    await initStorage();
    const namespacedKey = `wa_${key}`;
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    memoryCache[namespacedKey] = stringValue;
    await persistStore();
  },

  async removeItem(key: string): Promise<void> {
    await initStorage();
    const namespacedKey = `wa_${key}`;
    delete memoryCache[namespacedKey];
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(namespacedKey);
    }
    await persistStore();
  },

  async clear(): Promise<void> {
    await initStorage();
    Object.keys(memoryCache).forEach((k) => {
      if (k.startsWith('wa_')) delete memoryCache[k];
    });
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.clear();
    }
    await persistStore();
  },
};

// -----------------------------------------------------------------------------
// 2. Secure Storage API (for Tokens & Authentication credentials)
// -----------------------------------------------------------------------------
export const SecureStore = {
  async getSecureItem(key: string): Promise<string | null> {
    await initStorage();
    const raw = secureCache[key];
    if (!raw) return null;
    try {
      // Decode simulated secure encrypted base64 payload
      return atob(raw);
    } catch {
      return raw;
    }
  },

  async setSecureItem(key: string, value: string): Promise<void> {
    await initStorage();
    try {
      // Encode simulated secure payload
      secureCache[key] = btoa(value);
    } catch {
      secureCache[key] = value;
    }
    await persistSecureStore();
  },

  async removeSecureItem(key: string): Promise<void> {
    await initStorage();
    delete secureCache[key];
    await persistSecureStore();
  },
};

// -----------------------------------------------------------------------------
// 3. SQLite Database Abstraction Layer
// -----------------------------------------------------------------------------
export interface SQLResultSetRowList<T> {
  length: number;
  item(index: number): T;
  _array: T[];
}

export interface SQLResultSet<T = any> {
  insertId?: number;
  rowsAffected: number;
  rows: SQLResultSetRowList<T>;
}

export const SQLiteStore = {
  async executeSql<T = any>(sql: string, params: any[] = []): Promise<SQLResultSet<T>> {
    await initStorage();
    const trimmed = sql.trim().toUpperCase();

    // In-memory tables persisted via KeyValueStore
    if (trimmed.startsWith('CREATE TABLE')) {
      return { rowsAffected: 1, rows: { length: 0, item: () => null as any, _array: [] } };
    }

    if (trimmed.startsWith('SELECT')) {
      let table = 'messages';
      if (sql.includes('chats')) table = 'chats';
      if (sql.includes('contacts')) table = 'contacts';
      if (sql.includes('settings')) table = 'settings';

      const items = (await KeyValueStore.getItem<T[]>(`table_${table}`)) || [];
      return {
        rowsAffected: 0,
        rows: {
          length: items.length,
          item: (i: number) => items[i],
          _array: items,
        },
      };
    }

    if (trimmed.startsWith('INSERT INTO')) {
      let table = 'messages';
      if (sql.includes('chats')) table = 'chats';
      if (sql.includes('contacts')) table = 'contacts';

      const existing = (await KeyValueStore.getItem<any[]>(`table_${table}`)) || [];
      const newRecord = params[0] || {};
      existing.push(newRecord);
      await KeyValueStore.setItem(`table_${table}`, existing);

      return {
        insertId: Date.now(),
        rowsAffected: 1,
        rows: { length: 0, item: () => null as any, _array: [] },
      };
    }

    return { rowsAffected: 0, rows: { length: 0, item: () => null as any, _array: [] } };
  },
};
