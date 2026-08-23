# Shoe Shop — Backend (MVP)

REST API for a minimalist shoe store: product catalog, cart-free checkout with
Pay-on-Delivery, and an admin panel backend for managing products and orders.

The frontend is being built separately — see `API_DOCS.md` for the full API reference.

## Stack
- **Runtime:** Node.js + Express (CommonJS)
- **Database:** MongoDB Atlas (via Mongoose)
- **Auth:** JWT, single admin account

## Project structure
```
shoe-shop/
  server/
    src/
      index.js          # entry point
      app.js             # Express app, middleware, route mounting
      config/db.js       # MongoDB connection
      models/            # Product, Order, Counter, Admin
      controllers/        # business logic per resource
      routes/              # route definitions per resource
      middleware/          # auth.js (JWT check), upload.js (multer)
    uploads/              # uploaded product images (served at /uploads)
  API_DOCS.md            # full API reference for frontend integration
```

## Setup

```bash
cd server
npm install
cp .env.example .env
# edit .env: set MONGODB_URI (your Atlas connection string) and a random JWT_SECRET
npm run dev
```

Visit `http://localhost:5000/api/health` to confirm it's running.

### First-time admin setup
Before using any admin routes, create the one admin account:
```
POST /api/auth/setup
{ "username": "admin", "password": "at least 8 characters" }
```
This only works once — subsequent calls return 403.

## Status: Backend complete ✅
- [x] Phase 0 — Project setup
- [x] Phase 1 — Product model + CRUD API
- [x] Phase 2 — Order model + Order API
- [x] Phase 3 — Admin auth (JWT)
- [x] Phase 4 — Error handling polish + API documentation

## Deferred to a later phase
Payment gateway integration, email/SMS order notifications, Google Maps embed,
Analytics/Tag Manager, order search/filtering beyond status, stock tracking,
image removal on product update, multi-admin support.

## Handing off to frontend
Give the frontend developer/AI `API_DOCS.md` — it documents every endpoint,
request/response shapes, auth flow, and error format needed to build the UI
without needing to read the backend source.
