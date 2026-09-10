export const CACHE_KEYS = {
  BOOK_TICKET: "indore_metro_book_ticket_cache",
  JOURNEY_PLANNER: "indore_metro_journey_planner_cache",
  FARE_CALCULATOR: "indore_metro_fare_calc_cache",
  RECHARGE: "indore_metro_recharge_cache",
} as const;

export function saveFormCache<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn(`[FormCache] Failed to save cache for key ${key}:`, err);
  }
}

export function getFormCache<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`[FormCache] Failed to read cache for key ${key}:`, err);
    return null;
  }
}

export function clearFormCache(key: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.warn(`[FormCache] Failed to clear cache for key ${key}:`, err);
  }
}
