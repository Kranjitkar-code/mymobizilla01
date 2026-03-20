# Mobizilla Core Workflow Map

> Mobile device repair and buyback platform for Kathmandu (Nepal)

---

## 1. Repair Workflow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           REPAIR BOOKING FLOW                                    │
└─────────────────────────────────────────────────────────────────────────────────┘

  [Landing / Device Browser]  →  [Repair Form]  →  [OTP Verification]  →  [Booking Created]
           │                              │                    │                    │
           │                              │                    │                    │
           ▼                              ▼                    ▼                    ▼
  • Select device category       • Fill device, issue,   • send-otp Edge     • repair_orders
  • Browse phone_models           • customer details      • Twilio SMS        • send-notifications
  • Navigate to /repair           • Submit form           • 5-min validity    • SMS + Email
                                                                             • Tracking code
                                                                                    │
                                                                                    ▼
  [Order Tracking]  ←──────────────────────────────────────────────────────────────┘
           │
           ▼
  • /track/:code
  • Real-time status (pending → in_progress → completed)
  • Supabase postgres_changes or localStorage fallback
```

### Steps

| Step | Action | System |
|------|--------|--------|
| 1 | User selects device (brand, model) | DeviceBrowserSection, phone_models |
| 2 | Fills RepairBuybackForm (device, issue, contact) | Form validation |
| 3 | Request OTP | `send-otp` Edge Function → Twilio |
| 4 | User enters OTP, form submits | OTP verification |
| 5 | Create booking | `repairAPI.createBooking()` → repair_orders |
| 6 | Send SMS + Email | `send-notifications` Edge Function |
| 7 | Return tracking code | SNP{6 digits} |
| 8 | Track order | `/track/:code` |

---

## 2. Buyback Workflow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           BUYBACK QUOTE FLOW                                     │
└─────────────────────────────────────────────────────────────────────────────────┘

  [Device Selection]  →  [Condition MCQ]  →  [Price Estimate]  →  [OTP]  →  [Quote Submitted]
         │                      │                    │              │              │
         ▼                      ▼                    ▼              ▼              ▼
  • Select brand/model    • excellent/good/     • buyback_models   • send-otp   • buyback_quotes
  • phone_models           • fair/poor           • base_price      • Twilio     • public_code
```

### Steps

| Step | Action | System |
|------|--------|--------|
| 1 | Select device | phone_models, DeviceBrowserSection |
| 2 | Select condition (excellent/good/fair/poor) | MCQ |
| 3 | Get estimated price | buyback_models lookup |
| 4 | Request OTP | `send-otp` Edge Function |
| 5 | Submit quote with contact details | buyback_quotes insert |
| 6 | Receive public_code for tracking | hex(6 bytes) |

---

## 3. E-commerce Workflow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           E-COMMERCE FLOW                                        │
└─────────────────────────────────────────────────────────────────────────────────┘

  [Browse Products]  →  [Add to Cart]  →  [Checkout]  →  [Order Placed]
         │                    │                │                │
         ▼                    ▼                ▼                ▼
  • /buy                 • CartProvider   • /checkout      • orders
  • products              • localStorage  • Review cart    • order_items
  • categories            • Add/remove    • Shipping       • payment_status
  • product_images        • Quantity      • Payment (TBD)   • public_code
```

### Steps

| Step | Action | System |
|------|--------|--------|
| 1 | Browse products by category | products, categories |
| 2 | Add to cart | CartProvider (Zustand/Context) |
| 3 | Proceed to checkout | /checkout |
| 4 | Enter shipping, apply discount | discount_codes, settings |
| 5 | Place order | orders, order_items insert |
| 6 | Payment (GPay, Paytm, PhonePe) | Not fully wired |

---

## 4. Training Workflow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           TRAINING ENROLLMENT FLOW                               │
└─────────────────────────────────────────────────────────────────────────────────┘

  [Browse Courses]  →  [View Course]  →  [Enroll]  →  [Enrollment Created]
         │                    │              │
         ▼                    ▼              ▼
  • /training           • /training/:id   • enrollments
  • courses             • Course details • course_id, name, email, phone
```

### Steps

| Step | Action | System |
|------|--------|--------|
| 1 | Browse courses | courses table |
| 2 | View course details | /training/:id |
| 3 | Submit enrollment form | enrollments insert |

---

## 5. Admin Workflow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           ADMIN DASHBOARD FLOW                                   │
└─────────────────────────────────────────────────────────────────────────────────┘

  [Login]  →  [Dashboard]  →  [Manage Content / Settings / E-commerce / Blog / Training]
     │              │
     ▼              ▼
  • /admin/login   • /admin/dashboard
  • Env credentials • Content, settings, products, blog, courses
  • localStorage    • phone_models, brands, FAQs
```

### Steps

| Step | Action | System |
|------|--------|--------|
| 1 | Login with VITE_ADMIN_EMAIL / VITE_ADMIN_PASSWORD | Env-based auth |
| 2 | Access dashboard | Admin routes |
| 3 | Manage website_content, editable_content, website_settings | Supabase |
| 4 | Manage products, categories, orders | E-commerce admin |
| 5 | Manage blog_posts, videos | Content admin |
| 6 | Manage courses, enrollments | Training admin |
| 7 | Manage phone_models, buyback_models | Device catalog |

---

## 6. Supporting Flows

| Flow | Purpose |
|------|---------|
| **Contact** | contact_messages insert |
| **Blog** | blog_posts read (published only) |
| **Gallery** | videos read |
| **Chatbot** | OpenRouter AI chat |
| **SEO** | Service pages, Kathmandu landing pages |

---

## 7. Cross-Cutting Concerns

| Concern | Implementation |
|---------|----------------|
| **Auth** | Admin: env + localStorage; Public: anonymous |
| **Notifications** | Twilio (SMS), SendGrid (email) |
| **Content** | ContentContext + 5-min localStorage cache |
| **Fallback** | localStorage for repair tracking when Supabase unavailable |
| **Real-time** | postgres_changes for repair_orders, content |
