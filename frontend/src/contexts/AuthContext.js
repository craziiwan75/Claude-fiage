import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { tokenStore, onUnauthorized } from '../api/client';
import * as authApi from '../api/auth';

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [bootstrapping, setBootstrapping] = useState(true);
  const [expiryMessage, setExpiryMessage] = useState(null);

  // On boot — restore token (if any) and let the API decide whether it's valid.
  useEffect(() => {
    (async () => {
      const token = await tokenStore.get();
      if (token) {
        // Optimistically set a stub user; first protected call will validate.
        setUser({ username: 'admin', role: 'admin' });
      }
      setBootstrapping(false);
    })();
  }, []);

  // Subscribe to 401 from the axios interceptor — auto-logout.
  useEffect(() => onUnauthorized((msg) => {
    setUser(null);
    setExpiryMessage(msg || '登录已过期，请重新登录');
  }), []);

  const login = useCallback(async (username, password) => {
    const data = await authApi.login(username, password);
    setUser(data.user);
    setExpiryMessage(null);
    return data;
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
  }, []);

  return (
    <AuthCtx.Provider value={{ user, bootstrapping, expiryMessage, setExpiryMessage, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}
