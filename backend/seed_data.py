import sys
import os
from datetime import time, date

# Add backend directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal, Base, engine
from app.core.security import get_password_hash
from app.models import (
    User, Role, Permission, UserRole, RolePermission,
    Station, Route, RouteStation, FareRule, Timetable, NearbyPlace
)

def seed():
    print("Re-initializing Database tables with updated schemas...")
    Base.metadata.drop_all(bind=engine)
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

        # 4. Seed Stations (All 29 Official Indore Metro Yellow Line Stations)
        print("Seeding All 29 Official Indore Metro Yellow Line Stations...")
        indore_stations = [
            (1, "Devi Ahilya Bai Holkar Terminal", "ST01", "देवी अहिल्या बाई होल्कर टर्मिनल", "Super Corridor", 22.7562, 75.8055, "ACTIVE", ["Lift & Escalator", "Wheelchair Accessible", "Public Toilets", "Drinking Water", "Parking", "Free Wi-Fi", "ATM", "Feeder Bus / Auto"], [{"gate": "Gate 1", "desc": "Super Corridor Road / IT Park"}, {"gate": "Gate 2", "desc": "MR-10 Side"}]),
            (2, "Maharani Lakshmi Bai", "ST02", "महारानी लक्ष्मी बाई", "Super Corridor", 22.7511, 75.8150, "ACTIVE", ["Lift & Escalator", "Wheelchair Accessible", "Public Toilets", "Drinking Water", "Free Wi-Fi"], [{"gate": "Gate 1", "desc": "Super Corridor Sector 2"}]),
            (3, "Rani Avanti Bai Lodhi", "ST03", "रानी अवंती बाई लोधी", "Super Corridor", 22.7480, 75.8235, "ACTIVE", ["Lift & Escalator", "Wheelchair Accessible", "Drinking Water"], [{"gate": "Gate 1", "desc": "Super Corridor Sector 3"}]),
            (4, "Rani Durgavati", "ST04", "रानी दुर्गावती", "Super Corridor", 22.7450, 75.8320, "ACTIVE", ["Lift & Escalator", "Wheelchair Accessible", "ATM"], [{"gate": "Gate 1", "desc": "Super Corridor Sector 4"}]),
            (5, "Veerangana Jhalkari Bai", "ST05", "वीरांगना झलकारी बाई", "Gandhi Nagar", 22.7420, 75.8410, "ACTIVE", ["Lift & Escalator", "Wheelchair Accessible", "Parking", "Free Wi-Fi"], [{"gate": "Gate 1", "desc": "Gandhi Nagar Main Road"}]),
            (6, "Super Corridor 2", "ST06", "सुपर कॉरिडोर 2", "Super Corridor", 22.7390, 75.8500, "ACTIVE", ["Lift & Escalator", "Wheelchair Accessible", "Parking"], [{"gate": "Gate 1", "desc": "Super Corridor East"}]),
            (7, "Super Corridor 1", "ST07", "सुपर कॉरिडोर 1", "Super Corridor", 22.7430, 75.8600, "ACTIVE", ["Lift & Escalator", "Wheelchair Accessible", "ATM"], [{"gate": "Gate 1", "desc": "Super Corridor Junction"}]),
            (8, "Bhawarshala Square", "ST08", "भंवरशाला स्क्वायर", "Bhawarshala", 22.7470, 75.8700, "ACTIVE", ["Lift & Escalator", "Wheelchair Accessible", "Parking", "Bus Interchange"], [{"gate": "Gate 1", "desc": "Bhawarshala Chauraha"}]),
            (9, "MR 10 Road", "ST09", "एमआर 10 रोड", "MR-10", 22.7500, 75.8780, "ACTIVE", ["Lift & Escalator", "Wheelchair Accessible", "ATM"], [{"gate": "Gate 1", "desc": "MR 10 Road Exit"}]),
            (10, "ISBT / MR 10 Flyover", "ST10", "आईएसबीटी / एमआर 10 फ्लाईओवर", "MR-10", 22.7530, 75.8850, "ACTIVE", ["Lift & Escalator", "Wheelchair Accessible", "Bus Interchange", "Parking", "ATM"], [{"gate": "Gate 1", "desc": "ISBT Terminal Entrance"}]),
            (11, "Chandragupta Square", "ST11", "चंद्रगुप्त स्क्वायर", "Vijay Nagar", 22.7560, 75.8920, "ACTIVE", ["Lift & Escalator", "Wheelchair Accessible", "Free Wi-Fi"], [{"gate": "Gate 1", "desc": "Chandragupta Square"}]),
            (12, "Hira Nagar", "ST12", "हीरा नगर", "Hira Nagar", 22.7540, 75.8980, "ACTIVE", ["Lift & Escalator", "Wheelchair Accessible", "Drinking Water"], [{"gate": "Gate 1", "desc": "Hira Nagar Main Road"}]),
            (13, "Bapat Square", "ST13", "बापट स्क्वायर", "Bapat Square", 22.7520, 75.8940, "ACTIVE", ["Lift & Escalator", "Wheelchair Accessible", "ATM", "Parking"], [{"gate": "Gate 1", "desc": "Bapat Square Market"}]),
            (14, "Meghdoot Garden", "ST14", "मेघदूत गार्डन", "Vijay Nagar", 22.7380, 75.8970, "ACTIVE", ["Lift & Escalator", "Wheelchair Accessible", "Park Access", "Parking"], [{"gate": "Gate 1", "desc": "Meghdoot Park Main Entrance"}]),
            (15, "Vijay Nagar Square", "ST15", "विजय नगर स्क्वायर", "Vijay Nagar", 22.7290, 75.8920, "ACTIVE", ["Lift & Escalator", "Wheelchair Accessible", "Commercial Hub", "ATM", "Free Wi-Fi"], [{"gate": "Gate 1", "desc": "Vijay Nagar Square / Malhar Mall Side"}]),
            (16, "Radisson Square", "ST16", "रेडिसन स्क्वायर", "Vijay Nagar", 22.7200, 75.8840, "ACTIVE", ["Lift & Escalator", "Wheelchair Accessible", "Hotel Access", "Parking"], [{"gate": "Gate 1", "desc": "Radisson Blu Hotel Road"}]),
            (17, "Mumtaj Bag Colony", "ST17", "मुमताज बाग कॉलोनी", "Mumtaj Bag", 22.7150, 75.8750, "UNDER_CONSTRUCTION", ["Lift & Escalator", "Wheelchair Accessible"], [{"gate": "Gate 1", "desc": "Mumtaj Bag Colony Road"}]),
            (18, "Khajrana Square", "ST18", "खजराना स्क्वायर", "Khajrana", 22.7100, 75.8700, "UNDER_CONSTRUCTION", ["Lift & Escalator", "Wheelchair Accessible"], [{"gate": "Gate 1", "desc": "Khajrana Temple Road"}]),
            (19, "Bengali Square", "ST19", "बंगाली स्क्वायर", "Bengali Square", 22.7050, 75.8650, "UNDER_CONSTRUCTION", ["Lift & Escalator", "Wheelchair Accessible"], [{"gate": "Gate 1", "desc": "Bengali Square Ring Road"}]),
            (20, "Patrakar Colony", "ST20", "पत्रकार कॉलोनी", "Patrakar Colony", 22.7000, 75.8600, "UNDER_CONSTRUCTION", ["Lift & Escalator", "Wheelchair Accessible"], [{"gate": "Gate 1", "desc": "Patrakar Colony Main Entrance"}]),
            (21, "Palasia Square", "ST21", "पलासिया स्क्वायर", "Palasia", 22.7200, 75.8840, "UNDER_CONSTRUCTION", ["Lift & Escalator", "Wheelchair Accessible", "Shopping Hub", "Parking"], [{"gate": "Gate 1", "desc": "Greater Palasia Chauraha"}]),
            (22, "High Court", "ST22", "हाई कोर्ट", "MG Road", 22.7180, 75.8650, "UNDER_CONSTRUCTION", ["Lift & Escalator", "Wheelchair Accessible"], [{"gate": "Gate 1", "desc": "MP High Court Gate"}]),
            (23, "Indore Junction Railway Station", "ST23", "इंदौर जंक्शन रेलवे स्टेशन", "Railway Station", 22.7177, 75.8682, "UNDER_CONSTRUCTION", ["Lift & Escalator", "Railway Interchange", "ATM"], [{"gate": "Gate 1", "desc": "Railway Platform Entrance"}]),
            (24, "Rajwada", "ST24", "राजवाड़ा", "Old City", 22.7196, 75.8577, "UNDER_CONSTRUCTION", ["Lift & Escalator", "Heritage Hub"], [{"gate": "Gate 1", "desc": "Rajwada Palace Entrance"}]),
            (25, "Chota Ganpati", "ST25", "छोटा गणपति", "Chota Ganpati", 22.7220, 75.8500, "UNDER_CONSTRUCTION", ["Lift & Escalator"], [{"gate": "Gate 1", "desc": "Chota Ganpati Temple Road"}]),
            (26, "Bada Ganpati", "ST26", "बड़ा गणपति", "Bada Ganpati", 22.7250, 75.8450, "UNDER_CONSTRUCTION", ["Lift & Escalator"], [{"gate": "Gate 1", "desc": "Bada Ganpati Chauraha"}]),
            (27, "Ramchandra Nagar Square", "ST27", "रामचंद्र नगर स्क्वायर", "Ramchandra Nagar", 22.7280, 75.8400, "UNDER_CONSTRUCTION", ["Lift & Escalator"], [{"gate": "Gate 1", "desc": "Ramchandra Nagar Main Road"}]),
            (28, "BSF / Kalani Nagar", "ST28", "बीएसएफ / कलानी नगर", "Kalani Nagar", 22.7320, 75.8350, "UNDER_CONSTRUCTION", ["Lift & Escalator"], [{"gate": "Gate 1", "desc": "BSF Campus Gate"}]),
            (29, "Airport", "ST29", "एयरपोर्ट", "Indore Airport", 22.7250, 75.8020, "UNDER_CONSTRUCTION", ["Lift & Escalator", "Airport Underground Shuttle", "Parking"], [{"gate": "Gate 1", "desc": "Indore Airport Departure Terminal"}])
        ]

        station_objs = []
        for num, name, code, hindi_name, area, lat, lng, status, amenities, gates in indore_stations:
            st = db.query(Station).filter(Station.code == code).first()
            nearby = [
                {"title": f"City Bus Stop - {name}", "location": "Gate 1", "fare": "City bus ₹10+"},
                {"title": "Auto / E-Rickshaw Stand", "location": "Near exit", "fare": "₹20-50"}
            ]
            parking = [
                {"vehicle": "Two-wheeler", "day": "₹10", "night": "₹20"},
                {"vehicle": "Car", "day": "₹30", "night": "₹50"},
                {"vehicle": "Cycle", "day": "₹5", "night": "₹10"}
            ]
            if not st:
                st = Station(
                    name=name,
                    code=code,
                    hindi_name=hindi_name,
                    area=area,
                    station_number=num,
                    line_name="Yellow Line",
                    timings="06:00 AM - 10:00 PM",
                    base_fare="₹10",
                    latitude=lat,
                    longitude=lng,
                    status=status,
                    amenities=amenities,
                    gates=gates,
                    nearby_transport=nearby,
                    parking_charges=parking
                )
                db.add(st)
                db.flush()
            else:
                st.name = name
                st.hindi_name = hindi_name
                st.area = area
                st.station_number = num
                st.status = status
                st.amenities = amenities
                st.gates = gates
                st.nearby_transport = nearby
                st.parking_charges = parking
                db.commit()
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

        # 8. Seed Real Nearby POIs & Landmarks
        print("Seeding Real Verified Nearby Places for Indore Stations...")
        st_map = {st.code: st.id for st in station_objs}
        nearby_data = [
            (st_map.get("ST01"), "Devi Ahilya Bai Holkar International Airport", "Airport", 22.7219, 75.8011, 4.2, "Airport Rd, Indore, MP", "plane"),
            (st_map.get("ST04"), "TCS & Infosys IT Park Campus", "College / University", 22.7445, 75.8315, 0.4, "Super Corridor, Indore", "building"),
            (st_map.get("ST08"), "Inter State Bus Terminal (ISBT MR10)", "Bus Stand", 22.7472, 75.8705, 0.1, "MR 10 Rd, Indore", "bus"),
            (st_map.get("ST12"), "Meghdoot Garden & Park", "Tourist Place", 22.7542, 75.8985, 0.2, "Vijay Nagar, Indore", "tree"),
            (st_map.get("ST13"), "C21 Mall & Malhar Mega Mall", "Mall / Shopping", 22.7525, 75.8945, 0.3, "AB Rd, Vijay Nagar, Indore", "shopping-bag"),
            (st_map.get("ST14"), "Radisson Blu Hotel Indore", "Hotel", 22.7382, 75.8975, 0.1, "Ring Rd, Indore", "hotel"),
            (st_map.get("ST16"), "Chappan Dukan Food Street", "Restaurant", 22.7230, 75.8820, 0.8, "New Palasia, Indore", "utensils"),
            (st_map.get("ST16"), "Indore Junction Railway Station", "Railway Station", 22.7177, 75.8682, 2.1, "Chhoti Gwaltoli, Indore", "train"),
            (st_map.get("ST16"), "Rajwada Palace Landmark", "Tourist Place", 22.7196, 75.8570, 3.2, "Rajwada, Indore", "landmark"),
        ]

        for st_id, name, cat, lat, lng, dist, addr, icon in nearby_data:
            if st_id:
                np_obj = db.query(NearbyPlace).filter(NearbyPlace.name == name).first()
                if not np_obj:
                    np_obj = NearbyPlace(
                        station_id=st_id,
                        name=name,
                        category=cat,
                        latitude=lat,
                        longitude=lng,
                        distance_km=dist,
                        address=addr,
                        icon=icon
                    )
                    db.add(np_obj)

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
