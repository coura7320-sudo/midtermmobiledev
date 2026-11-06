// =============================================================================
// Auth Context (User Profile & Secure Token Storage)
// Implements requirements:
//  - use Context api
//  - Talk to backend api
//  - Store data locally (secure storage)
// =============================================================================

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { ApiService, UserProfile } from '@/services/apiService';
import { KeyValueStore, SecureStore } from '@/services/storageService';

interface AuthContextType {
  user: UserProfile;
  token: string | null;
  isLoading: boolean;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const DEFAULT_USER: UserProfile = {
  id: 'user_me',
  name: 'Couraba Gueye',
  phone: '+221 77 123 45 67',
  about: 'Hey there! I am using WhatsApp 🚀',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
};

const AuthContext = createContext<AuthContextType>({
  user: DEFAULT_USER,
  token: null,
  isLoading: true,
  updateProfile: async () => {},
  refreshProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize from SecureStore and KeyValueStore, then fetch latest from Backend API
  useEffect(() => {
    (async () => {
      try {
        // 1. Load auth token from SecureStore
        const savedToken = await SecureStore.getSecureItem('auth_token');
        if (savedToken) {
          setToken(savedToken);
        } else {
          // Store initial secure token
          const initToken = 'jwt_couraba_midterm_2026_secured_token';
          await SecureStore.setSecureItem('auth_token', initToken);
          setToken(initToken);
        }

        // 2. Load cached profile from KeyValueStore
        const cachedUser = await KeyValueStore.getItem<UserProfile>('user_profile');
        if (cachedUser) {
          setUser(cachedUser);
        }

        // 3. Sync from backend API
        const remoteUser = await ApiService.getProfile();
        if (remoteUser) {
          setUser(remoteUser);
          await KeyValueStore.setItem('user_profile', remoteUser);
        }
      } catch (err) {
        console.warn('[AuthContext] Load error:', err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    try {
      const updated = await ApiService.updateProfile(updates);
      setUser(updated);
      await KeyValueStore.setItem('user_profile', updated);
    } catch (e) {
      setUser((curr) => {
        const next = { ...curr, ...updates };
        KeyValueStore.setItem('user_profile', next);
        return next;
      });
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    const remote = await ApiService.getProfile();
    if (remote) {
      setUser(remote);
      await KeyValueStore.setItem('user_profile', remote);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, updateProfile, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
