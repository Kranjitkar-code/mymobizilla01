# Mobizilla Database Schema Design

> PostgreSQL (Supabase) schema for repair, buyback, e-commerce, training, and CMS

---

## 1. Entity Relationship Overview

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                              CORE ENTITIES                                                   │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                             │
│   REPAIR                    BUYBACK                   E-COMMERCE                            │
│   ┌──────────────┐         ┌─────────────────┐       ┌──────────┐    ┌──────────────┐      │
│   │ repair_orders│         │ buyback_models   │       │ categories│───▶│ products     │      │
│   └──────────────┘         └─────────────────┘       └──────────┘    └──────┬───────┘      │
│                                                                              │              │
│   ┌──────────────┐         ┌─────────────────┐                             │              │
│   │ phone_models │         │ buyback_quotes   │                             ▼              │
│   └──────────────┘         └─────────────────┘                    ┌─────────────────┐      │
│                                                                   │ product_images  │      │
│   BOOKINGS (legacy)                                               └─────────────────┘      │
│   ┌──────────────┐                                                         │              │
│   │ bookings     │─────────────────────────────────────────────────────────┼──────────────┤
│   └──────────────┘                                                         │              │
│                                                                   ┌────────▼────────┐      │
│                                                                   │ orders          │      │
│   TRAINING                    CMS                                 │ order_items     │      │
│   ┌──────────────┐         ┌──────────────────┐                   └─────────────────┘      │
│   │ courses      │         │ website_content  │                                             │
│   └──────┬───────┘         │ website_settings │                   ┌─────────────────┐      │
│          │                 │ editable_content │                   │ settings        │      │
│          ▼                 └──────────────────┘                   │ discount_codes  │      │
│   ┌──────────────┐                                                │ product_reviews │      │
│   │ enrollments  │                                                └─────────────────┘      │
│   └──────────────┘                                                                         │
│                                                                                             │
│   CONTENT & CONTACT                                                                         │
│   ┌──────────────┐  ┌──────────────┐  ┌────────────────────┐                              │
│   │ blog_posts   │  │ videos       │  │ contact_messages    │                              │
│   └──────────────┘  └──────────────┘  └────────────────────┘                              │
│                                                                                             │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Table Definitions

### 2.1 Repair

#### `repair_orders`
Primary table for repair bookings.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, default gen_random_uuid() | Primary key |
| device_category | text | NOT NULL | phone, tablet, laptop |
| brand | text | NOT NULL | Device brand |
| model | text | NOT NULL | Device model |
| issue | text | NOT NULL | Issue description |
| customer_name | text | NOT NULL | Customer name |
| customer_email | text | NOT NULL | Customer email |
| customer_phone | text | NOT NULL | Customer phone |
| description | text | | Additional notes |
| status | text | CHECK (pending, in_progress, completed, cancelled) | Order status |
| tracking_code | text | UNIQUE, NOT NULL | SNP{6 digits} |
| estimated_cost | integer | default 0 | NPR |
| created_at | timestamptz | default now() | |
| updated_at | timestamptz | default now() | |

**Indexes:** `tracking_code`, `status`  
**RLS:** Public SELECT, INSERT, UPDATE

---

#### `phone_models`
Device catalog for repair/buyback selection.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | |
| brand | text | NOT NULL | |
| model | text | NOT NULL | |
| image_url | text | | |
| base_price | integer | | |
| created_at | timestamptz | | |
| updated_at | timestamptz | | |

---

#### `bookings` (legacy / alternate)
Service bookings (alternative to repair_orders).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | |
| public_code | text | UNIQUE, default hex(6) | |
| name | text | NOT NULL | |
| email | text | | |
| phone | text | | |
| device_brand | text | | |
| device_model | text | | |
| issue_description | text | | |
| service_id | uuid | FK → services | |
| preferred_date | date | | |
| status | text | default 'pending' | |
| customer_type | text | default 'b2c' | |
| created_at | timestamptz | | |

---

#### `services`
Repair service definitions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | |
| name | text | NOT NULL | |
| slug | text | UNIQUE | |
| description | text | | |
| price_npr | integer | | |
| duration_minutes | int | | |
| created_at | timestamptz | | |

---

### 2.2 Buyback

#### `buyback_models`
Base prices per device for buyback estimation.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | |
| brand | text | NOT NULL | |
| model | text | NOT NULL | |
| base_price_npr | integer | NOT NULL | |
| | | UNIQUE(brand, model) | |

---

#### `buyback_quotes`
Buyback quote submissions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | |
| name | text | NOT NULL | |
| email | text | | |
| phone | text | NOT NULL | |
| brand | text | NOT NULL | |
| model | text | NOT NULL | |
| condition | text | NOT NULL | excellent, good, fair, poor |
| estimated_price_npr | integer | NOT NULL | |
| public_code | text | UNIQUE, default hex(6) | For tracking |
| created_at | timestamptz | | |

---

### 2.3 E-commerce

#### `categories`
Product categories.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | |
| name | text | NOT NULL | |
| slug | text | UNIQUE | |
| created_at | timestamptz | | |

---

#### `products`
E-commerce products.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | |
| category_id | uuid | FK → categories | |
| name | text | NOT NULL | |
| slug | text | UNIQUE | |
| description | text | | |
| price_npr | integer | NOT NULL | |
| discount_percent | integer | default 0 | |
| specs | jsonb | | |
| is_active | boolean | default true | |
| created_at | timestamptz | | |
| updated_at | timestamptz | | |

---

#### `product_images`
Product images.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | |
| product_id | uuid | FK → products | |
| url | text | NOT NULL | |
| alt | text | | |
| sort_order | int | default 0 | |

---

#### `orders`
Customer orders.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | |
| public_code | text | UNIQUE, default hex(6) | |
| name | text | | |
| email | text | | |
| phone | text | | |
| address_line1 | text | | |
| address_line2 | text | | |
| city | text | | |
| postal_code | text | | |
| shipping_method | text | NOT NULL | flat, pickup |
| shipping_fee_npr | integer | default 0 | |
| tax_percent | numeric | default 13 | |
| subtotal_npr | integer | NOT NULL | |
| total_npr | integer | NOT NULL | |
| vat_amount_npr | integer | default 0 | |
| payment_provider | text | | |
| payment_status | text | default 'unpaid' | unpaid, paid, failed |
| status | text | default 'pending' | pending, processing, shipped, completed, cancelled |
| created_at | timestamptz | | |

---

#### `order_items`
Order line items.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | |
| order_id | uuid | FK → orders | |
| product_id | uuid | FK → products | |
| name | text | NOT NULL | |
| unit_price_npr | integer | NOT NULL | |
| quantity | integer | CHECK > 0 | |
| line_total_npr | integer | NOT NULL | |

---

#### `settings` (singleton)
Checkout and payment settings.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | boolean | PK, default true | Singleton row |
| currency_code | text | default 'NPR' | |
| allow_guest_checkout | boolean | default true | |
| shipping_method | text | default 'flat' | flat, pickup |
| flat_rate_npr | integer | default 0 | |
| tax_percent | numeric | default 13 | |
| payment_providers | jsonb | default ["esewa","khalti","connectips","fonepay"] | |
| shipping_zones | jsonb | | Kathmandu Valley/Outside/International |
| updated_at | timestamptz | | |

---

#### `product_reviews`
Product reviews.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | |
| product_id | uuid | FK → products | |
| name | text | NOT NULL | |
| rating | int | CHECK 1–5 | |
| comment | text | | |
| created_at | timestamptz | | |

---

#### `discount_codes`
Discount codes for checkout.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| code | text | PK | |
| description | text | | |
| percent_off | int | CHECK 0–100 | |
| amount_off_npr | integer | | |
| is_active | boolean | default true | |
| starts_at | timestamptz | | |
| ends_at | timestamptz | | |

---

### 2.4 Training

#### `courses`
Training courses.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | |
| title | text | NOT NULL | |
| slug | text | UNIQUE | |
| description | text | | |
| price_npr | integer | | |
| level | text | | |
| created_at | timestamptz | | |

---

#### `enrollments`
Course enrollments.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | |
| course_id | uuid | FK → courses | |
| name | text | NOT NULL | |
| email | text | | |
| phone | text | NOT NULL | |
| created_at | timestamptz | | |

---

### 2.5 CMS & Content

#### `website_content`
CMS content blocks.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | text | PK | |
| title | text | | |
| content | text | | |
| type | text | | text, image, html |
| section | text | | home, services, about, contact, settings, footer |
| created_at | timestamptz | | |
| updated_at | timestamptz | | |

---

#### `website_settings`
Site-level settings.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | text | PK | |
| site_title | text | | |
| contact_phone | text | | |
| contact_email | text | | |
| contact_address | text | | |
| created_at | timestamptz | | |
| updated_at | timestamptz | | |

---

#### `editable_content`
Editable page content (hero, about, etc.).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | text | PK | |
| hero_title | text | | |
| hero_subtitle | text | | |
| contact_phone | text | | |
| contact_email | text | | |
| contact_address | text | | |
| about_us | text | | |
| services_description | text | | |
| created_at | timestamptz | | |
| updated_at | timestamptz | | |

---

#### `blog_posts`
Blog posts.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | |
| title | text | NOT NULL | |
| slug | text | UNIQUE | |
| excerpt | text | | |
| content | text | | |
| cover_image_url | text | | |
| published_at | timestamptz | | |
| status | text | default 'draft' | draft, published |
| created_at | timestamptz | | |

---

#### `videos`
Gallery videos.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | |
| title | text | NOT NULL | |
| youtube_id | text | NOT NULL | |
| description | text | | |
| published_at | timestamptz | | |
| created_at | timestamptz | | |

---

#### `contact_messages`
Contact form submissions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | |
| name | text | NOT NULL | |
| email | text | | |
| message | text | NOT NULL | |
| created_at | timestamptz | | |

---

## 3. Row Level Security (RLS) Summary

| Table | SELECT | INSERT | UPDATE |
|-------|--------|--------|--------|
| repair_orders | public | public | public |
| phone_models | public | admin | admin |
| bookings | — | public | — |
| buyback_models | public | admin | admin |
| buyback_quotes | — | public | — |
| categories | public | admin | admin |
| products | public (is_active) | admin | admin |
| product_images | public | admin | admin |
| orders | — | public | — |
| order_items | — | public | — |
| settings | public | admin | admin |
| product_reviews | public | public | — |
| discount_codes | public (is_active) | admin | admin |
| courses | public | admin | admin |
| enrollments | — | public | — |
| blog_posts | public (status=published) | admin | admin |
| videos | public | admin | admin |
| contact_messages | — | public | — |
| website_content | public | admin | admin |
| website_settings | public | admin | admin |
| editable_content | public | admin | admin |

---

## 4. Migrations Order

1. `20250108000001_create_repair_orders.sql` – repair_orders
2. `20250810082611_*.sql` – categories, products, services, bookings, buyback, courses, blog, videos, contact
3. `20250810090000_site_settings_and_orders.sql` – settings, orders, order_items
4. `20250810093000_reviews_discounts_and_booking_type.sql` – product_reviews, discount_codes, customer_type
5. `20250810094000_buyback_public_code.sql` – buyback_quotes.public_code
6. `20250001000001_mobizilla_nepal_localization.sql` – INR→NPR columns, 13% VAT, Nepal payment providers, shipping zones
