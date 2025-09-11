# LuxeMarket - Premium E-commerce Web Application

A luxury e-commerce web application with a dark theme, built with modern web technologies and featuring a complete storefront and admin panel.

## ✨ Features

### 🛍️ Storefront (index.html)
- **Dark luxury theme** with gradients, glass effects, and shadows
- **Sticky navigation bar** with logo, store, and cart buttons
- **Product grid** with advanced filtering capabilities:
  - Search by product name/description
  - Filter by category (jewelry, watches, handbags, accessories)
  - Price range slider
  - Sort by name or price
- **Interactive product cards** with hover effects
- **Product detail modal** with full product information
- **Shopping cart drawer** with:
  - Quantity controls
  - Remove items option
  - Clear cart functionality
  - Checkout process
- **Responsive design** for mobile, tablet, and desktop
- **Local storage persistence** for cart and product data

### 🔧 Admin Panel (admin.html)
- **Separate admin dashboard** with three main tabs:
  - **Orders Tab**: View customer orders with status tracking
  - **Products Tab**: Full CRUD operations for products
  - **Analytics Tab**: Business intelligence dashboard with:
    - Total revenue tracking
    - Order count metrics
    - Product inventory overview
    - Average order value
    - Sales by category chart (Chart.js)
- **Product management** with add/edit/delete functionality
- **Real-time data sync** with the storefront via localStorage
- **Same dark luxury theme** for consistency

### 🎨 Design Features
- **CSS Variables** for easy theme customization
- **Glassmorphism effects** with backdrop blur
- **Gradient backgrounds** and hover animations
- **Custom scrollbars** and loading animations
- **Toast notifications** for user feedback
- **Keyboard shortcuts** (Escape to close modals, 'C' for cart, 'S' for search)

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Optional: Local web server (for best experience)

### Installation

1. **Clone or download** the project files
2. **Open index.html** in your web browser to view the storefront
3. **Open admin.html** in your web browser to access the admin panel

### Recommended Setup
For the best experience, serve the files through a local web server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (with http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit:
- Storefront: `http://localhost:8000`
- Admin Panel: `http://localhost:8000/admin.html`

## 📱 Responsive Design

LuxeMarket is fully responsive and optimized for:
- **Desktop**: Full-featured experience with sidebar navigation
- **Tablet**: Optimized layout with collapsible elements
- **Mobile**: Touch-friendly interface with mobile-specific optimizations

## 💾 Data Storage

The application uses **localStorage** to persist data across sessions:
- `luxemarket_products`: Product catalog
- `luxemarket_cart`: Shopping cart contents
- `luxemarket_orders`: Order history

## 🎯 Usage Guide

### For Customers (Storefront)
1. **Browse products** on the homepage
2. **Use filters** to find specific items
3. **Click product cards** to view details
4. **Add items to cart** using the cart buttons
5. **View cart** by clicking the cart icon
6. **Adjust quantities** or remove items as needed
7. **Proceed to checkout** to complete your order

### For Administrators (Admin Panel)
1. **Navigate to admin.html**
2. **Orders Tab**: Monitor customer orders and their status
3. **Products Tab**: 
   - Click "Add Product" to create new products
   - Click "Edit" to modify existing products
   - Click "Delete" to remove products
4. **Analytics Tab**: View business metrics and sales charts

## 🔧 Customization

### Theme Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-bg: #0a0a0a;
    --secondary-bg: #1a1a1a;
    --accent-color: #d4af37;
    /* ... more variables */
}
```

### Sample Data
Sample products are automatically loaded on first visit. To modify or add products:
1. Use the Admin Panel's Products tab, or
2. Edit the `getSampleProducts()` function in `script.js`

## 📁 Project Structure

```
luxe-market/
├── index.html          # Main storefront page
├── admin.html          # Admin dashboard
├── styles.css          # Dark luxury theme styles
├── script.js           # Storefront functionality
├── admin.js           # Admin panel functionality
└── README.md          # Project documentation
```

## 🌟 Key Technologies

- **HTML5**: Semantic markup and modern structure
- **CSS3**: Advanced styling with custom properties, flexbox, and grid
- **Vanilla JavaScript**: Modern ES6+ features, local storage API
- **Chart.js**: Analytics dashboard charts
- **Font Awesome**: Icons and visual elements
- **Unsplash**: High-quality product images

## 🔐 Features Implemented

- ✅ Dark luxury theme with CSS variables
- ✅ Sticky navigation with logo and cart
- ✅ Product grid with filtering and sorting
- ✅ Product modal with full details
- ✅ Shopping cart with quantity controls
- ✅ Local storage for data persistence
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Separate admin panel file
- ✅ Orders management tab
- ✅ Products CRUD operations
- ✅ Analytics dashboard with charts
- ✅ Data synchronization between pages

## 🚀 Performance Features

- **Optimized images** with error fallbacks
- **Efficient DOM manipulation** with event delegation
- **Lazy loading** and fade-in animations
- **Auto-refresh** for real-time admin updates
- **Keyboard shortcuts** for power users
- **Toast notifications** for user feedback

## 🎨 Design Philosophy

LuxeMarket embraces a **luxury design aesthetic** with:
- **Dark color palette** for premium feel
- **Golden accents** for luxury branding
- **Glassmorphism effects** for modern appeal
- **Smooth animations** for polished interactions
- **Consistent spacing** using CSS custom properties
- **Typography hierarchy** for readability

## 🔄 Data Flow

1. **Products** are stored in localStorage and shared between storefront and admin
2. **Cart data** persists across browser sessions
3. **Orders** are created during checkout and viewable in admin panel
4. **Stock levels** update automatically when orders are placed
5. **Analytics** are calculated in real-time from order data

## 🛠️ Browser Support

LuxeMarket is compatible with modern browsers supporting:
- ES6+ JavaScript features
- CSS Grid and Flexbox
- CSS Custom Properties
- Local Storage API
- Modern DOM APIs

## 📞 Support

This is a demonstration project showcasing modern web development techniques for premium e-commerce applications.

---

**Built with ❤️ for luxury retail experiences**
