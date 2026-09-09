from sqlalchemy.orm import Session
from app.models.fare import FareRule
from app.models.route import RouteStation
from app.core.exceptions import MetroAPIException
from typing import List, Tuple

class FareService:
    @staticmethod
    def get_all_fare_rules(db: Session) -> List[FareRule]:
        return db.query(FareRule).filter(FareRule.status == "ACTIVE").order_by(FareRule.min_stops.asc()).all()

    @staticmethod
    def calculate_fare(db: Session, source_station_id: str, dest_station_id: str, passenger_count: int = 1) -> Tuple[int, float, float]:
        if source_station_id == dest_station_id:
            raise MetroAPIException(status_code=400, code="SAME_STATION", message="Source and destination stations cannot be the same")

        # Find a route containing both stations
        rs_source = db.query(RouteStation).filter(RouteStation.station_id == source_station_id).first()
        rs_dest = db.query(RouteStation).filter(RouteStation.station_id == dest_station_id).first()

        if not rs_source or not rs_dest:
            raise MetroAPIException(status_code=400, code="NO_ROUTE", message="No active route connects the selected stations")

        # Calculate absolute stop count difference
        stop_count = abs(rs_source.station_order - rs_dest.station_order)

        # Lookup matching fare rule
        fare_rule = db.query(FareRule).filter(
            FareRule.status == "ACTIVE",
            FareRule.min_stops <= stop_count,
            FareRule.max_stops >= stop_count
        ).first()

        if not fare_rule:
            # Fallback tiered calculation if beyond defined range
            base_fare = 40.0 if stop_count > 10 else 10.0
        else:
            base_fare = float(fare_rule.fare_amount)

        total_fare = base_fare * passenger_count
        return stop_count, base_fare, total_fare
