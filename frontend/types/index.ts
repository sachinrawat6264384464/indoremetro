export interface Station {
  id: string;
  name: string;
  code: string;
  line_name: string;
  latitude?: number;
  longitude?: number;
  status: 'ACTIVE' | 'INACTIVE' | 'UNDER_CONSTRUCTION';
  amenities: string[];
}

export interface RouteStation {
  id: string;
  station_order: number;
  distance_from_start_km: number;
  travel_time_mins: number;
  station: Station;
}

export interface Route {
  id: string;
  name: string;
  code: string;
  line_name: string;
  line_color: string;
  direction: string;
  status: string;
  route_stations: RouteStation[];
}

export interface JourneyPlan {
  source_station: Station;
  dest_station: Station;
  route_name: string;
  direction: string;
  stop_count: number;
  estimated_time_mins: number;
  distance_km: number;
  fare_amount: number;
  intermediate_stations: {
    station_order: number;
    station: Station;
  }[];
}

export interface FareCalculation {
  source_station_name: string;
  dest_station_name: string;
  stop_count: number;
  base_fare_per_passenger: number;
  passenger_count: number;
  total_fare: number;
}

export interface TicketPassenger {
  id: string;
  passenger_name: string;
  passenger_type: string;
  age?: number;
}

export interface Ticket {
  id: string;
  ticket_number: string;
  source_station: Station;
  dest_station: Station;
  journey_date: string;
  passenger_count: number;
  base_fare: number;
  total_fare: number;
  status: 'PENDING_PAYMENT' | 'CONFIRMED' | 'USED' | 'CANCELLED' | 'EXPIRED' | 'REFUNDED' | 'PAYMENT_FAILED';
  qr_code_hash?: string;
  qr_image_base64?: string;
  expires_at?: string;
  created_at: string;
  passengers?: TicketPassenger[];
}

export interface ServiceAlert {
  id: string;
  title: string;
  message: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  status: string;
  created_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  roles: string[];
}

export interface DashboardMetrics {
  total_users: number;
  total_tickets: number;
  today_tickets: number;
  total_revenue: number;
  today_revenue: number;
  successful_payments: number;
  failed_payments: number;
  active_stations: number;
  popular_stations: { name: string; bookings: number }[];
}
