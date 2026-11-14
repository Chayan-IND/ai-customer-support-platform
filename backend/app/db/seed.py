import sys
from datetime import datetime, timedelta, timezone
from decimal import Decimal

import bcrypt
from sqlalchemy import select

from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.models import (
    Customer,
    Order,
    OrderItem,
    Payment,
    Product,
    ReturnRequest,
    SupportTicket,
    User,
)

# Demo-only password for the fake test accounts below.
DEMO_PASSWORD = "DemoPass123"


def hash_password(plain: str) -> str:
    return bcrypt.hashpw(plain.encode(), bcrypt.gensalt()).decode()


def days_ago(n: int | None):
    if n is None:
        return None
    return datetime.now(timezone.utc) - timedelta(days=n)


def make_order(
    db,
    number: str,
    customer: Customer,
    lines: list,
    status: str,
    placed: int,
    method: str,
    shipped: int | None = None,
    delivered: int | None = None,
    expected_in: int | None = None,
) -> Order:
    """Creates an order with its items and one payment."""
    total = sum((product.price * qty for product, qty in lines), Decimal("0"))
    expected = None
    if expected_in is not None:
        expected = (datetime.now(timezone.utc) + timedelta(days=expected_in)).date()

    order = Order(
        order_number=number,
        customer_id=customer.id,
        status=status,
        total_amount=total,
        placed_at=days_ago(placed),
        shipped_at=days_ago(shipped),
        delivered_at=days_ago(delivered),
        expected_delivery=expected,
    )
    order.items = [
        OrderItem(product_id=product.id, quantity=qty, unit_price=product.price)
        for product, qty in lines
    ]
    db.add(order)
    db.flush()

    db.add(
        Payment(
            order_id=order.id,
            amount=total,
            method=method,
            status="refunded" if status == "cancelled" else "paid",
            paid_at=days_ago(placed),
        )
    )
    return order


def reset():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    print("All tables dropped and recreated.")


def seed():
    if SessionLocal is None:
        raise RuntimeError("DATABASE_URL is not set in .env")

    with SessionLocal() as db:
        if db.scalar(select(User.id).limit(1)) is not None:
            print("Database already has data. Run with --reset to start fresh.")
            return

        password_hash = hash_password(DEMO_PASSWORD)

        # Users
        admin = User(email="admin@supportai.dev", password_hash=password_hash, role="admin")
        agent = User(email="agent@supportai.dev", password_hash=password_hash, role="agent")
        u_aarav = User(email="aarav.sharma@example.com", password_hash=password_hash)
        u_meera = User(email="meera.iyer@example.com", password_hash=password_hash)
        u_rohan = User(email="rohan.das@example.com", password_hash=password_hash)
        db.add_all([admin, agent, u_aarav, u_meera, u_rohan])
        db.flush()  # assigns ids

        # Customers
        aarav = Customer(user_id=u_aarav.id, full_name="Aarav Sharma", phone="+91 90000 00001", city="Kolkata")
        meera = Customer(user_id=u_meera.id, full_name="Meera Iyer", phone="+91 90000 00002", city="Bengaluru")
        rohan = Customer(user_id=u_rohan.id, full_name="Rohan Das", phone="+91 90000 00003", city="Mumbai")
        db.add_all([aarav, meera, rohan])

        # Products
        headphones = Product(name="Wireless Headphones", category="Electronics", price=Decimal("2499.00"),
                             description="Over-ear Bluetooth headphones with 30-hour battery.")
        shoes = Product(name="Running Shoes", category="Footwear", price=Decimal("3999.00"),
                        description="Lightweight running shoes with cushioned sole.")
        watch = Product(name="Smart Watch", category="Electronics", price=Decimal("5499.00"),
                        description="Fitness tracking smart watch with heart-rate sensor.")
        backpack = Product(name="Laptop Backpack", category="Bags", price=Decimal("1799.00"),
                           description="Water-resistant backpack for 15-inch laptops.")
        speaker = Product(name="Bluetooth Speaker", category="Electronics", price=Decimal("2999.00"),
                          description="Portable speaker with deep bass.")
        tshirt = Product(name="Cotton T-Shirt", category="Clothing", price=Decimal("799.00"),
                         description="Soft 100% cotton round-neck t-shirt.")
        bottle = Product(name="Water Bottle", category="Home", price=Decimal("599.00"),
                         description="Insulated steel bottle, 750 ml.")
        lamp = Product(name="Desk Lamp", category="Home", price=Decimal("1299.00"),
                       description="LED desk lamp with adjustable brightness.")
        db.add_all([headphones, shoes, watch, backpack, speaker, tshirt, bottle, lamp])
        db.flush()

        # Orders (dates are relative to today)
        make_order(db, "1024", aarav, [(headphones, 1)], "shipped", placed=4, method="upi",
                   shipped=2, expected_in=2)
        o_shoes = make_order(db, "1019", aarav, [(shoes, 1)], "delivered", placed=9, method="card",
                             shipped=7, delivered=6)
        o_watch = make_order(db, "1015", meera, [(watch, 1)], "processing", placed=1, method="upi")
        make_order(db, "1008", rohan, [(backpack, 1)], "cancelled", placed=12, method="card")
        make_order(db, "1030", meera, [(speaker, 1), (tshirt, 2)], "delivered", placed=26, method="upi",
                   shipped=24, delivered=20)
        make_order(db, "1035", rohan, [(lamp, 1)], "delivered", placed=6, method="cod",
                   shipped=5, delivered=3)

        # One support ticket and one return request
        db.add(SupportTicket(
            customer_id=meera.id,
            order_id=o_watch.id,
            subject="Order still processing",
            description="My smart watch order has been processing for a day. When will it ship?",
            status="open",
            priority="normal",
        ))
        db.add(ReturnRequest(
            order_id=o_shoes.id,
            reason="The size is too small.",
            status="requested",
        ))

        db.commit()
        print("Seed data added: 5 users, 3 customers, 8 products, 6 orders, 1 ticket, 1 return.")
        print(f"Demo login password for every seeded account: {DEMO_PASSWORD}")


if __name__ == "__main__":
    if "--reset" in sys.argv:
        reset()
    seed()