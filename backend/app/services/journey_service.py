from sqlalchemy.orm import Session
from app.models.route import Route, RouteStation
from app.models.station import Station
from app.services.fare_service import FareService
from app.core.exceptions import MetroAPIException
from typing import Dict, Any, List

class JourneyService:
    @staticmethod
    def plan_journey(db: Session, source_station_id: str, dest_station_id: str) -> Dict[str, Any]:
        if source_station_id == dest_station_id:
            raise MetroAPIException(status_code=400, code="SAME_STATION", message="Source and destination stations cannot be identical")

        source_st = db.query(Station).filter(Station.id == source_station_id).first()
        dest_st = db.query(Station).filter(Station.id == dest_station_id).first()

        if not source_st or not dest_st:
            raise MetroAPIException(status_code=404, code="STATION_NOT_FOUND", message="One or both selected stations do not exist")

        # Find route matching sequence
        routes = db.query(Route).filter(Route.status == "ACTIVE").all()
        selected_route = None
        source_order = None
        dest_order = None

        for route in routes:
            rs_src = db.query(RouteStation).filter(RouteStation.route_id == route.id, RouteStation.station_id == source_station_id).first()
            rs_dst = db.query(RouteStation).filter(RouteStation.route_id == route.id, RouteStation.station_id == dest_station_id).first()

            if rs_src and rs_dst and rs_src.station_order < rs_dst.station_order:
                selected_route = route
                source_order = rs_src.station_order
                dest_order = rs_dst.station_order
                break

        # Fallback to reverse route direction if going down
        if not selected_route:
            for route in routes:
                rs_src = db.query(RouteStation).filter(RouteStation.route_id == route.id, RouteStation.station_id == source_station_id).first()
                rs_dst = db.query(RouteStation).filter(RouteStation.route_id == route.id, RouteStation.station_id == dest_station_id).first()

                if rs_src and rs_dst:
                    selected_route = route
                    source_order = rs_src.station_order
                    dest_order = rs_dst.station_order
                    break

        if not selected_route:
            raise MetroAPIException(status_code=400, code="NO_ROUTE", message="No active route found between selected stations")

        # Fetch intermediate stations
        min_order, max_order = min(source_order, dest_order), max(source_order, dest_order)
        route_stations = db.query(RouteStation).filter(
            RouteStation.route_id == selected_route.id,
            RouteStation.station_order >= min_order,
            RouteStation.station_order <= max_order
        ).order_by(RouteStation.station_order.asc() if source_order < dest_order else RouteStation.station_order.desc()).all()

        stop_count, base_fare, total_fare = FareService.calculate_fare(db, source_station_id, dest_station_id, passenger_count=1)
        
        distance_km = abs(route_stations[-1].distance_from_start_km - route_stations[0].distance_from_start_km) if route_stations else 0.0
        estimated_time_mins = stop_count * 2

        intermediate = [
            {
                "station_order": rs.station_order,
                "station": rs.station
            }
            for rs in route_stations
        ]

        # Extract GeoJSON coordinates for journey path
        route_coords = []
        for rs in route_stations:
            if rs.station and rs.station.latitude and rs.station.longitude:
                route_coords.append([rs.station.longitude, rs.station.latitude])

        return {
            "source_station": source_st,
            "dest_station": dest_st,
            "route_name": selected_route.name,
            "direction": selected_route.direction,
            "line_color": selected_route.line_color,
            "stop_count": stop_count,
            "estimated_time_mins": estimated_time_mins,
            "distance_km": round(distance_km, 2),
            "fare_amount": base_fare,
            "intermediate_stations": intermediate,
            "geojson_geometry": {
                "type": "Feature",
                "geometry": {
                    "type": "LineString",
                    "coordinates": route_coords
                },
                "properties": {
                    "line_name": selected_route.line_name,
                    "line_color": selected_route.line_color
                }
            }
        }
