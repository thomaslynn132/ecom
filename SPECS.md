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
- **File Storage**: Cloudflare R2 (S3-compatible)

### Frontend
- **Build Tool**: Vite
- **Framework**: React 18
- **Data Fetching**: TanStack Query v5
- **State Management**: Zustand with persistence
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **HTTP Client**: Axios
- **Charts**: Recharts

## Architecture

### Backend Layered Architecture
```
Routes → Controllers → Services → Models
```

### Frontend Architecture
```
TanStack Query → Custom Hooks → Components
```

## Backend Modules

### 1. Authentication (Auth)
- [x] User registration with email validation
- [x] User login with JWT tokens
- [x] Access token (15 min expiry)
- [x] Refresh token (7 day expiry)
- [x] Token refresh on 401 response
- [x] Password hashing with bcrypt
- [x] Protected routes middleware
- [x] Role-based access control (user/admin)

### 2. User Module
- [x] Get all users (admin)
- [x] Get user profile
- [x] Update user profile
- [x] Delete user (admin)
- [x] User stats

### 3. Product Module
- [x] Create product (admin)
- [x] Get all products with pagination
- [x] Get single product
- [x] Update product (admin)
- [x] Delete product (admin)
- [x] Search by name/description
- [x] Filter by category
- [x] Filter by price range
- [x] Low stock tracking
- [x] Product variants (basic)
- [x] Featured products
- [x] Product stats

### 4. Category Module
- [x] CRUD categories (admin)
- [x] Nested categories (parent-child)
- [x] Category tree structure
- [x] Active/inactive status

### 5. Coupon Module
- [x] Create discount codes (admin)
- [x] Percentage & fixed discounts
- [x] Usage limits
- [x] Expiry dates
- [x] Minimum order value
- [x] Max discount cap
- [x] Coupon validation & application

### 6. Review Module
- [x] Add review to product (authenticated)
- [x] One review per user per product
- [x] Automatic rating aggregation
- [x] Admin review management
- [x] Review approval status

### 7. Order Module
- [x] Create order
- [x] Get orders (admin)
- [x] Get my orders (user)
- [x] Update order status
- [x] Order stats
- [x] Payment tracking
- [x] Coupon application

### 8. Settings Module
- [x] Store information
- [x] Currency settings
- [x] Tax settings
- [x] Shipping settings
- [x] Low stock threshold

## Frontend Features

### Admin Panel
- [x] Dashboard with stats & charts
- [x] Product management (CRUD)
- [x] Category management (CRUD)
- [x] Coupon management (CRUD)
- [x] Review management
- [x] User management
- [x] Order management with status update
- [x] Settings page

### UI Components
- [x] Loading states (skeleton, spinner)
- [x] Empty states
- [x] Toast notifications
- [x] Pagination
- [x] Search & filters
- [x] Dialog forms

### Data Fetching
- [x] TanStack Query integration
- [x] Custom hooks (`useApi`, `useProducts`, etc.)
- [x] Automatic cache invalidation
- [x] Optimistic updates

## API Endpoints

### Auth (`/api/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /register | Register user |
| POST | /login | Login user |
| POST | /refresh-token | Refresh token |
| GET | /profile | Get profile |
| PUT | /profile | Update profile |
| POST | /logout | Logout |

### Products (`/api/products`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | Get all products |
| GET | /:id | Get product |
| GET | /categories | Get categories |
| GET | /stats | Get stats (admin) |
| GET | /low-stock | Low stock products |
| POST | / | Create product |
| PUT | /:id | Update product |
| DELETE | /:id | Delete product |

### Categories (`/api/categories`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | Get all |
| GET | /tree | Category tree |
| GET | /:id | Get category |
| POST | / | Create |
| PUT | /:id | Update |
| DELETE | /:id | Delete |

### Coupons (`/api/coupons`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | Get all |
| POST | /validate | Validate coupon |
| POST | / | Create |
| PUT | /:id | Update |
| DELETE | /:id | Delete |

### Reviews (`/api/reviews`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /product/:id | Product reviews |
| GET | / | All reviews (admin) |
| POST | /product/:id | Add review |
| DELETE | /:id | Delete |

### Orders (`/api/orders`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | Get all (admin) |
| GET | /my-orders | My orders |
| GET | /stats | Order stats |
| GET | /:id | Get order |
| POST | / | Create order |
| PUT | /:id/status | Update status |

### Settings (`/api/settings`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | Get settings |
| PUT | / | Update settings |

## Frontend Hooks

### useApi.js
```javascript
useApiQuery({ endpoint, params, key, enabled })
useApiQueryById({ endpoint, id, key, enabled })
useApiMutation({ endpoint, method, invalidate })
useApiMutationById({ endpoint, method, invalidate })
useApiDelete({ endpoint, invalidate })
```

### useApi.js (specific)
```javascript
useProducts(params)
useProduct(id)
useCategories()
useCategoryTree()
useCoupons()
useReviews(params)
useOrders(params)
useUsers(params)
useSettings()
useCreateProduct()
useUpdateProduct()
useDeleteProduct()
// ... etc
```

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
R2_ACCOUNT_ID=your-r2-account-id
R2_ACCESS_KEY_ID=your-r2-access-key
R2_SECRET_ACCESS_KEY=your-r2-secret
R2_BUCKET_NAME=your-bucket
R2_PUBLIC_URL=https://...
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## Future Enhancements
- [ ] Real payment gateway integration
- [ ] Email notifications
- [ ] Rate limiting
- [ ] Infinite scroll pagination
- [ ] Dark mode toggle
- [ ] Wishlist feature
- [ ] Order tracking
- [ ] Social login (OAuth)
- [ ] Email verification
- [ ] Password reset
