import { apiFetch } from "@/lib/api";

export interface GeoJSONFeature {
  type: "Feature";
  geometry: {
    type: "Point" | "LineString";
    coordinates: any;
  };
  properties: Record<string, any>;
}

export interface GeoJSONCollection {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
  stations_geojson?: {
    type: "FeatureCollection";
    features: GeoJSONFeature[];
  };
  lines_geojson?: {
    type: "FeatureCollection";
    features: GeoJSONFeature[];
  };
}

export interface MetroStatistics {
  total_stations: number;
  operational_stations: number;
  upcoming_stations: number;
  under_construction_stations: number;
  total_lines: number;
  network_length_km: number;
  priority_corridor_length_km: number;
}

export interface NearbyPlaceItem {
  id: string;
  station_id: string;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  distance_km: number;
  address?: string;
  icon?: string;
}

export async function fetchMetroGeoJSON() {
  return await apiFetch<GeoJSONCollection>("/metro/geojson");
}

export async function fetchMetroStatistics() {
  return await apiFetch<MetroStatistics>("/metro/statistics");
}

export async function fetchNearbyPlaces(stationId: string) {
  return await apiFetch<NearbyPlaceItem[]>(`/places/nearby?station_id=${stationId}`);
}

export async function searchNearbyPlaces(query: string, category?: string) {
  const queryParam = query ? `q=${encodeURIComponent(query)}` : "";
  const catParam = category ? `category=${encodeURIComponent(category)}` : "";
  const params = [queryParam, catParam].filter(Boolean).join("&");
  return await apiFetch<NearbyPlaceItem[]>(`/places/search${params ? `?${params}` : ""}`);
}
