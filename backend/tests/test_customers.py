import uuid
import pytest
from app.models.customer import Customer, CustomerStatus


def test_list_customers_unauthenticated(client):
    response = client.get("/api/v1/customers")
    assert response.status_code == 401
    assert response.json()["error"]["code"] == "UNAUTHORIZED"


def test_list_customers_authenticated(client, auth_headers, sample_customer):
    response = client.get("/api/v1/customers", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert data["total"] >= 1
    assert data["page"] == 1
    assert "metrics" in data
    assert data["metrics"]["total_customers"] >= 1


def test_search_customers(client, auth_headers, db):
    c1 = Customer(
        name="John Alpha",
        email="alpha@acme.com",
        phone="+15551112222",
        company="Acme Corp",
        status=CustomerStatus.ACTIVE
    )
    c2 = Customer(
        name="Bob Beta",
        email="beta@zeta.com",
        phone="+15553334444",
        company="Zeta Labs",
        status=CustomerStatus.LEAD
    )
    db.add_all([c1, c2])
    db.commit()

    # Search by name
    res = client.get("/api/v1/customers?search=Alpha", headers=auth_headers)
    assert res.status_code == 200
    items = res.json()["items"]
    assert any(c["name"] == "John Alpha" for c in items)
    assert not any(c["name"] == "Bob Beta" for c in items)

    # Search by company
    res = client.get("/api/v1/customers?search=Zeta", headers=auth_headers)
    assert res.status_code == 200
    items = res.json()["items"]
    assert any(c["company"] == "Zeta Labs" for c in items)
    assert not any(c["company"] == "Acme Corp" for c in items)


def test_filter_customers_by_status(client, auth_headers, db):
    c_lead = Customer(
        name="Lead Person",
        email="lead@test.com",
        phone="+15559998888",
        company="Lead Inc",
        status=CustomerStatus.LEAD
    )
    db.add(c_lead)
    db.commit()

    res = client.get("/api/v1/customers?status=lead", headers=auth_headers)
    assert res.status_code == 200
    items = res.json()["items"]
    assert all(c["status"] == "lead" for c in items)


def test_get_customer_by_id(client, auth_headers, sample_customer):
    res = client.get(f"/api/v1/customers/{sample_customer.id}", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["id"] == str(sample_customer.id)
    assert data["name"] == sample_customer.name
    assert data["email"] == sample_customer.email


def test_get_customer_not_found(client, auth_headers):
    random_id = uuid.uuid4()
    res = client.get(f"/api/v1/customers/{random_id}", headers=auth_headers)
    assert res.status_code == 404
    assert res.json()["error"]["code"] == "CUSTOMER_NOT_FOUND"


def test_get_customer_invalid_uuid(client, auth_headers):
    res = client.get("/api/v1/customers/not-a-valid-uuid", headers=auth_headers)
    assert res.status_code == 400
    assert res.json()["error"]["code"] == "INVALID_UUID"


def test_create_customer_success(client, auth_headers):
    payload = {
        "name": "Marcus Vance",
        "email": "marcus.vance@vanguard.io",
        "phone": "+1 (555) 342-9811",
        "company": "Vanguard Logistics",
        "status": "active"
    }
    res = client.post("/api/v1/customers", json=payload, headers=auth_headers)
    assert res.status_code == 201
    data = res.json()
    assert data["name"] == "Marcus Vance"
    assert data["email"] == "marcus.vance@vanguard.io"
    assert "id" in data


def test_create_customer_duplicate_email(client, auth_headers, sample_customer):
    payload = {
        "name": "Duplicate Person",
        "email": sample_customer.email,
        "phone": "+1 (555) 999-0000",
        "company": "Duplicate Corp",
        "status": "lead"
    }
    res = client.post("/api/v1/customers", json=payload, headers=auth_headers)
    assert res.status_code == 409
    assert res.json()["error"]["code"] == "DUPLICATE_EMAIL"


def test_create_customer_validation_error(client, auth_headers):
    payload = {
        "name": "A",  # Min length 2
        "email": "not-an-email",
        "phone": "12",  # Too short
        "company": "",  # Empty
        "status": "invalid_status"
    }
    res = client.post("/api/v1/customers", json=payload, headers=auth_headers)
    assert res.status_code == 422
    assert res.json()["error"]["code"] == "VALIDATION_ERROR"


def test_update_customer_success(client, auth_headers, sample_customer):
    payload = {
        "name": "Elena Rostova-Updated",
        "status": "inactive"
    }
    res = client.patch(f"/api/v1/customers/{sample_customer.id}", json=payload, headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["name"] == "Elena Rostova-Updated"
    assert data["status"] == "inactive"


def test_delete_customer_success(client, auth_headers, sample_customer):
    res = client.delete(f"/api/v1/customers/{sample_customer.id}", headers=auth_headers)
    assert res.status_code == 204

    # Verify customer is deleted
    get_res = client.get(f"/api/v1/customers/{sample_customer.id}", headers=auth_headers)
    assert get_res.status_code == 404


def test_filter_customers_invalid_status(client, auth_headers):
    res = client.get("/api/v1/customers?status=not_a_real_status", headers=auth_headers)
    assert res.status_code == 400
    data = res.json()
    assert data["error"]["code"] == "INVALID_STATUS"


def test_filter_customers_multi_status(client, auth_headers, db):
    c_lead = Customer(
        name="Multi Lead",
        email="multilead@test.com",
        phone="+15550001111",
        company="Multi Lead Corp",
        status=CustomerStatus.LEAD
    )
    c_inactive = Customer(
        name="Multi Inactive",
        email="multiinactive@test.com",
        phone="+15550002222",
        company="Multi Inactive Corp",
        status=CustomerStatus.INACTIVE
    )
    db.add_all([c_lead, c_inactive])
    db.commit()

    res = client.get("/api/v1/customers?status=lead,inactive", headers=auth_headers)
    assert res.status_code == 200
    items = res.json()["items"]
    statuses = {c["status"] for c in items}
    assert "lead" in statuses or "inactive" in statuses
    assert all(c["status"] in ("lead", "inactive") for c in items)



# ---------------------------------------------------------------------------
# RBAC Tests
# ---------------------------------------------------------------------------

def test_viewer_can_list_customers(client, viewer_headers, sample_customer):
    """VIEWERs can read the customer list."""
    res = client.get("/api/v1/customers", headers=viewer_headers)
    assert res.status_code == 200


def test_viewer_can_get_customer(client, viewer_headers, sample_customer):
    """VIEWERs can fetch a single customer."""
    res = client.get(f"/api/v1/customers/{sample_customer.id}", headers=viewer_headers)
    assert res.status_code == 200


def test_viewer_cannot_create_customer(client, viewer_headers):
    """VIEWERs are forbidden from creating customers."""
    payload = {
        "name": "Blocked User",
        "email": "blocked@test.com",
        "phone": "+15551234567",
        "company": "Blocked Corp",
        "status": "active",
    }
    res = client.post("/api/v1/customers", json=payload, headers=viewer_headers)
    assert res.status_code == 403
    assert res.json()["error"]["code"] == "FORBIDDEN"


def test_viewer_cannot_update_customer(client, viewer_headers, sample_customer):
    """VIEWERs are forbidden from updating customers."""
    res = client.patch(
        f"/api/v1/customers/{sample_customer.id}",
        json={"status": "inactive"},
        headers=viewer_headers,
    )
    assert res.status_code == 403
    assert res.json()["error"]["code"] == "FORBIDDEN"


def test_viewer_cannot_delete_customer(client, viewer_headers, sample_customer):
    """VIEWERs are forbidden from deleting customers."""
    res = client.delete(f"/api/v1/customers/{sample_customer.id}", headers=viewer_headers)
    assert res.status_code == 403
    assert res.json()["error"]["code"] == "FORBIDDEN"


def test_manager_can_create_customer(client, manager_headers):
    """MANAGERs can create customers."""
    payload = {
        "name": "Manager Created",
        "email": "mgr.created@test.com",
        "phone": "+15559876543",
        "company": "Manager Corp",
        "status": "lead",
    }
    res = client.post("/api/v1/customers", json=payload, headers=manager_headers)
    assert res.status_code == 201


def test_manager_can_update_customer(client, manager_headers, sample_customer):
    """MANAGERs can update customers."""
    res = client.patch(
        f"/api/v1/customers/{sample_customer.id}",
        json={"status": "inactive"},
        headers=manager_headers,
    )
    assert res.status_code == 200
    assert res.json()["status"] == "inactive"


def test_manager_cannot_delete_customer(client, manager_headers, sample_customer):
    """MANAGERs are forbidden from deleting customers."""
    res = client.delete(f"/api/v1/customers/{sample_customer.id}", headers=manager_headers)
    assert res.status_code == 403
    assert res.json()["error"]["code"] == "FORBIDDEN"


def test_admin_can_delete_customer(client, auth_headers, sample_customer):
    """ADMINs can delete customers."""
    res = client.delete(f"/api/v1/customers/{sample_customer.id}", headers=auth_headers)
    assert res.status_code == 204
