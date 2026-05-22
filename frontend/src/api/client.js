import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Resolve base URL — different per platform when running on emulator/device:
//   - Android emulator:  http://10.0.2.2:5000
//   - iOS simulator:     http://localhost:5000
//   - Physical device:   http://<your-machine-LAN-ip>:5000
// You can override at runtime via app.json -> expo.extra.apiBaseUrl, or
// here directly.
const BASE_URL =
  (Constants.expoConfig && Constants.expoConfig.extra && Constants.expoConfig.extra.apiBaseUrl) ||
  'http://10.0.2.2:5000';

const TOKEN_KEY = 'gongfeng.jwt';

// Singleton emitter so AuthContext can react to 401.
const unauthorizedHandlers = new Set();
export const onUnauthorized = (fn) => {
  unauthorizedHandlers.add(fn);
  return () => unauthorizedHandlers.delete(fn);
};

export const tokenStore = {
  async get()      { return AsyncStorage.getItem(TOKEN_KEY); },
  async set(token) { return AsyncStorage.setItem(TOKEN_KEY, token); },
  async clear()    { return AsyncStorage.removeItem(TOKEN_KEY); },
};

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 12000,
});

// ── Request interceptor — attach JWT ───────────────────────────
api.interceptors.request.use(async (config) => {
  const token = await tokenStore.get();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor — unwrap { code, message, data } ──────
api.interceptors.response.use(
  (response) => {
    const body = response.data || {};
    if (body && typeof body === 'object' && 'code' in body) {
      if (body.code === 200) return body.data;
      // Non-200 with HTTP 200 — shouldn't happen with our backend, but be safe
      const err = new Error(body.message || '请求失败');
      err.code = body.code;
      err.data = body.data;
      throw err;
    }
    return body;
  },
  async (error) => {
    const status = error.response && error.response.status;
    const body = (error.response && error.response.data) || {};
    const code = body.code || status || 0;
    const message = body.message || error.message || '网络错误';

    if (code === 401 || status === 401) {
      await tokenStore.clear();
      unauthorizedHandlers.forEach((fn) => fn(message));
    }

    const e = new Error(message);
    e.code = code;
    e.data = body.data;
    throw e;
  },
);

export default api;
