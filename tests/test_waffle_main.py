import pytest
import sys
import os
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool

# Add the artifacts directory to the Python path so we can import the app module
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app.waffle_main import app, Base, UserRole, User, TaskPerRole, get_db

# Configure test database with proper settings for in-memory SQLite
TEST_DATABASE_URL = "sqlite:///:memory:"
test_engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,  # Use StaticPool to maintain connection
)

# Create session factory
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

# Create tables once when the module loads
Base.metadata.create_all(bind=test_engine)


@pytest.fixture(scope="function")
def db_session():
    """Create a new database session for each test."""
    connection = test_engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)
    
    yield session
    
    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture(scope="function")
def client(db_session):
    """Test client with database dependency override."""
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    
    with TestClient(app) as test_client:
        yield test_client
    
    app.dependency_overrides.clear()


# ============================================================================
# Role Tests
# ============================================================================

def test_create_role_success(client):
    """Test successful role creation."""
    payload = {"role_name": "Developer"}
    resp = client.post("/roles/", json=payload)
    assert resp.status_code == 200, f"Expected 200 OK, got {resp.status_code}"
    data = resp.json()
    assert data["role_name"] == "Developer", "Role name mismatch"
    assert "role_id" in data, "Response should include role_id"


def test_create_role_duplicate(client):
    """Test that duplicate role names are rejected."""
    payload = {"role_name": "Developer"}
    # Create first role
    resp1 = client.post("/roles/", json=payload)
    assert resp1.status_code == 200
    
    # Try to create duplicate
    resp2 = client.post("/roles/", json=payload)
    assert resp2.status_code == 400, "Expected 400 Bad Request for duplicate"
    assert "already exists" in resp2.text


def test_create_role_validation_error(client):
    """Test role creation validation error."""
    payload = {"role_name": "A"}  # Too short
    resp = client.post("/roles/", json=payload)
    assert resp.status_code == 422, "Expected 422 Unprocessable Entity"
    assert "at least 2 characters" in resp.text.lower()


def test_get_roles(client):
    """Test retrieving all roles."""
    # Create a few roles first
    client.post("/roles/", json={"role_name": "Developer"})
    client.post("/roles/", json={"role_name": "Manager"})
    
    # Get all roles
    resp = client.get("/roles/")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 2, "Should have 2 roles"
    role_names = [role["role_name"] for role in data]
    assert "Developer" in role_names
    assert "Manager" in role_names


def test_get_role_by_id(client):
    """Test retrieving a specific role by ID."""
    # Create a role
    create_resp = client.post("/roles/", json={"role_name": "Tester"})
    role_id = create_resp.json()["role_id"]
    
    # Get the role by ID
    resp = client.get(f"/roles/{role_id}")
    assert resp.status_code == 200
    data = resp.json()
    assert data["role_name"] == "Tester"
    assert data["role_id"] == role_id


def test_get_role_not_found(client):
    """Test getting a non-existent role returns 404."""
    resp = client.get("/roles/99999")
    assert resp.status_code == 404
    assert "not found" in resp.text.lower()


# ============================================================================
# User Tests
# ============================================================================

def test_create_user_success(client):
    """Test successful user creation."""
    # First create a role
    role_resp = client.post("/roles/", json={"role_name": "Tester"})
    assert role_resp.status_code == 200
    role_data = role_resp.json()
    
    # Then create a user
    payload = {
        "first_name": "Test",
        "last_name": "User",
        "email": "test@example.com",
        "hire_date": "2025-01-01",
        "role_id": role_data["role_id"],
        "bio": "Test user bio"
    }
    resp = client.post("/users/", json=payload)
    assert resp.status_code == 200, f"Expected 200 OK, got {resp.status_code}"
    data = resp.json()
    assert data["email"] == "test@example.com", "Email mismatch"
    assert data["first_name"] == "Test"
    assert "user_id" in data, "Response should include user_id"


def test_create_user_without_bio(client):
    """Test creating user without optional bio field."""
    # Create a role
    role_resp = client.post("/roles/", json={"role_name": "Developer"})
    role_id = role_resp.json()["role_id"]
    
    # Create user without bio
    payload = {
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@example.com",
        "hire_date": "2025-02-01",
        "role_id": role_id
    }
    resp = client.post("/users/", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["bio"] is None


def test_create_user_duplicate_email(client):
    """Test that duplicate emails are rejected."""
    # Create a role
    role_resp = client.post("/roles/", json={"role_name": "Developer"})
    role_id = role_resp.json()["role_id"]
    
    # Create first user
    payload = {
        "first_name": "User",
        "last_name": "One",
        "email": "duplicate@example.com",
        "hire_date": "2025-01-01",
        "role_id": role_id
    }
    resp1 = client.post("/users/", json=payload)
    assert resp1.status_code == 200
    
    # Try to create duplicate
    payload["first_name"] = "User"
    payload["last_name"] = "Two"
    resp2 = client.post("/users/", json=payload)
    assert resp2.status_code == 400
    assert "already exists" in resp2.text.lower()


def test_create_user_invalid_role_id(client):
    """Test user creation with invalid role_id."""
    payload = {
        "first_name": "Test",
        "last_name": "User",
        "email": "test@example.com",
        "hire_date": "2025-01-01",
        "role_id": 999  # Non-existent role
    }
    resp = client.post("/users/", json=payload)
    assert resp.status_code == 400, "Expected 400 Bad Request"
    assert "Invalid role_id" in resp.text


def test_create_user_invalid_date_format(client):
    """Test user creation with invalid date format."""
    # Create a role
    role_resp = client.post("/roles/", json={"role_name": "Developer"})
    role_id = role_resp.json()["role_id"]
    
    payload = {
        "first_name": "Test",
        "last_name": "User",
        "email": "test@example.com",
        "hire_date": "01/01/2025",  # Wrong format
        "role_id": role_id
    }
    resp = client.post("/users/", json=payload)
    assert resp.status_code == 422


def test_get_all_users(client):
    """Test retrieving all users."""
    # Create role and users
    role_resp = client.post("/roles/", json={"role_name": "Developer"})
    role_id = role_resp.json()["role_id"]
    
    client.post("/users/", json={
        "first_name": "User",
        "last_name": "One",
        "email": "user1@example.com",
        "hire_date": "2025-01-01",
        "role_id": role_id
    })
    
    client.post("/users/", json={
        "first_name": "User",
        "last_name": "Two",
        "email": "user2@example.com",
        "hire_date": "2025-01-02",
        "role_id": role_id
    })
    
    # Get all users
    resp = client.get("/users/")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 2


def test_update_user_put(client):
    """Test full update of user with PUT."""
    # Create role and user
    role_resp = client.post("/roles/", json={"role_name": "Developer"})
    role_id = role_resp.json()["role_id"]
    
    user_resp = client.post("/users/", json={
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@example.com",
        "hire_date": "2025-01-01",
        "role_id": role_id,
        "bio": "Original bio"
    })
    user_id = user_resp.json()["user_id"]
    
    # Update user
    update_payload = {
        "first_name": "Jane",
        "last_name": "Doe",
        "email": "jane@example.com",
        "hire_date": "2025-01-15",
        "role_id": role_id,
        "bio": "Updated bio"
    }
    resp = client.put(f"/users/{user_id}", json=update_payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["first_name"] == "Jane"
    assert data["email"] == "jane@example.com"
    assert data["bio"] == "Updated bio"


def test_update_user_patch(client):
    """Test partial update of user with PATCH."""
    # Create role and user
    role_resp = client.post("/roles/", json={"role_name": "Developer"})
    role_id = role_resp.json()["role_id"]
    
    user_resp = client.post("/users/", json={
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@example.com",
        "hire_date": "2025-01-01",
        "role_id": role_id
    })
    user_id = user_resp.json()["user_id"]
    
    # Partial update
    resp = client.patch(f"/users/{user_id}", json={"first_name": "Jonathan"})
    assert resp.status_code == 200
    data = resp.json()
    assert data["first_name"] == "Jonathan"
    assert data["last_name"] == "Doe"  # Unchanged


def test_delete_user(client):
    """Test deleting a user."""
    # Create role and user
    role_resp = client.post("/roles/", json={"role_name": "Developer"})
    role_id = role_resp.json()["role_id"]
    
    user_resp = client.post("/users/", json={
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@example.com",
        "hire_date": "2025-01-01",
        "role_id": role_id
    })
    user_id = user_resp.json()["user_id"]
    
    # Delete user
    resp = client.delete(f"/users/{user_id}")
    assert resp.status_code == 200
    assert "deleted successfully" in resp.text.lower()
    
    # Verify user is deleted
    get_resp = client.get(f"/users/{user_id}")
    assert get_resp.status_code == 404


# ============================================================================
# Task Tests
# ============================================================================

def test_create_task_success(client):
    """Test successful task creation."""
    # First create a role
    role_resp = client.post("/roles/", json={"role_name": "Developer"})
    assert role_resp.status_code == 200
    role_data = role_resp.json()
    
    # Then create a task
    payload = {
        "role_id": role_data["role_id"],
        "task_description": "Implement API endpoints",
        "completion_timeline": "2025-12-31"
    }
    resp = client.post("/tasks/", json=payload)
    assert resp.status_code == 200, f"Expected 200 OK, got {resp.status_code}"
    data = resp.json()
    assert data["task_description"] == "Implement API endpoints"
    assert "task_id" in data


def test_create_task_invalid_role_id(client):
    """Test task creation with invalid role_id."""
    payload = {
        "role_id": 999,  # Non-existent role
        "task_description": "Valid task description",
        "completion_timeline": "2025-12-31"
    }
    resp = client.post("/tasks/", json=payload)
    assert resp.status_code == 400, "Expected 400 Bad Request"
    assert "Invalid role_id" in resp.text


def test_create_task_description_too_short(client):
    """Test task creation with description too short."""
    # Create a role
    role_resp = client.post("/roles/", json={"role_name": "Developer"})
    role_id = role_resp.json()["role_id"]
    
    payload = {
        "role_id": role_id,
        "task_description": "Hi",  # Too short (< 5 chars)
        "completion_timeline": "2025-12-31"
    }
    resp = client.post("/tasks/", json=payload)
    assert resp.status_code == 422


def test_get_tasks_by_role(client):
    """Test retrieving all tasks for a specific role."""
    # Create roles
    role1_resp = client.post("/roles/", json={"role_name": "Developer"})
    role1_id = role1_resp.json()["role_id"]
    
    role2_resp = client.post("/roles/", json={"role_name": "Manager"})
    role2_id = role2_resp.json()["role_id"]
    
    # Create tasks for role 1
    client.post("/tasks/", json={
        "role_id": role1_id,
        "task_description": "Task 1 for Developer",
        "completion_timeline": "2025-12-31"
    })
    
    client.post("/tasks/", json={
        "role_id": role1_id,
        "task_description": "Task 2 for Developer",
        "completion_timeline": "2025-12-31"
    })
    
    # Create task for role 2
    client.post("/tasks/", json={
        "role_id": role2_id,
        "task_description": "Task for Manager",
        "completion_timeline": "2025-12-31"
    })
    
    # Get tasks for role 1
    resp = client.get(f"/tasks/role/{role1_id}")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 2
    
    # Get tasks for role 2
    resp2 = client.get(f"/tasks/role/{role2_id}")
    data2 = resp2.json()
    assert len(data2) == 1


def test_update_task_patch(client):
    """Test partial update of task."""
    # Create role and task
    role_resp = client.post("/roles/", json={"role_name": "Developer"})
    role_id = role_resp.json()["role_id"]
    
    task_resp = client.post("/tasks/", json={
        "role_id": role_id,
        "task_description": "Original task",
        "completion_timeline": "2025-12-31"
    })
    task_id = task_resp.json()["task_id"]
    
    # Partial update
    resp = client.patch(f"/tasks/{task_id}", json={
        "task_description": "Updated task description"
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data["task_description"] == "Updated task description"
    assert data["completion_timeline"] == "2025-12-31"  # Unchanged


def test_delete_task(client):
    """Test deleting a task."""
    # Create role and task
    role_resp = client.post("/roles/", json={"role_name": "Developer"})
    role_id = role_resp.json()["role_id"]
    
    task_resp = client.post("/tasks/", json={
        "role_id": role_id,
        "task_description": "Task to delete",
        "completion_timeline": "2025-12-31"
    })
    task_id = task_resp.json()["task_id"]
    
    # Delete task
    resp = client.delete(f"/tasks/{task_id}")
    assert resp.status_code == 200
    
    # Verify task is deleted
    get_resp = client.get(f"/tasks/{task_id}")
    assert get_resp.status_code == 404


if __name__ == "__main__":
    pytest.main([__file__, "-v"])