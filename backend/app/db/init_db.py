from app.db.base import Base
from app.db.session import engine
import app.models  # noqa: F401  (importing registers every table)


def create_tables():
    if engine is None:
        raise RuntimeError("DATABASE_URL is not set in .env")
    Base.metadata.create_all(bind=engine)
    print("Tables created.")


if __name__ == "__main__":
    create_tables()