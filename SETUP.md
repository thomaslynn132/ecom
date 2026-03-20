# E-Commerce Project Setup Guide

## Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

---

## Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   - Edit `.env` file with your MongoDB URI and JWT secrets:
   ```
   MONGODB_URI=mongodb://localhost:27017/ecom
   JWT_SECRET=your-secret-key
   JWT_REFRESH_SECRET=your-refresh-secret
   ```

4. **Start MongoDB** (if using local):
   ```bash
   mongod
   ```

5. **Start the server:**
   ```bash
   npm run dev
   ```

   Server will run on `http://localhost:5000`

---

## Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure API URL (optional):**
   Create `.env` file:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:5173`

---

## API Endpoints

### Auth Routes (`/api/auth`)
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/refresh-token` - Refresh access token
- `GET /auth/profile` - Get user profile (protected)
- `PUT /auth/profile` - Update profile (protected)
- `POST /auth/logout` - Logout (protected)

### Product Routes (`/api/products`)
- `GET /products` - Get all products (with pagination, search, filters)
- `GET /products/:id` - Get product by ID
- `GET /products/categories` - Get all categories
- `POST /products` - Create product (admin only)
- `PUT /products/:id` - Update product (admin only)
- `DELETE /products/:id` - Delete product (admin only)
- `POST /products/:id/reviews` - Add review (protected)

---

## Features Implemented

### Backend
- JWT Authentication with Access + Refresh tokens
- User registration/login with password hashing
- Role-based access control (user/admin)
- Product CRUD with pagination, search, filters
- Review system with rating aggregation
- Global error handler middleware

### Frontend
- React + Vite setup
- Zustand stores (auth, product, cart)
- Login/Register pages
- Products listing with filters & pagination
- Product detail page with reviews
- Shopping cart with persistent state
- Protected routes

---

## Default Admin User

After starting the backend, create an admin user via:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@example.com","password":"admin123"}'
```

Then manually update the role to "admin" in MongoDB.

---

## Running Both Servers

Terminal 1 (Backend):
```bash
cd backend && npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend && npm run dev
```
