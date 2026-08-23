# Shoe Shop API — Reference

Base URL (local dev): `http://localhost:5000/api`

All request/response bodies are JSON unless noted (product create/update use `multipart/form-data` because of image uploads).

---

## Auth

Admin-only routes require a header:
```
Authorization: Bearer <token>
```
Get a token from `POST /auth/login`. Tokens expire after 7 days.

### POST /auth/setup
One-time bootstrap to create the **first and only** admin account. Returns `403` if an admin already exists — call this exactly once, then never again.

**Body:**
```json
{ "username": "admin", "password": "at least 8 characters" }
```
**Response 201:**
```json
{ "token": "eyJ...", "admin": { "id": "...", "username": "admin" } }
```

### POST /auth/login
**Body:**
```json
{ "username": "admin", "password": "..." }
```
**Response 200:** same shape as setup.
**Response 401:** `{ "error": "Invalid username or password" }`

### GET /auth/me
Protected. Returns the currently authenticated admin — useful to verify a stored token is still valid on app load.
**Response 200:** `{ "admin": { "id": "...", "username": "..." } }`

---

## Products

### GET /products
Public. Returns active products only.
**Query params:** `?category=Sneakers` (optional)
**Response 200:** array of Product objects (see shape below).

### GET /products/all
**Protected.** Returns all products including inactive ones (for admin product management screen).

### GET /products/:id
Public. Single product.
**Response 404** if not found. **400** if `:id` isn't a valid Mongo ObjectId.

### POST /products
**Protected.** Content-Type: `multipart/form-data`.

**Fields:**
| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | text | yes | |
| `description` | text | yes | |
| `price` | text (number) | yes | |
| `category` | text | no | |
| `features` | text | no | JSON-stringified array, e.g. `'["Leather", "Water resistant"]'` |
| `variants` | text | no | JSON-stringified array, e.g. `'[{"size":"42","color":"Black","stock":5}]'` |
| `images` | file(s) | no | up to 6 files, field name must be `images`. Accepted: .jpg, .jpeg, .png, .webp, max 5MB each |

**Response 201:** the created Product object.

### PUT /products/:id
**Protected.** Same fields as POST, all optional — only send what changed. New `images` files are **appended** to existing ones (doesn't replace them). To remove an image, that requires a separate future endpoint — not in MVP scope.

### DELETE /products/:id
**Protected.** **Response 200:** `{ "message": "Product deleted", "id": "..." }`

### Product object shape
```json
{
  "_id": "64f...",
  "name": "Air Runner",
  "description": "Lightweight running shoe",
  "price": 79.99,
  "category": "Sneakers",
  "images": ["/uploads/171234-56.jpg"],
  "variants": [{ "size": "42", "color": "Black", "stock": 5 }],
  "features": ["Breathable mesh", "Cushioned sole"],
  "isActive": true,
  "createdAt": "2026-08-22T...",
  "updatedAt": "2026-08-22T..."
}
```
Image paths are relative — prefix with the API host to display them, e.g.:
`http://localhost:5000/uploads/171234-56.jpg`

---

## Orders

### POST /orders
Public — this is what the checkout form submits.

**Body:**
```json
{
  "customer": {
    "firstName": "Ana",
    "lastName": "Kola",
    "phone": "0691234567",
    "city": "Tirana",
    "address": "Rr. Myslym Shyri 10",
    "notes": "Ring the bell twice"
  },
  "items": [
    { "productId": "64f...", "quantity": 2, "variant": { "size": "42", "color": "Black" } }
  ]
}
```
Notes:
- `variant` is optional.
- Do **not** send price or product name — the server looks up the real product and computes everything itself. Any price sent by the client is ignored.
- `notes` is optional.

**Response 201:** the created Order object (see shape below), including the generated `orderNumber` — show this to the customer as their confirmation.

**Response 400** if: customer fields missing, items empty, invalid productId, quantity < 1, or a referenced product is inactive/missing.

### GET /orders
**Protected.** List all orders, newest first.
**Query params:** `?status=New` (optional filter; must be one of the valid statuses below)

### GET /orders/:id
**Protected.** Single order.

### PUT /orders/:id/status
**Protected.** Body:
```json
{ "status": "Confirmed" }
```
Valid statuses: `New`, `Confirmed`, `In Delivery`, `Delivered`, `Cancelled`

### Order object shape
```json
{
  "_id": "64f...",
  "orderNumber": "ORD-0001",
  "customer": {
    "firstName": "Ana", "lastName": "Kola", "phone": "0691234567",
    "city": "Tirana", "address": "Rr. Myslym Shyri 10", "notes": ""
  },
  "items": [
    {
      "product": "64f...",
      "name": "Air Runner",
      "price": 79.99,
      "variant": { "size": "42", "color": "Black" },
      "quantity": 2
    }
  ],
  "total": 159.98,
  "paymentMethod": "Pay on Delivery",
  "status": "New",
  "createdAt": "2026-08-22T...",
  "updatedAt": "2026-08-22T..."
}
```

---

## Misc

### GET /health
No auth. Returns `{ "status": "ok", "timestamp": "..." }` — use to verify the API is reachable.

### Error format
All errors follow the same shape:
```json
{ "error": "Human-readable message" }
```
Common status codes: `400` (bad input), `401` (missing/invalid auth), `403` (forbidden — e.g. setup already done), `404` (not found), `500` (server error).

### CORS
The API only accepts requests from the origin set in the server's `CLIENT_URL` env var (defaults to `http://localhost:5173`, Vite's default port). If the frontend runs on a different port/domain, that env var needs updating on the server side.

### Environment
Frontend should read the API base URL from an env var, e.g. `VITE_API_URL=http://localhost:5000/api`, rather than hardcoding it — this makes it trivial to point at a deployed backend later.
