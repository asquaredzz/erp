const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export async function apiFetch(path, opts = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('erp_token') : null;
  const headers = opts.headers || {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!headers['Content-Type'] && opts.body) headers['Content-Type'] = 'application/json';
  const res = await fetch(`${API}${path}`, { ...opts, headers });
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

export function setToken(token) {
  if (typeof window !== 'undefined') localStorage.setItem('erp_token', token);
}

export function clearToken() {
  if (typeof window !== 'undefined') localStorage.removeItem('erp_token');
}

export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('erp_token');
}

