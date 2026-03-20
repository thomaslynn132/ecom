# E-Commerce Platform

A full-stack e-commerce application built with React, Node.js, Express, and MongoDB.

## Features

### User Features
- User registration and login with JWT authentication
- Browse products with search and filters
- Product details with reviews and ratings
- Shopping cart with persistent storage
- Order checkout (UI ready)

### Admin Features
- Dashboard with statistics
- Product management (CRUD)
- User management
- Order management (placeholder)

## Tech Stack

### Backend
- Node.js + Express.js
- MongoDB with Mongoose
- JWT (Access + Refresh tokens)
- bcryptjs for password hashing

### Frontend
- React 18 + Vite
- Zustand (state management)
- Tailwind CSS
- shadcn/ui components
- React Router v6
- Axios

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── routes/         # API routes
│   │   ├── models/         # Database schemas
│   │   ├── middlewares/     # Auth, error handling
│   │   └── config/         # DB connection
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/     # UI components
│   │   │   └── ui/         # shadcn components
│   │   ├── pages/          # Route pages
│   │   │   └── admin/      # Admin pages
│   │   ├── layouts/        # Layout components
│   │   ├── store/          # Zustand stores
│   │   ├── services/       # API calls
│   │   └── lib/            # Utilities
│   └── index.html
│
├── SPECS.md                 # Technical specifications
└── SETUP.md                 # Setup instructions
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd ecom
```

2. **Setup Backend**
```bash
cd backend
npm install
```
Configure `.env` file with your MongoDB URI and JWT secrets.

3. **Setup Frontend**
```bash
cd frontend
npm install
```

### Running the Application

**Backend (Terminal 1)**
```bash
cd backend
npm run dev
```

**Frontend (Terminal 2)**
```bash
cd frontend
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| POST | /api/auth/refresh-token | Refresh access token |
| GET | /api/auth/profile | Get user profile |
| PUT | /api/auth/profile | Update profile |
| POST | /api/auth/logout | Logout user |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | Get all products |
| GET | /api/products/:id | Get product by ID |
| GET | /api/products/categories | Get categories |
| POST | /api/products | Create product (admin) |
| PUT | /api/products/:id | Update product (admin) |
| DELETE | /api/products/:id | Delete product (admin) |
| POST | /api/products/:id/reviews | Add review |

### Users (Admin)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/users | Get all users |
| GET | /api/users/stats | Get user statistics |
| GET | /api/users/:id | Get user by ID |
| PUT | /api/users/:id | Update user |
| DELETE | /api/users/:id | Delete user |

## Creating an Admin User

After starting the backend, manually update a user's role to "admin" in MongoDB:

```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ecom
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## Architecture

### Backend (Layered Architecture)
```
Routes → Controllers → Services → Models
```

- **Routes**: Define API endpoints
- **Controllers**: Handle HTTP request/response
- **Services**: Business logic and database operations
- **Models**: Mongoose schemas and validations

### Frontend (State Management)
```
Zustand Stores:
- authStore: Authentication state
- productStore: Products and filters
- cartStore: Shopping cart
```

## License

MIT
# ecom
