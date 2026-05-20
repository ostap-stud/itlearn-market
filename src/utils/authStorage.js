const AUTH_KEY = 'itlearn-auth';

export function loadAuth() {
  try {
    const value = window.localStorage.getItem(AUTH_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

export function saveAuth(auth) {
  window.localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
}

export function clearAuth() {
  window.localStorage.removeItem(AUTH_KEY);
}
