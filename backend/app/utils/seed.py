import logging
import uuid
import sqlalchemy as sa
from datetime import datetime, timezone, timedelta
from app.core.database import SessionLocal
from app.core.security import get_password_hash
from app.models.user import User, UserRole
from app.models.customer import Customer, CustomerStatus

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("seed")


def seed_database():
    """Seeds the database with admin users and initial demo customers."""
    # Schema is managed by Alembic migrations — do NOT call create_all here
    # as it can recreate stale native enum types that conflict with VARCHAR columns.
    db = SessionLocal()

    try:
        # Normalize any stale uppercase role or status values from previous schema versions
        # This is a safe idempotent operation
        try:
            db.execute(
                sa.text("UPDATE users SET role = LOWER(role) WHERE role != LOWER(role)")
            )
            db.execute(
                sa.text("UPDATE customers SET status = LOWER(status) WHERE status != LOWER(status)")
            )
            db.commit()
        except Exception:
            db.rollback()

        # 1. Seed Demo Users
        demo_users = [
            {
                "email": "admin@example.com",
                "password": "Admin@123",
                "role": UserRole.ADMIN,
            },
            {
                "email": "manager@example.com",
                "password": "Manager@123",
                "role": UserRole.MANAGER,
            },
            {
                "email": "viewer@example.com",
                "password": "Viewer@1234",
                "role": UserRole.VIEWER,
            },
        ]

        for u in demo_users:
            existing = db.query(User).filter(User.email == u["email"]).first()
            if not existing:
                user = User(
                    id=uuid.uuid4(),
                    email=u["email"],
                    password_hash=get_password_hash(u["password"]),
                    is_active=True,
                    role=u["role"],
                    created_at=datetime.now(timezone.utc),
                    updated_at=datetime.now(timezone.utc)
                )
                db.add(user)
                logger.info(f"Created user: {u['email']} (role={u['role'].value})")
            else:
                if existing.role != u["role"]:
                    existing.role = u["role"]
                    existing.password_hash = get_password_hash(u["password"])
                    logger.info(f"Updated user role for: {u['email']} -> {u['role'].value}")
        db.commit()

        # 2. Seed Initial Customers
        initial_customers = [
            {
                "name": "Olivia Martin",
                "email": "olivia@northstar.com",
                "phone": "+91 98765 43210",
                "company": "Northstar Labs",
                "status": CustomerStatus.ACTIVE,
            },
            {
                "name": "Sarah Jenkins",
                "email": "sarah.jenkins@technicorp.com",
                "phone": "+1 (555) 782-9011",
                "company": "Technicorp",
                "status": CustomerStatus.ACTIVE,
            },
            {
                "name": "Elena Rostova",
                "email": "elena.rostova@hyperion.ai",
                "phone": "+1 (555) 891-2345",
                "company": "Hyperion Dynamics",
                "status": CustomerStatus.ACTIVE,
            },
            {
                "name": "Marcus Vance",
                "email": "marcus.vance@vanguard.io",
                "phone": "+1 (555) 342-9811",
                "company": "Vanguard Logistics",
                "status": CustomerStatus.ACTIVE,
            },
            {
                "name": "Sophia Chen",
                "email": "sophia.chen@nexuscloud.com",
                "phone": "+1 (555) 674-1290",
                "company": "NexusCloud Systems",
                "status": CustomerStatus.ACTIVE,
            },
            {
                "name": "Liam Gallagher",
                "email": "liam@acmecorp.com",
                "phone": "+1 (555) 902-4412",
                "company": "Acme Global Solutions",
                "status": CustomerStatus.ACTIVE,
            },
            {
                "name": "Astrid Lindholm",
                "email": "astrid@nordicfintech.se",
                "phone": "+46 8 123 4567",
                "company": "Nordic FinTech AB",
                "status": CustomerStatus.ACTIVE,
            },
            {
                "name": "Darius Thorne",
                "email": "darius@apexanalytics.io",
                "phone": "+1 (555) 431-7788",
                "company": "Apex Analytics Group",
                "status": CustomerStatus.LEAD,
            },
            {
                "name": "Amira Al-Mansoor",
                "email": "amira@crestviewventures.ae",
                "phone": "+971 4 321 8899",
                "company": "Crestview Ventures",
                "status": CustomerStatus.LEAD,
            },
            {
                "name": "Julian Mercer",
                "email": "j.mercer@strataenergy.com",
                "phone": "+1 (555) 890-1122",
                "company": "Strata Energy Corp",
                "status": CustomerStatus.LEAD,
            },
            {
                "name": "Beatriz Silva",
                "email": "bsilva@solarisbio.org",
                "phone": "+55 11 98765-4321",
                "company": "Solaris BioTech",
                "status": CustomerStatus.LEAD,
            },
            {
                "name": "Victor Sterling",
                "email": "victor@sterlingsecurity.com",
                "phone": "+1 (555) 231-9004",
                "company": "Sterling Cyber Defense",
                "status": CustomerStatus.INACTIVE,
            },
            {
                "name": "Hannah Abbott",
                "email": "hannah@luminahealth.com",
                "phone": "+1 (555) 789-3321",
                "company": "Lumina Health Partners",
                "status": CustomerStatus.INACTIVE,
            },
            {
                "name": "Kaito Tanaka",
                "email": "k.tanaka@zenithrobotics.jp",
                "phone": "+81 3 5555 0143",
                "company": "Zenith Robotics",
                "status": CustomerStatus.ACTIVE,
            }
        ]

        now = datetime.now(timezone.utc)
        count = 0
        for idx, item in enumerate(initial_customers):
            existing = db.query(Customer).filter(Customer.email == item["email"]).first()
            if not existing:
                customer = Customer(
                    id=uuid.uuid4(),
                    name=item["name"],
                    email=item["email"],
                    phone=item["phone"],
                    company=item["company"],
                    status=item["status"],
                    created_at=now - timedelta(days=idx * 2, hours=idx * 3),
                    updated_at=now - timedelta(days=idx * 2, hours=idx * 3)
                )
                db.add(customer)
                count += 1

        db.commit()
        logger.info(f"Seeded {count} new customers. Total customers in DB: {db.query(Customer).count()}")

    except Exception as e:
        logger.error(f"Error seeding database: {e}")
        db.rollback()
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
