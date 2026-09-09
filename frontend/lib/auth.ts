import { User } from "@/types";

export function saveAuthSession(token: string, user: User) {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  }
}

export function clearAuthSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
}

export function getStoredUser(): User | null {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem("user");
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return null;
      }
    }
  }
  return null;
}

export function isAuthenticated(): boolean {
  if (typeof window !== "undefined") {
    return !!localStorage.getItem("token");
  }
  return false;
}

export function isAdminUser(): boolean {
  const user = getStoredUser();
  if (!user || !user.roles) return false;
  return user.roles.includes("SUPER_ADMIN") || user.roles.includes("ADMIN");
}
