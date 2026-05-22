import api, { tokenStore } from './client';

export async function login(username, password) {
  const data = await api.post('/api/auth/login', { username, password });
  if (data && data.token) await tokenStore.set(data.token);
  return data;
}

export async function logout() {
  await tokenStore.clear();
}
