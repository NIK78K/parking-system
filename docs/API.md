# Parking System - API Documentation

## Base URL
```
http://localhost/api
```

## Authentication
Gunakan Bearer Token authentication untuk semua endpoint yang protected.

Header:
```
Authorization: Bearer {token}
Content-Type: application/json
```

---

## 🔐 Authentication Endpoints

### 1. Login
**POST** `/login`

Request Body:
```json
{
  "email": "admin@parking.com",
  "password": "password123"
}
```

Response (200):
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@parking.com",
    "role": "admin"
  },
  "token": "1|abc123..."
}
```

### 2. Logout
**POST** `/logout`

Response (200):
```json
{
  "message": "Logout successful"
}
```

### 3. Get Current User
**GET** `/user`

Response (200):
```json
{
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@parking.com",
    "role": "admin"
  }
}
```

---

## 🚗 Parking Operations

### 1. Check-In (Kendaraan Masuk)
**POST** `/parking/check-in`

Request Body:
```json
{
  "license_plate": "B1234XYZ",
  "vehicle_type": "car"
}
```

Response (201):
```json
{
  "message": "Check-in successful",
  "transaction": {
    "id": 1,
    "ticket_number": "PRK20251206001",
    "license_plate": "B1234XYZ",
    "vehicle_type": "car",
    "qr_code": "abc123def456...",
    "entry_time": "2025-12-06 14:30:00"
  }
}
```

### 2. Scan QR Code
**GET** `/parking/scan/{qrCode}`

Response (200):
```json
{
  "transaction": {
    "id": 1,
    "ticket_number": "PRK20251206001",
    "license_plate": "B1234XYZ",
    "vehicle_type": "car",
    "entry_time": "2025-12-06 14:30:00",
    "duration_minutes": 125,
    "estimated_fee": 11000,
    "operator_in": "John Operator"
  }
}
```

### 3. Check-Out (Kendaraan Keluar)
**POST** `/parking/check-out/{qrCode}`

Request Body:
```json
{
  "payment_method": "cash",
  "notes": "Pembayaran cash"
}
```

Response (200):
```json
{
  "message": "Check-out successful",
  "transaction": {
    "id": 1,
    "ticket_number": "PRK20251206001",
    "license_plate": "B1234XYZ",
    "vehicle_type": "car",
    "entry_time": "2025-12-06 14:30:00",
    "exit_time": "2025-12-06 16:35:00",
    "duration_minutes": 125,
    "total_fee": 11000,
    "payment_method": "cash"
  }
}
```

### 4. Get Active Vehicles
**GET** `/parking/active`

Response (200):
```json
{
  "total": 5,
  "transactions": [
    {
      "id": 1,
      "ticket_number": "PRK20251206001",
      "license_plate": "B1234XYZ",
      "vehicle_type": "car",
      "entry_time": "2025-12-06 14:30:00",
      "duration_minutes": 45,
      "operator_in": "John Operator"
    }
  ]
}
```

### 5. Get Transaction History
**GET** `/parking/history?status=completed&start_date=2025-12-01&end_date=2025-12-06`

Query Parameters:
- `status` (optional): active, completed, cancelled
- `start_date` (optional): YYYY-MM-DD
- `end_date` (optional): YYYY-MM-DD
- `page` (optional): pagination page number

Response (200):
```json
{
  "current_page": 1,
  "data": [...],
  "total": 50,
  "per_page": 20
}
```

---

## ⚙️ Settings (Admin Only)

### 1. Get All Rates
**GET** `/rates`

Response (200):
```json
{
  "rates": [
    {
      "id": 1,
      "vehicle_type": "car",
      "first_hour_rate": 5000,
      "next_hour_rate": 3000,
      "daily_max_rate": 50000
    },
    {
      "id": 2,
      "vehicle_type": "motorcycle",
      "first_hour_rate": 3000,
      "next_hour_rate": 2000,
      "daily_max_rate": 30000
    }
  ]
}
```

### 2. Update Rate
**PUT** `/rates/{id}`

Request Body:
```json
{
  "first_hour_rate": 6000,
  "next_hour_rate": 4000,
  "daily_max_rate": 60000
}
```

Response (200):
```json
{
  "message": "Parking rate updated successfully",
  "rate": {
    "id": 1,
    "vehicle_type": "car",
    "first_hour_rate": 6000,
    "next_hour_rate": 4000,
    "daily_max_rate": 60000
  }
}
```

---

## 📊 Reports (Admin Only)

### 1. Daily Reports
**GET** `/reports/daily?start_date=2025-12-01&end_date=2025-12-06`

Response (200):
```json
{
  "current_page": 1,
  "data": [
    {
      "id": 1,
      "report_date": "2025-12-06",
      "total_vehicles": 45,
      "total_motorcycle": 30,
      "total_car": 15,
      "total_revenue": 250000
    }
  ]
}
```

### 2. Monthly Reports
**GET** `/reports/monthly?year=2025`

Response (200):
```json
{
  "year": 2025,
  "monthly_reports": [
    {
      "month": 12,
      "total_vehicles": 450,
      "total_motorcycle": 300,
      "total_car": 150,
      "total_revenue": 2500000
    }
  ]
}
```

---

## 📈 Dashboard

### Get Dashboard Stats
**GET** `/dashboard/stats`

Response (200):
```json
{
  "active_vehicles": {
    "total": 8,
    "motorcycle": 5,
    "car": 3
  },
  "today": {
    "revenue": 150000,
    "vehicles": 25
  },
  "monthly_revenue": 2500000
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "message": "Unauthenticated."
}
```

### 403 Forbidden
```json
{
  "message": "Unauthorized. Admin access required."
}
```

### 404 Not Found
```json
{
  "message": "Transaction not found or already completed"
}
```

### 422 Validation Error
```json
{
  "message": "The license plate field is required.",
  "errors": {
    "license_plate": [
      "The license plate field is required."
    ]
  }
}
```

---

## Testing dengan cURL

### Login
```bash
curl -X POST http://localhost/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@parking.com","password":"password123"}'
```

### Check-In
```bash
curl -X POST http://localhost/api/parking/check-in \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"license_plate":"B1234XYZ","vehicle_type":"car"}'
```

### Get Active Vehicles
```bash
curl -X GET http://localhost/api/parking/active \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Default Credentials

**Admin:**
- Email: `admin@parking.com`
- Password: `password123`

**Operator 1:**
- Email: `operator1@parking.com`
- Password: `password123`

**Operator 2:**
- Email: `operator2@parking.com`
- Password: `password123`
