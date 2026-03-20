# E-Commerce Platform - Technical Specifications

## Overview
Full-stack e-commerce platform with React frontend and Node.js/Express backend.

## Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (Access + Refresh tokens)
- **Password Hashing**: bcryptjs
- **File Handling**: multer

### Frontend
- **Build Tool**: Vite
- **Framework**: React 18
- **State Management**: Zustand with persistence
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **HTTP Client**: Axios

## Architecture

### Backend Layered Architecture
```
Routes → Controllers → Services → Models
```

- **Routes**: HTTP method definitions, route parameters
- **Controllers**: Request/response handling only
- **Services**: Business logic, database operations
- **Models**: Mongoose schemas, validations

### Backend Structure
```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   ├── routes/          # API routes
│   ├── models/          # Database schemas
│   ├── middlewares/     # Auth, error handling
│   ├── utils/           # Helper functions
│   ├── config/          # DB connection
│   └── app.js           # Express app
├── server.js
└── .env
```

### Frontend Structure
```
frontend/
├── src/
│   ├── app/             # App routing
│   ├── pages/           # Route pages
│   ├── components/      # UI components
│   │   └── ui/          # shadcn components
│   ├── layouts/         # Layout components
│   ├── store/           # Zustand stores
│   ├── services/        # API calls
│   ├── hooks/           # Custom hooks
│   └── lib/             # Utilities
├── index.html
└── .env
```

## API Design

### Response Format
```json
{
  "success": true,
  "data": {},
  "message": ""
}
```

### Error Format
```json
{
  "success": false,
  "message": "Error description"
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## Features

### Authentication
- [x] User registration with email validation
- [x] User login with JWT tokens
- [x] Access token (15 min expiry)
- [x] Refresh token (7 day expiry)
- [x] Token refresh on 401 response
- [x] Password hashing with bcrypt
- [x] Protected routes middleware
- [x] Role-based access control (user/admin)

### User Module
- [x] Get user profile
- [x] Update user profile
- [x] User logout

### Product Module
- [x] Create product (admin)
- [x] Get all products with pagination
- [x] Get single product
- [x] Update product (admin)
- [x] Delete product (admin)
- [x] Search by name/description
- [x] Filter by category
- [x] Filter by price range
- [x] Get all categories

### Review Module
- [x] Add review to product (authenticated)
- [x] One review per user per product
- [x] Automatic rating aggregation

### Cart Module
- [x] Add items to cart
- [x] Update item quantity
- [x] Remove items
- [x] Clear cart
- [x] Persistent storage (localStorage)
- [x] Total price calculation
- [x] Total items count

### Admin Panel
- [x] Dashboard overview
- [x] Product management (CRUD)
- [x] User management (view)
- [ ] Order management
- [ ] Analytics dashboard

## Frontend State Management

### Zustand Stores

#### authStore
```javascript
{
  user: User | null,
  isAuthenticated: boolean,
  isLoading: boolean,
  error: string | null,
  
  login(email, password),
  register(name, email, password),
  logout(),
  fetchProfile(),
  clearError()
}
```

#### productStore
```javascript
{
  products: Product[],
  currentProduct: Product | null,
  categories: string[],
  totalPages: number,
  currentPage: number,
  total: number,
  isLoading: boolean,
  error: string | null,
  filters: { keyword, category, minPrice, maxPrice },
  
  fetchProducts(params),
  fetchProductById(id),
  fetchCategories(),
  createProduct(data),
  updateProduct(id, data),
  deleteProduct(id),
  addReview(productId, reviewData),
  setFilters(filters),
  clearFilters(),
  clearError()
}
```

#### cartStore
```javascript
{
  items: CartItem[],
  
  addItem(product, quantity),
  removeItem(productId),
  updateQuantity(productId, quantity),
  clearCart(),
  getTotalItems(),
  getTotalPrice()
}
```

## Security

### Backend
- Password hashing (bcrypt, salt rounds: 10)
- JWT token verification
- Input validation via Mongoose
- Error handling middleware
- Role-based authorization
- Environment variables for secrets

### Frontend
- Token storage in localStorage
- Axios interceptors for auth
- Protected route components
- Input sanitization

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ecom
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## Future Enhancements
- [ ] Order module with payment integration
- [ ] Wishlist feature
- [ ] Image upload to Cloudinary
- [ ] Email notifications
- [ ] Rate limiting
- [ ] Refresh token rotation
- [ ] Infinite scroll pagination
- [ ] Dark mode toggle
- [ ] Advanced search with filters
- [ ] Order tracking
- [ ] Payment gateway integration
- [ ] Admin analytics dashboard
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Social login (OAuth)
