from sqlalchemy.orm import Session
from app.models.station import Station
from app.models.route import Route, RouteStation
from typing import Dict, Any, List

class MetroMapService:
    @staticmethod
    def get_metro_geojson(db: Session) -> Dict[str, Any]:
        stations = db.query(Station).order_by(Station.code.asc()).all()
        routes = db.query(Route).filter(Route.status == "ACTIVE").all()

        station_features: List[Dict[str, Any]] = []
        for st in stations:
            if st.latitude and st.longitude:
                # GeoJSON coordinates order: [longitude, latitude]
                station_features.append({
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [st.longitude, st.latitude]
                    },
                    "properties": {
                        "id": st.id,
                        "name": st.name,
                        "code": st.code,
                        "line_name": st.line_name,
                        "status": st.status,
                        "amenities": st.amenities or []
                    }
                })

        line_features: List[Dict[str, Any]] = []
        for rt in routes:
            route_stations = (
                db.query(RouteStation)
                .filter(RouteStation.route_id == rt.id)
                .order_by(RouteStation.station_order.asc())
                .all()
            )
            coords = []
            for rs in route_stations:
                if rs.station and rs.station.latitude and rs.station.longitude:
                    coords.append([rs.station.longitude, rs.station.latitude])

            if len(coords) > 1:
                line_features.append({
                    "type": "Feature",
                    "geometry": {
                        "type": "LineString",
                        "coordinates": coords
                    },
                    "properties": {
                        "id": rt.id,
                        "name": rt.name,
                        "code": rt.code,
                        "line_name": rt.line_name,
                        "line_color": rt.line_color,
                        "direction": rt.direction,
                        "status": rt.status
                    }
                })

        return {
            "type": "FeatureCollection",
            "features": station_features + line_features,
            "stations_geojson": {
                "type": "FeatureCollection",
                "features": station_features
            },
            "lines_geojson": {
                "type": "FeatureCollection",
                "features": line_features
            }
        }
