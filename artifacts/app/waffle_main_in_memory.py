# A runnable Python script goes here
from fastapi import FastAPI, HTTPException, Path
from pydantic import BaseModel, EmailStr, constr
from typing import Optional, List

app = FastAPI()

# In-memory "database"
users_db = []
user_roles = [
    {"role_id": 1, "role_name": "admin"},
    {"role_id": 2, "role_name": "user"},
    {"role_id": 3, "role_name": "guest"},
]

# Pydantic models
class UserBase(BaseModel):
    first_name: constr(min_length=1)
    last_name: constr(min_length=1)
    email: EmailStr
    hire_date: constr(min_length=1)
    role_id: int
    bio: Optional[str] = None

class UserCreate(UserBase):
    pass

class UserUpdate(BaseModel):
    first_name: Optional[constr(min_length=1)] = None
    last_name: Optional[constr(min_length=1)] = None
    email: Optional[EmailStr] = None
    hire_date: Optional[constr(min_length=1)] = None
    role_id: Optional[int] = None
    bio: Optional[str] = None

class UserResponse(UserBase):
    user_id: int

# Helper functions
def get_next_user_id():
    if users_db:
        return max(user["user_id"] for user in users_db) + 1
    return 1

def is_valid_role(role_id: int) -> bool:
    return any(role["role_id"] == role_id for role in user_roles)

def get_user_by_email(email: str):
    return next((user for user in users_db if user["email"] == email), None)

def get_user_by_id(user_id: int):
    return next((user for user in users_db if user["user_id"] == user_id), None)

# CRUD Endpoints
@app.post("/users", response_model=UserResponse)
def create_user(user: UserCreate):
    if get_user_by_email(user.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    if not is_valid_role(user.role_id):
        raise HTTPException(status_code=400, detail="Invalid role_id")
    user_id = get_next_user_id()
    new_user = user.dict()
    new_user["user_id"] = user_id
    users_db.append(new_user)
    return new_user

@app.get("/users", response_model=List[UserResponse])
def list_users():
    return users_db

@app.get("/users/{user_id}", response_model=UserResponse)
def retrieve_user(user_id: int = Path(..., gt=0)):
    user = get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.put("/users/{user_id}", response_model=UserResponse)
def update_user(user_id: int, user_update: UserUpdate):
    user = get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user_update.email and (user_update.email != user["email"]):
        if get_user_by_email(user_update.email):
            raise HTTPException(status_code=400, detail="Email already registered")
    
    if user_update.role_id and not is_valid_role(user_update.role_id):
        raise HTTPException(status_code=400, detail="Invalid role_id")
    
    updated_data = user_update.dict(exclude_unset=True)
    for key, value in updated_data.items():
        user[key] = value

    return user

@app.delete("/users/{user_id}")
def delete_user(user_id: int):
    user = get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    users_db.remove(user)
    return {"detail": "User deleted"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)