const SESSION_KEY = "miles-and-smiles:session";

export function setSession(email: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSION_KEY, email);
}

export function logout() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
}

export function getSession(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(SESSION_KEY);
}
