export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('erp_token');
}

export function isAuthenticated() {
  return !!getToken();
}

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('erp_token');
    window.location.href = '/login';
  }
}
