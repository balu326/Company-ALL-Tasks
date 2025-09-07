// Main application entry point
import { ProductService } from './services/product-service.js';
import { CartService } from './services/cart-service.js';
import { renderProductCard } from './components/product-card.js';
import { setupMiniCart } from './components/mini-cart.js';

// DOM Elements
const productsGrid = document.getElementById('products-grid');
const categoryFilter = document.getElementById('category-filter');
const priceMinInput = document.getElementById('price-min');
const priceMaxInput = document.getElementById('price-max');
const applyPriceFilterBtn = document.getElementById('apply-price-filter');
const searchInput = document.getElementById('search');

// Services
const productService = new ProductService();
const cartService = new CartService();

// State
let products = [];
let filteredProducts = [];
let filters = {
    category: '',
    priceMin: null,
    priceMax: null,
    search: ''
};

// Initialize the application
async function initApp() {
    // Setup mini cart
    setupMiniCart(cartService);
    
    // Load products
    try {
        products = await productService.getProducts();
        filteredProducts = [...products];
        renderProducts();
        populateCategories();
    } catch (error) {
        console.error('Failed to load products:', error);
        productsGrid.innerHTML = '<p class="error-message">Failed to load products. Please try again later.</p>';
    }
    
    // Setup event listeners
    setupEventListeners();
}

// Render products to the grid
function renderProducts() {
    productsGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p class="no-products">No products found matching your criteria.</p>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = renderProductCard(product, (productId) => {
            window.location.href = `product.html?id=${productId}`;
        }, cartService.addToCart.bind(cartService));
        productsGrid.appendChild(productCard);
    });
}

// Populate category filter
function populateCategories() {
    const categories = [...new Set(products.map(product => product.category))];
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        categoryFilter.appendChild(option);
    });
}

// Apply filters to products
function applyFilters() {
    filteredProducts = products.filter(product => {
        // Category filter
        if (filters.category && product.category !== filters.category) {
            return false;
        }
        
        // Price range filter
        if (filters.priceMin !== null && product.price < filters.priceMin) {
            return false;
        }
        
        if (filters.priceMax !== null && product.price > filters.priceMax) {
            return false;
        }
        
        // Search filter
        if (filters.search && !product.title.toLowerCase().includes(filters.search.toLowerCase())) {
            return false;
        }
        
        return true;
    });
    
    renderProducts();
}

// Setup event listeners
function setupEventListeners() {
    // Category filter
    categoryFilter.addEventListener('change', () => {
        filters.category = categoryFilter.value;
        applyFilters();
    });
    
    // Price range filter
    applyPriceFilterBtn.addEventListener('click', () => {
        filters.priceMin = priceMinInput.value ? parseFloat(priceMinInput.value) : null;
        filters.priceMax = priceMaxInput.value ? parseFloat(priceMaxInput.value) : null;
        applyFilters();
    });
    
    // Search filter
    searchInput.addEventListener('input', () => {
        filters.search = searchInput.value.trim();
        applyFilters();
    });
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);