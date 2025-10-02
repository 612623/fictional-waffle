"""
Waffle Tech Suite API

A FastAPI application for managing users and user roles with full CRUD operations.
Provides REST API endpoints for user management with role-based categorization.
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from sqlalchemy import Column, Integer, String, ForeignKey, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session, relationship
from typing import Optional
import os
import uvicorn

# Add CORS
from fastapi.middleware.cors import CORSMiddleware


# ============================================================================
# SQLAlchemy Database Models
# ============================================================================

Base = declarative_base()

class UserRole(Base):
    """
    SQLAlchemy model for user roles table.
    
    Attributes:
        role_id (int): Primary key, auto-incremented role identifier
        role_name (str): Unique name of the role (e.g., 'Admin', 'Developer')
        users (relationship): One-to-many relationship with User model
    """
    __tablename__ = 'user_roles'
    
    role_id = Column(Integer, primary_key=True, autoincrement=True)
    role_name = Column(String(100), unique=True, nullable=False)
    
    # Relationship: one role can have many users
    users = relationship("User", back_populates="role")

class User(Base):
    """
    SQLAlchemy model for users table.
    
    Attributes:
        user_id (int): Primary key, auto-incremented user identifier
        first_name (str): User's first name
        last_name (str): User's last name
        email (str): Unique email address for the user
        hire_date (str): Date when the user was hired (stored as text in YYYY-MM-DD format)
        role_id (int): Foreign key reference to user_roles table
        bio (str): Optional biography/description of the user
        role (relationship): Many-to-one relationship with UserRole model
    """
    __tablename__ = 'users'
    
    user_id = Column(Integer, primary_key=True, autoincrement=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    hire_date = Column(String(50), nullable=False)
    role_id = Column(Integer, ForeignKey('user_roles.role_id'), nullable=False)
    bio = Column(String(500), nullable=True)
    
    # Relationship: each user belongs to one role
    role = relationship("UserRole", back_populates="users")

# ============================================================================
# Pydantic Models for Request/Response Validation
# ============================================================================

class RoleBase(BaseModel):
    """
    Base Pydantic model for role data.
    
    Attributes:
        role_name (str): Name of the role, minimum 2 characters
    """
    role_name: str = Field(..., min_length=2)

class RoleCreate(RoleBase):
    """
    Pydantic model for creating a new role.
    Inherits all fields from RoleBase.
    """
    pass

class RoleResponse(RoleBase):
    """
    Pydantic model for role response data.
    
    Attributes:
        role_id (int): Unique identifier for the role
        role_name (str): Inherited from RoleBase
    """
    role_id: int
    
    model_config = ConfigDict(from_attributes=True)

class UserBase(BaseModel):
    """
    Base Pydantic model for user data.
    
    Attributes:
        first_name (str): User's first name, minimum 2 characters
        last_name (str): User's last name, minimum 2 characters
        email (EmailStr): Valid email address, minimum 6 characters
        hire_date (str): Date when the user was hired (YYYY-MM-DD format)
        role_id (int): Foreign key reference to a role
        bio (str): Optional biography/description of the user
    """
    first_name: str = Field(..., min_length=2)
    last_name: str = Field(..., min_length=2)
    email: EmailStr = Field(..., min_length=6)
    hire_date: str = Field(..., pattern=r'^\d{4}-\d{2}-\d{2}$')
    role_id: int
    bio: Optional[str] = Field(None, max_length=500)

class UserCreate(UserBase):
    """
    Pydantic model for creating a new user.
    Inherits all fields from UserBase.
    """
    pass

class UserUpdate(BaseModel):
    """
    Pydantic model for partial user updates (PATCH requests).
    All fields are optional to allow partial updates.
    
    Attributes:
        first_name (Optional[str]): Updated first name
        last_name (Optional[str]): Updated last name
        email (Optional[EmailStr]): Updated email address
        hire_date (Optional[str]): Updated hire date (YYYY-MM-DD format)
        role_id (Optional[int]): Updated role assignment
        bio (Optional[str]): Updated biography/description
    """
    first_name: Optional[str] = Field(None, min_length=2)
    last_name: Optional[str] = Field(None, min_length=2)
    email: Optional[EmailStr] = Field(None, min_length=6)
    hire_date: Optional[str] = Field(None, pattern=r'^\d{4}-\d{2}-\d{2}$')
    role_id: Optional[int] = None
    bio: Optional[str] = Field(None, max_length=500)

class UserResponse(UserBase):
    """
    Pydantic model for user response data.
    
    Attributes:
        user_id (int): Unique identifier for the user
        All other fields inherited from UserBase
    """
    user_id: int
    
    model_config = ConfigDict(from_attributes=True)

# ============================================================================
# Database Configuration
# ============================================================================

# Database connection string for SQLite
# Points to existing database in parent artifacts directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, '..', 'waffle_tech_suite.db')}"

# Create SQLAlchemy engine
engine = create_engine(DATABASE_URL)

# Create session factory for database connections
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create all tables in the database (only creates if they don't exist)
Base.metadata.create_all(bind=engine)

def get_db():
    """
    Database session dependency for FastAPI endpoints.
    
    Yields:
        Session: SQLAlchemy database session
        
    Note:
        Automatically closes the session after the request is complete.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ============================================================================
# FastAPI Application Setup
# ============================================================================

# Initialize FastAPI application
app = FastAPI(title="Waffle API", version="1.0.0")

# Configure CORS origins (frontend URLs allowed to access the API)
origins = [
    "http://localhost:8080", 
    "http://127.0.0.1:8080",
    "http://localhost:8900", 
    "http://127.0.0.1:8900",
    "http://localhost:3000", 
    "http://127.0.0.1:3000"
]

# Add CORS middleware to allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# Role Management Endpoints
# ============================================================================

@app.post("/roles/", response_model=RoleResponse)
def create_role(role_data: RoleCreate, db: Session = Depends(get_db)):
    """
    Create a new user role.
    
    Args:
        role_data (RoleCreate): Role information including role_name
        db (Session): Database session dependency
        
    Returns:
        RoleResponse: Created role with role_id
        
    Raises:
        HTTPException: 400 if role name already exists
    """
    # Check if role name already exists
    existing_role = db.query(UserRole).filter(UserRole.role_name == role_data.role_name).first()
    if existing_role:
        raise HTTPException(status_code=400, detail="Role with this name already exists")
    
    # Create new role instance
    new_role = UserRole(role_name=role_data.role_name)
    db.add(new_role)
    db.commit()
    db.refresh(new_role)
    return new_role

@app.get("/roles/", response_model=list[RoleResponse])
def list_roles(db: Session = Depends(get_db)):
    """
    Retrieve all user roles.
    
    Args:
        db (Session): Database session dependency
        
    Returns:
        list[RoleResponse]: List of all roles in the database
    """
    roles = db.query(UserRole).all()
    return roles

@app.get("/roles/{role_id}", response_model=RoleResponse)
def get_role(role_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a specific role by ID.
    
    Args:
        role_id (int): Unique identifier for the role
        db (Session): Database session dependency
        
    Returns:
        RoleResponse: Role information
        
    Raises:
        HTTPException: 404 if role not found
    """
    role = db.query(UserRole).filter(UserRole.role_id == role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    return role

# ============================================================================
# User Management Endpoints
# ============================================================================

@app.post("/users/", response_model=UserResponse)
def create_user(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Create a new user.
    
    Args:
        user_data (UserCreate): User information including email, name, hire_date, and role_id
        db (Session): Database session dependency
        
    Returns:
        UserResponse: Created user with user_id
        
    Raises:
        HTTPException: 400 if email already exists or role_id is invalid
    """
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exists")
    
    # Validate that the role exists
    role = db.query(UserRole).filter(UserRole.role_id == user_data.role_id).first()
    if not role:
        raise HTTPException(status_code=400, detail="Invalid role_id")
    
    # Create new user instance
    new_user = User(
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        email=user_data.email,
        hire_date=user_data.hire_date,
        role_id=user_data.role_id,
        bio=user_data.bio
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.get("/users/", response_model=list[UserResponse])
def list_users(db: Session = Depends(get_db)):
    """
    Retrieve all users.
    
    Args:
        db (Session): Database session dependency
        
    Returns:
        list[UserResponse]: List of all users in the database
    """
    users = db.query(User).all()
    return users

@app.get("/users/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a specific user by ID.
    
    Args:
        user_id (int): Unique identifier for the user
        db (Session): Database session dependency
        
    Returns:
        UserResponse: User information
        
    Raises:
        HTTPException: 404 if user not found
    """
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.put("/users/{user_id}", response_model=UserResponse)
def update_user(user_id: int, user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Update all fields of an existing user (full update).
    
    Args:
        user_id (int): Unique identifier for the user to update
        user_data (UserCreate): Complete user information for update
        db (Session): Database session dependency
        
    Returns:
        UserResponse: Updated user information
        
    Raises:
        HTTPException: 404 if user not found
        HTTPException: 400 if email already exists or role_id is invalid
    """
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if email is being changed to one that already exists
    if user_data.email != user.email:
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already exists")
    
    # Validate that the role exists
    role = db.query(UserRole).filter(UserRole.role_id == user_data.role_id).first()
    if not role:
        raise HTTPException(status_code=400, detail="Invalid role_id")
    
    # Update all user fields
    user.first_name = user_data.first_name
    user.last_name = user_data.last_name
    user.email = user_data.email
    user.hire_date = user_data.hire_date
    user.role_id = user_data.role_id
    user.bio = user_data.bio
    
    db.commit()
    db.refresh(user)
    return user

@app.patch("/users/{user_id}", response_model=UserResponse)
def partial_update_user(user_id: int, user_data: UserUpdate, db: Session = Depends(get_db)):
    """
    Partially update a user (only provided fields are updated).
    
    Args:
        user_id (int): Unique identifier for the user to update
        user_data (UserUpdate): Partial user information for update
        db (Session): Database session dependency
        
    Returns:
        UserResponse: Updated user information
        
    Raises:
        HTTPException: 404 if user not found
        HTTPException: 400 if email already exists or role_id is invalid
    """
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if email is being changed to one that already exists
    if user_data.email and user_data.email != user.email:
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already exists")
    
    # Validate role exists if being updated
    if user_data.role_id is not None:
        role = db.query(UserRole).filter(UserRole.role_id == user_data.role_id).first()
        if not role:
            raise HTTPException(status_code=400, detail="Invalid role_id")
    
    # Update only provided fields
    update_data = user_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(user, key, value)
    
    db.commit()
    db.refresh(user)
    return user

@app.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    """
    Delete a user by ID.
    
    Args:
        user_id (int): Unique identifier for the user to delete
        db (Session): Database session dependency
        
    Returns:
        dict: Success message confirming deletion
        
    Raises:
        HTTPException: 404 if user not found
    """
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(user)
    db.commit()
    return {"detail": "User deleted successfully"}

# ============================================================================
# Application Entry Point
# ============================================================================

if __name__ == "__main__":
    # Run the application with uvicorn server
    uvicorn.run(app, host="127.0.0.1", port=8000)