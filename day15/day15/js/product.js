// Product detail page script
import { ProductService } from './services/product-service.js';
import { CartService } from './services/cart-service.js';
import { setupMiniCart } from './components/mini-cart.js';

// DOM Elements
const productDetails = document.getElementById('product-details');
const productBreadcrumb = document.getElementById('product-breadcrumb');

// Services
const productService = new ProductService();
const cartService = new CartService();

// State
let product = null;
let quantity = 1;

// Initialize the product page
async function initProductPage() {
    // Setup mini cart
    setupMiniCart(cartService);
    
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        showError('Product ID is missing');
        return;
    }
    
    // Load product details
    try {
        product = await productService.getProductById(productId);
        if (!product) {
            showError('Product not found');
            return;
        }
        
        renderProductDetails();
    } catch (error) {
        console.error('Failed to load product details:', error);
        showError('Failed to load product details');
    }
}

// Render product details
function renderProductDetails() {
    // Update breadcrumb
    productBreadcrumb.textContent = product.title;
    
    // Create product details HTML
    const stockStatus = getStockStatusHTML(product.stock);
    
    const productHTML = `
        <div class="product-details-image">
            <img src="${product.image}" alt="${product.title}">
        </div>
        <div class="product-details-info">
            <h1 class="product-details-title">${product.title}</h1>
            <p class="product-details-category">${product.category}</p>
            <div class="product-details-price">$${product.price.toFixed(2)}</div>
            <div class="product-details-rating">
                ${getRatingStars(product.rating)}
                <span>(${product.rating.toFixed(1)})</span>
            </div>
            <p class="product-details-stock">${stockStatus}</p>
            <div class="product-details-description">
                ${product.description}
            </div>
            <div class="product-details-actions">
                <div class="quantity-selector">
                    <button class="quantity-btn" id="decrease-quantity">-</button>
                    <input type="number" class="quantity-input" id="quantity" value="1" min="1" max="${product.stock}">
                    <button class="quantity-btn" id="increase-quantity">+</button>
                </div>
                <button class="btn btn-primary" id="add-to-cart">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            </div>
        </div>
    `;
    
    productDetails.innerHTML = productHTML;
    
    // Setup event listeners
    setupQuantityControls();
    setupAddToCartButton();
}

// Get stock status HTML
function getStockStatusHTML(stock) {
    if (stock <= 0) {
        return '<span class="out-of-stock">Out of Stock</span>';
    } else if (stock <= 5) {
        return `<span class="low-stock">Low Stock (${stock} left)</span>`;
    } else {
        return '<span class="in-stock">In Stock</span>';
    }
}

// Get rating stars HTML
function getRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let starsHTML = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    // Half star
    if (halfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

// Setup quantity controls
function setupQuantityControls() {
    const quantityInput = document.getElementById('quantity');
    const decreaseBtn = document.getElementById('decrease-quantity');
    const increaseBtn = document.getElementById('increase-quantity');
    
    // Update quantity state when input changes
    quantityInput.addEventListener('change', () => {
        let value = parseInt(quantityInput.value);
        
        // Validate quantity
        if (isNaN(value) || value < 1) {
            value = 1;
        } else if (value > product.stock) {
            value = product.stock;
        }
        
        quantity = value;
        quantityInput.value = value;
    });
    
    // Decrease quantity
    decreaseBtn.addEventListener('click', () => {
        if (quantity > 1) {
            quantity--;
            quantityInput.value = quantity;
        }
    });
    
    // Increase quantity
    increaseBtn.addEventListener('click', () => {
        if (quantity < product.stock) {
            quantity++;
            quantityInput.value = quantity;
        }
    });
}

// Setup add to cart button
function setupAddToCartButton() {
    const addToCartBtn = document.getElementById('add-to-cart');
    
    addToCartBtn.addEventListener('click', () => {
        if (product.stock <= 0) {
            alert('Sorry, this product is out of stock.');
            return;
        }
        
        cartService.addToCart(product.id, quantity);
        
        // Show confirmation
        const originalText = addToCartBtn.innerHTML;
        addToCartBtn.innerHTML = '<i class="fas fa-check"></i> Added to Cart';
        addToCartBtn.disabled = true;
        
        setTimeout(() => {
            addToCartBtn.innerHTML = originalText;
            addToCartBtn.disabled = false;
        }, 2000);
    });
}

// Show error message
function showError(message) {
    productDetails.innerHTML = `
        <div class="error-container">
            <p class="error-message">${message}</p>
            <a href="index.html" class="btn btn-primary">Back to Shop</a>
        </div>
    `;
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', initProductPage);