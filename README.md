# Fashion E-Commerce Frontend

Complete React frontend for the Fashion E-Commerce platform with admin management system.

## 🎯 Features

### Customer Features
- ✅ User Registration & Login
- ✅ Browse Products with Filters & Search
- ✅ Product Detail View with Reviews
- ✅ Shopping Cart Management
- ✅ Checkout & Order Placement
- ✅ Order History & Tracking
- ✅ Responsive Design

### Admin Features
- ✅ Admin Dashboard with Analytics
- ✅ View Sales Statistics
- ✅ Low Stock Alerts
- ✅ Recent Orders Overview
- ✅ Top Selling Products

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- Backend API running on `http://localhost:5000`

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The application will open at `http://localhost:3000`

## 📁 Project Structure

```
frontend/src/
├── components/          # Reusable components
│   ├── Navbar/
│   ├── Footer/
│   ├── ProductCard/
│   └── Loader/
├── pages/              # Page components
│   ├── Home/
│   ├── Login/
│   ├── Register/
│   ├── Products/
│   ├── ProductDetail/
│   ├── Cart/
│   ├── Checkout/
│   ├── Orders/
│   └── Admin/
│       └── Dashboard/
├── context/            # React Context
│   ├── AuthContext.jsx
│   └── CartContext.jsx
├── services/          # API services
│   └── api.js
├── App.jsx           # Main app component
├── index.js          # Entry point
└── index.css         # Global styles
```

## 🎨 Styling

All components use **pure CSS** with separate CSS files in their respective folders:
- No CSS frameworks (Bootstrap, Tailwind, etc.)
- Custom responsive design
- Modern gradient themes
- Smooth animations and transitions

## 🔌 API Integration

The frontend connects to the backend API at `http://localhost:5000/api`

### Key API Services:
- **authAPI**: User authentication
- **productAPI**: Product management
- **cartAPI**: Shopping cart operations
- **orderAPI**: Order processing
- **adminAPI**: Admin operations

## 🔐 Authentication

Uses JWT tokens stored in localStorage:
- Token automatically attached to API requests
- Protected routes require authentication
- Admin routes require admin role

### Demo Credentials:
**Admin:**
- Email: `admin@fashion.com`
- Password: `admin123`

**Customer:**
- Email: `john@example.com`
- Password: `password123`

## 📱 Pages Overview

### Public Pages
- **Home** (`/`) - Hero section, featured products, categories
- **Products** (`/products`) - Product listing with filters
- **Product Detail** (`/products/:id`) - Single product view
- **Login** (`/login`) - User login
- **Register** (`/register`) - User registration

### Protected Pages (Require Login)
- **Cart** (`/cart`) - Shopping cart
- **Checkout** (`/checkout`) - Order placement
- **Orders** (`/orders`) - Order history

### Admin Pages (Require Admin Role)
- **Dashboard** (`/admin`) - Admin analytics dashboard

## 🎯 Key Features Explained

### Context Providers
- **AuthContext**: Manages user authentication state
- **CartContext**: Manages shopping cart state

### Protected Routes
- Automatically redirect to login if not authenticated
- Admin routes check for admin role

### Responsive Design
- Mobile-first approach
- Breakpoints: 768px, 1024px
- Flexible grid layouts

## 🛠️ Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## 🌐 Environment Configuration

The app connects to backend via proxy configuration in `package.json`:
```json
"proxy": "http://localhost:5000"
```

## 📦 Dependencies

### Core
- `react` - UI library
- `react-dom` - React DOM rendering
- `react-router-dom` - Routing
- `axios` - HTTP client

### Development
- `react-scripts` - Create React App scripts

## 🎨 Color Scheme

```css
Primary: #667eea (Purple)
Secondary: #764ba2 (Dark Purple)
Success: #28a745 (Green)
Danger: #dc3545 (Red)
Warning: #ffc107 (Yellow)
Info: #17a2b8 (Cyan)
Dark: #2c3e50
Light: #f8f9fa
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

### Deploy Options
- **Vercel**: Connect GitHub repo and deploy
- **Netlify**: Drag & drop build folder
- **GitHub Pages**: Use `gh-pages` package

## 🐛 Troubleshooting

### API Connection Issues
- Ensure backend is running on port 5000
- Check proxy configuration in package.json
- Verify CORS is enabled on backend

### Login Issues
- Clear localStorage and try again
- Check JWT token expiration
- Verify credentials with backend

### Build Errors
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Clear cache: `npm cache clean --force`

## 📝 Notes

- All components are in standalone folders with their CSS
- No inline styles used
- No CSS frameworks, pure CSS only
- Responsive design for all screen sizes
- Optimized for performance

## 🎓 For Presentation

### Highlight These:
1. **Clean Code Structure** - Component-based architecture
2. **State Management** - React Context API
3. **API Integration** - Axios with interceptors
4. **Authentication Flow** - JWT tokens
5. **Responsive Design** - Mobile-friendly
6. **User Experience** - Smooth animations, loading states
7. **Admin Panel** - Management dashboard

## 🤝 Integration with Backend

Ensure backend is running before starting frontend:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

## ✅ Testing Checklist

- [ ] User can register
- [ ] User can login
- [ ] Products display correctly
- [ ] Filters work
- [ ] Can add to cart
- [ ] Cart updates properly
- [ ] Checkout works
- [ ] Orders are created
- [ ] Admin can access dashboard
- [ ] Responsive on mobile

## 🎉 Success!

Your frontend is now complete and integrated with the backend. Start both servers and test the full e-commerce experience!

**Good luck with your project presentation! 🚀**
