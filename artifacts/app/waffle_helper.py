```python
# --- Snippet 1: ORM models ---
from sqlalchemy import Integer, String, ForeignKey, CheckConstraint, Index, Text
from sqlalchemy.orm import declarative_base, relationship, Mapped, mapped_column

Base = declarative_base()

class UserRole(Base):
    __tablename__ = 'user_roles'

    # Primary key column
    role_id: Mapped[int] = mapped_column(Integer, primary_key=True)

    # Unique role name
    role_name: Mapped[str] = mapped_column(String, unique=True, nullable=False)

    # Relationship to User
    users: Mapped[list["User"]] = relationship("User", back_populates="role")


class User(Base):
    __tablename__ = 'users'

    # Primary key column
    user_id: Mapped[int] = mapped_column(Integer, primary_key=True)

    # User details
    first_name: Mapped[str] = mapped_column(String, nullable=False)
    last_name: Mapped[str] = mapped_column(String, nullable=False)

    # Unique email address
    email: Mapped[str] = mapped_column(String, unique=True, nullable=False)

    # Hire date
    hire_date: Mapped[str] = mapped_column(String, nullable=False)

    # Foreign key to UserRole
    role_id: Mapped[int] = mapped_column(ForeignKey('user_roles.role_id'), nullable=False)

    # Optional bio
    bio: Mapped[str] = mapped_column(Text, nullable=True)

    # Relationship to UserRole
    role: Mapped["UserRole"] = relationship("UserRole", back_populates="users")

    # Check constraint on email
    __table_args__ = (
        CheckConstraint("email LIKE '%@%'", name='check_email_format'),
        Index('idx_users_role_id', 'role_id')
    )
```

```python
# --- Snippet 2: Engine, session maker, get_db, demo inserts ---
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.ext.asyncio import async_sessionmaker
from sqlalchemy.orm import sessionmaker
from sqlalchemy.future import select
from fastapi import FastAPI, Depends
from contextlib import asynccontextmanager

DATABASE_URL = "sqlite+aiosqlite:///./test.db"

# Create async engine
engine = create_async_engine(DATABASE_URL, echo=True)

# Create a configured "Session" class
async_session = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

@asynccontextmanager
async def get_db():
    # Dependency for acquiring and releasing a database session
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.close()

app = FastAPI()

@app.post("/add_user/")
async def add_user(first_name: str, last_name: str, email: str, role_id: int, hire_date: str, db: AsyncSession = Depends(get_db)):
    # Create a new user instance
    new_user = User(first_name=first_name, last_name=last_name, email=email, hire_date=hire_date, role_id=role_id)
    # Add the user to the session
    db.add(new_user)
    # Commit the transaction
    await db.commit()
    return {"message": "User added successfully"}

@app.post("/add_users/")
async def add_users(users: list[dict], db: AsyncSession = Depends(get_db)):
    # Create multiple user instances from the list of user data
    new_users = [User(**user_data) for user_data in users]
    # Add the users to the session
    db.add_all(new_users)
    # Commit the transaction
    await db.commit()
    return {"message": "Users added successfully"}
```
