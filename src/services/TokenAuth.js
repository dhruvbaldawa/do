const AUTH_TOKEN_KEY = '_tXYz!is9a';

export function setToken(token) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function isLoggedIn() {
  return !!getToken();
}
