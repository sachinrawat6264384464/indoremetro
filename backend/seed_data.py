import sys
import os
from datetime import time, date

# Add backend directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal, Base, engine
from app.core.security import get_password_hash
from app.models import (
    User, Role, Permission, UserRole, RolePermission,
    Station, Route, RouteStation, FareRule, Timetable
)

def seed():
    print("Initializing Database tables...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 1. Seed Roles
        print("Seeding Roles...")
        roles_data = [
            ("SUPER_ADMIN", "Super Administrator with full system control"),
            ("ADMIN", "System Administrator"),
            ("STAFF", "Metro Station Staff / Scanner Operator"),
            ("PASSENGER", "Metro Passenger")
        ]
        role_map = {}
        for code, desc in roles_data:
            role = db.query(Role).filter(Role.name == code).first()
            if not role:
                role = Role(name=code, description=desc)
                db.add(role)
                db.flush()
            role_map[code] = role

        # 2. Seed Permissions
        print("Seeding Permissions...")
        permissions_list = [
            "station:create", "station:update", "station:delete",
            "route:create", "route:update",
            "fare:create", "fare:update",
            "ticket:view", "ticket:cancel",
            "payment:view", "refund:create",
            "user:view", "user:update",
            "alert:create", "alert:publish",
            "admin:access"
        ]
        for perm_code in permissions_list:
            perm = db.query(Permission).filter(Permission.code == perm_code).first()
            if not perm:
                perm = Permission(code=perm_code, description=f"Permission for {perm_code}")
                db.add(perm)
                db.flush()
                # Grant all to SUPER_ADMIN and ADMIN
                db.add(RolePermission(role_id=role_map["SUPER_ADMIN"].id, permission_id=perm.id))
                db.add(RolePermission(role_id=role_map["ADMIN"].id, permission_id=perm.id))
        
        # 3. Seed Users
        print("Seeding Default Users...")
        admin_user = db.query(User).filter(User.email == "admin@indoremetro.gov.in").first()
        if not admin_user:
            admin_user = User(
                name="System Administrator",
                email="admin@indoremetro.gov.in",
                phone="9876543210",
                password_hash=get_password_hash("Admin@123456"),
                is_active=True,
                email_verified=True
            )
            db.add(admin_user)
            db.flush()
            db.add(UserRole(user_id=admin_user.id, role_id=role_map["SUPER_ADMIN"].id))

        test_passenger = db.query(User).filter(User.email == "passenger@indoremetro.gov.in").first()
        if not test_passenger:
            test_passenger = User(
                name="Test Passenger",
                email="passenger@indoremetro.gov.in",
                phone="9876543211",
                password_hash=get_password_hash("User@123456"),
                is_active=True,
                email_verified=True
            )
            db.add(test_passenger)
            db.flush()
            db.add(UserRole(user_id=test_passenger.id, role_id=role_map["PASSENGER"].id))

        # 4. Seed Stations (Indore Metro Yellow Line Priority Corridor)
        print("Seeding Verified Indore Metro Yellow Line Stations...")
        indore_stations = [
            ("Gandhi Nagar", "ST01", 22.7562, 75.8055, ["Wi-Fi", "Elevator", "Parking", "ATM"]),
            ("Super Corridor 2", "ST02", 22.7511, 75.8150, ["Wi-Fi", "Elevator", "Parking"]),
            ("Super Corridor 3", "ST03", 22.7480, 75.8235, ["Wi-Fi", "Elevator"]),
            ("Super Corridor 4", "ST04", 22.7450, 75.8320, ["Wi-Fi", "Elevator", "ATM"]),
            ("Super Corridor 5", "ST05", 22.7420, 75.8410, ["Wi-Fi", "Elevator"]),
            ("Super Corridor 6", "ST06", 22.7390, 75.8500, ["Wi-Fi", "Elevator", "Parking"]),
            ("MR 10 Road", "ST07", 22.7430, 75.8600, ["Wi-Fi", "Elevator", "ATM"]),
            ("ISBT / MR 10", "ST08", 22.7470, 75.8700, ["Wi-Fi", "Elevator", "Bus Interchange", "Parking"]),
            ("Chandragupta Square", "ST09", 22.7500, 75.8780, ["Wi-Fi", "Elevator"]),
            ("Hira Nagar", "ST10", 22.7530, 75.8850, ["Wi-Fi", "Elevator"]),
            ("Bapat Square", "ST11", 22.7560, 75.8920, ["Wi-Fi", "Elevator", "ATM"]),
            ("Meghdoot Garden", "ST12", 22.7540, 75.8980, ["Wi-Fi", "Elevator", "Park Access"]),
            ("Vijay Nagar Square", "ST13", 22.7520, 75.8940, ["Wi-Fi", "Elevator", "Commercial Hub", "ATM"]),
            ("Radisson Square", "ST14", 22.7380, 75.8970, ["Wi-Fi", "Elevator", "Hotel Access"]),
            ("Mumtaj Bag", "ST15", 22.7290, 75.8920, ["Wi-Fi", "Elevator"]),
            ("Palasia", "ST16", 22.7200, 75.8840, ["Wi-Fi", "Elevator", "Shopping Hub", "Parking"])
        ]

        station_objs = []
        for name, code, lat, lng, amenities in indore_stations:
            st = db.query(Station).filter(Station.code == code).first()
            if not st:
                st = Station(
                    name=name,
                    code=code,
                    line_name="Yellow Line",
                    latitude=lat,
                    longitude=lng,
                    status="ACTIVE",
                    amenities=amenities
                )
                db.add(st)
                db.flush()
            station_objs.append(st)

        # 5. Seed Routes & Station Ordering
        print("Seeding Routes & Station Ordering...")
        route_up = db.query(Route).filter(Route.code == "YL-UP").first()
        if not route_up:
            route_up = Route(
                name="Yellow Line - UP",
                code="YL-UP",
                line_name="Yellow Line",
                line_color="#F59E0B",
                direction="Gandhi Nagar to Palasia",
                status="ACTIVE"
            )
            db.add(route_up)
            db.flush()
            for idx, st in enumerate(station_objs, start=1):
                rs = RouteStation(
                    route_id=route_up.id,
                    station_id=st.id,
                    station_order=idx,
                    distance_from_start_km=round((idx - 1) * 1.5, 2),
                    travel_time_mins=(idx - 1) * 2
                )
                db.add(rs)

        route_down = db.query(Route).filter(Route.code == "YL-DOWN").first()
        if not route_down:
            route_down = Route(
                name="Yellow Line - DOWN",
                code="YL-DOWN",
                line_name="Yellow Line",
                line_color="#F59E0B",
                direction="Palasia to Gandhi Nagar",
                status="ACTIVE"
            )
            db.add(route_down)
            db.flush()
            for idx, st in enumerate(reversed(station_objs), start=1):
                rs = RouteStation(
                    route_id=route_down.id,
                    station_id=st.id,
                    station_order=idx,
                    distance_from_start_km=round((idx - 1) * 1.5, 2),
                    travel_time_mins=(idx - 1) * 2
                )
                db.add(rs)

        # 6. Seed Fare Rules
        print("Seeding Fare Matrix Rules...")
        fare_matrix = [
            (0, 3, 10.00),
            (4, 6, 20.00),
            (7, 10, 30.00),
            (11, 20, 40.00)
        ]
        for min_s, max_s, fare_val in fare_matrix:
            fr = db.query(FareRule).filter(FareRule.min_stops == min_s, FareRule.max_stops == max_s).first()
            if not fr:
                fr = FareRule(
                    min_stops=min_s,
                    max_stops=max_s,
                    fare_amount=fare_val,
                    status="ACTIVE"
                )
                db.add(fr)

        # 7. Seed Timetable
        print("Seeding Timetable Schedules...")
        for st in station_objs:
            tt = db.query(Timetable).filter(Timetable.station_id == st.id, Timetable.route_id == route_up.id).first()
            if not tt:
                tt = Timetable(
                    route_id=route_up.id,
                    station_id=st.id,
                    first_train_time=time(6, 0),
                    last_train_time=time(22, 30),
                    peak_frequency_mins=7,
                    off_peak_frequency_mins=15,
                    operating_days="Monday to Sunday",
                    status="ACTIVE"
                )
                db.add(tt)

        db.commit()
        print("Seed script completed successfully!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed()
