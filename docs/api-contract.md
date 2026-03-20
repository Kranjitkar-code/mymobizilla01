# Mobizilla API Contract

> Supabase client, Edge Functions, and serverless endpoints

---

## 1. Overview

| Layer | Technology | Base URL |
|-------|------------|----------|
| Database | Supabase (PostgreSQL) | `supabase.from('<table>')` |
| Edge Functions | Supabase Edge (Deno) | `supabase.functions.invoke('<name>')` |
| Netlify Functions | Serverless | `/api/*` (deployed) |
| Backend (optional) | PHP/Laravel | `http://localhost:5002/api` (proxy) |

---

## 2. Supabase Client (Direct Table Access)

### 2.1 Tables & Operations

| Table | Operations | Notes |
|-------|------------|-------|
| repair_orders | select, insert, update | Real-time: postgres_changes |
| phone_models | select | Device catalog |
| buyback_models | select | Base prices |
| buyback_quotes | select, insert | public_code for tracking |
| products | select | is_active filter |
| product_images | select | |
| categories | select | |
| orders | insert | |
| order_items | insert | |
| settings | select | Singleton |
| product_reviews | select, insert | |
| discount_codes | select | is_active filter |
| courses | select | |
| enrollments | insert | |
| blog_posts | select | status = 'published' |
| videos | select | |
| contact_messages | insert | |
| website_content | select, upsert | CMS |
| website_settings | select, upsert | |
| editable_content | select, upsert | |
| bookings | insert | Legacy |

---

## 3. Supabase Edge Functions

### 3.1 `send-otp`

**Purpose:** Send OTP via Twilio for repair or buyback verification.

**Method:** `POST` (invoked via `supabase.functions.invoke('send-otp', { body })`)

**Request Body:**

```json
{
  "phone_number": "919876543210",
  "otp": "123456",
  "type": "repair" | "buyback"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| phone_number | string | Yes | E.164 format, min 10 chars |
| otp | string | Yes | 4–6 digit OTP |
| type | string | Yes | `"repair"` or `"buyback"` |

**Success Response (200):**

```json
{
  "success": true,
  "message": "OTP sent successfully via Supabase + Twilio",
  "sid": "SM...",
  "phone": "919876543210"
}
```

**Error Response (400):**

```json
{
  "success": false,
  "error": "Invalid phone number provided",
  "details": {}
}
```

**Error Response (500):**

```json
{
  "success": false,
  "error": "Internal server error",
  "details": "..."
}
```

**Environment Variables:** `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`

---

### 3.2 `send-notifications`

**Purpose:** Send SMS (Twilio) and email (SendGrid) after repair booking confirmation.

**Method:** `POST`

**Request Body (Notifications):**

```json
{
  "to_phone": "919876543210",
  "to_email": "customer@example.com",
  "customer_name": "John Doe",
  "tracking_code": "SNP123456",
  "device_info": "iPhone 14 Pro",
  "estimated_cost": 3500
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| to_phone | string | Yes | Customer phone |
| to_email | string | Yes | Customer email |
| customer_name | string | Yes | Customer name |
| tracking_code | string | Yes | Repair tracking code |
| device_info | string | Yes | Device description |
| estimated_cost | number | Yes | NPR |

**Success Response (200):**

```json
{
  "success": true,
  "results": {
    "sms_sent": true,
    "email_sent": true,
    "sms_details": { "success": true, "sid": "SM...", "message": "SMS sent successfully" },
    "email_details": { "success": true, "message": "Email sent successfully" }
  }
}
```

**Error Response (500):**

```json
{
  "success": false,
  "error": "Error message",
  "results": {
    "sms_sent": false,
    "email_sent": false
  }
}
```

---

**Request Body (OTP fallback):**

If `otp` and `type` are present, the function behaves like `send-otp`:

```json
{
  "phone_number": "919876543210",
  "otp": "123456",
  "type": "repair" | "buyback"
}
```

**Environment Variables:** `TWILIO_*`, `SENDGRID_API_KEY`

---

## 4. Repair API (Client-Side)

### 4.1 `createBooking`

**Interface:** `RepairFormData`

```typescript
interface RepairFormData {
  device_category: string;
  brand: string;
  model: string;
  issue: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  description?: string;
}
```

**Response:**

```typescript
{
  success: boolean;
  tracking_code?: string;      // e.g. "SNP123456"
  error?: string;
  notification_status?: { sms_sent, email_sent, ... };
  message?: string;
}
```

**Flow:**
1. Generate `tracking_code` = `SNP` + 6 digits
2. Insert into `repair_orders`
3. Call `send-notifications` Edge Function
4. Return `{ success: true, tracking_code }`

---

## 5. Netlify Functions

### 5.1 `send-email`

**Path:** `/api/send-email` (or `.netlify/functions/send-email`)

**Purpose:** General email sending.

---

### 5.2 `send-contact-email`

**Path:** `/api/send-contact-email`

**Purpose:** Send email when contact form is submitted.

---

## 6. Backend API (PHP/Laravel – Optional)

**Base URL:** `http://localhost:5002/api` (Vite proxy: `/api` → `localhost:5002`)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/send-otp` | POST | OTP via Twilio (alternative to Edge Function) |

---

## 7. Real-Time Subscriptions

### 7.1 Repair Orders

```typescript
supabase
  .channel('repair_orders')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'repair_orders'
  }, (payload) => { ... })
  .subscribe()
```

### 7.2 Content Updates

```typescript
supabase
  .channel('content')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'website_content'  // or editable_content
  }, (payload) => { ... })
  .subscribe()
```

---

## 8. CORS

Edge Functions use shared CORS headers from `_shared/cors.ts`. `OPTIONS` requests return `200` with CORS headers.

---

## 9. Error Handling

| Scenario | Behavior |
|----------|----------|
| Supabase table not found | Fallback to localStorage for repair tracking |
| Edge Function failure | Booking still created; `notification_status` indicates failure |
| Twilio/SendGrid failure | Partial success possible (SMS or email may fail independently) |
