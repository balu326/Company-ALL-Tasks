# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

LuxeMarket is a luxury e-commerce web application built with vanilla JavaScript, HTML5, and CSS3. It features a dark luxury theme with glassmorphism effects and includes both a customer-facing storefront and an admin dashboard.

## Architecture

### Core Structure
- **Frontend-only application** with no backend dependencies
- **localStorage-based persistence** for all data (products, cart, orders)
- **Dual-interface design**: separate customer storefront (`index.html`) and admin panel (`admin.html`)
- **Shared state management** via localStorage keys:
  - `luxemarket_products`: Product catalog
  - `luxemarket_cart`: Shopping cart contents  
  - `luxemarket_orders`: Order history

### Key Files
- `index.html`: Customer storefront with product browsing and cart functionality
- `admin.html`: Admin dashboard with orders, products, and analytics tabs
- `script.js`: Storefront JavaScript with product display, filtering, cart management
- `admin.js`: Admin panel JavaScript with CRUD operations and analytics
- `styles.css`: Dark luxury theme with CSS custom properties and glassmorphism

### Data Flow
1. Products are initialized with sample data on first load
2. Cart state persists across browser sessions
3. Orders are created during checkout and stored in localStorage
4. Admin panel reads/writes the same localStorage data for real-time sync
5. Analytics are calculated dynamically from order data

## Development Commands

### Running the Application
```bash
# Serve via Python (recommended for local development)
python -m http.server 8000

# Serve via Node.js
npx http-server

# Serve via PHP
php -S localhost:8000
```

Access URLs:
- Storefront: `http://localhost:8000`
- Admin: `http://localhost:8000/admin.html`

### Testing
No automated test suite exists. Manual testing involves:
- Testing product filtering and search functionality
- Verifying cart operations (add, remove, quantity updates)
- Testing checkout flow and order creation
- Verifying admin CRUD operations sync with storefront
- Testing responsive design across device sizes

## Key Technologies & Dependencies

### External Dependencies
- **Font Awesome 6.0.0**: Icons (`https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css`)
- **Chart.js**: Analytics dashboard charts (admin only)
- **Unsplash**: Product images via API

### Browser Requirements
- ES6+ JavaScript support
- CSS Grid and Flexbox
- CSS Custom Properties
- localStorage API
- Modern DOM APIs

## Design System

### CSS Architecture
- **CSS Custom Properties** for theming in `:root` selector
- **Dark luxury palette**: Primary background `#0a0a0a`, accent gold `#d4af37`
- **Glassmorphism effects**: `backdrop-filter: blur()` with semi-transparent backgrounds
- **Responsive breakpoints**: Mobile-first approach with tablet and desktop variants

### Component Patterns
- **Modal system**: Reusable modal structure with backdrop and close functionality
- **Toast notifications**: Temporary feedback messages with slide-in animation
- **Product cards**: Consistent card layout with hover effects
- **Admin tables**: Responsive data tables with action buttons

## Common Development Tasks

### Adding New Products
1. Use admin panel UI, or
2. Modify `getSampleProducts()` function in `script.js`
3. Products auto-sync between storefront and admin

### Modifying Theme
Edit CSS custom properties in `styles.css`:
```css
:root {
    --primary-bg: #0a0a0a;
    --secondary-bg: #1a1a1a;
    --accent-color: #d4af37;
    /* Additional theme variables */
}
```

### Adding New Categories
1. Update category options in both `index.html` and `admin.html`
2. No JavaScript changes needed - filtering is dynamic

### Extending Analytics
- Add new metrics in `updateAnalytics()` function in `admin.js`
- Chart customization available in `renderSalesChart()` function

## Code Patterns

### Event Handling
- Event delegation for dynamic content
- Keyboard shortcuts support (Escape, 'C', 'S')
- Form validation with user feedback

### State Management
- Centralized localStorage functions (`saveProducts()`, `saveCart()`, etc.)
- Real-time sync between storefront and admin
- Automatic data refresh for admin dashboard

### Error Handling
- Image fallbacks for broken URLs
- Stock validation for cart operations
- Form validation with user-friendly messages

## Responsive Design

### Breakpoints
- **Mobile**: `max-width: 768px`
- **Tablet**: `768px - 1024px` 
- **Desktop**: `min-width: 1024px`

### Mobile Optimizations
- Touch-friendly buttons and interactions
- Collapsible navigation elements
- Optimized product grid layouts
- Swipe-friendly cart drawer
