// Checkout page script
import { CartService } from './services/cart-service.js';
import { OrderService } from './services/order-service.js';
import { ProductService } from './services/product-service.js';

// DOM Elements
const checkoutForm = document.getElementById('checkout-form');
const checkoutItems = document.getElementById('checkout-items');
const checkoutSubtotal = document.getElementById('checkout-subtotal');
const checkoutShipping = document.getElementById('checkout-shipping');
const checkoutTotal = document.getElementById('checkout-total');
const orderSuccessModal = document.getElementById('order-success-modal');
const orderId = document.getElementById('order-id');
const continueShoppingBtn = document.getElementById('continue-shopping');
const overlay = document.getElementById('overlay');

// Services
const cartService = new CartService();
const orderService = new OrderService();
const productService = new ProductService();

// Constants
const SHIPPING_COST = 5.00;

// Initialize the checkout page
async function initCheckoutPage() {
    // Check if cart is empty
    const cart = cartService.getCart();
    
    if (Object.keys(cart.items).length === 0) {
        // Redirect to shop if cart is empty
        window.location.href = 'index.html';
        return;
    }
    
    // Load cart items
    try {
        await loadCartItems();
    } catch (error) {
        console.error('Failed to load cart items:', error);
    }
    
    // Setup event listeners
    setupEventListeners();
}

// Load cart items
async function loadCartItems() {
    const cart = cartService.getCart();
    const productIds = Object.keys(cart.items);
    
    // Get product details for all items in cart
    const products = await Promise.all(
        productIds.map(id => productService.getProductById(id))
    );
    
    // Render cart items
    checkoutItems.innerHTML = '';
    let subtotal = 0;
    
    products.forEach(product => {
        if (!product) return;
        
        const quantity = cart.items[product.id];
        const itemTotal = product.price * quantity;
        subtotal += itemTotal;
        
        const itemHTML = `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${product.image}" alt="${product.title}">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${product.title}</h4>
                    <p class="cart-item-price">$${product.price.toFixed(2)}</p>
                    <p class="cart-item-quantity">Quantity: ${quantity}</p>
                </div>
                <div class="cart-item-total">
                    $${itemTotal.toFixed(2)}
                </div>
            </div>
        `;
        
        checkoutItems.innerHTML += itemHTML;
    });
    
    // Update totals
    const total = subtotal + SHIPPING_COST;
    
    checkoutSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    checkoutShipping.textContent = `$${SHIPPING_COST.toFixed(2)}`;
    checkoutTotal.textContent = `$${total.toFixed(2)}`;
}

// Setup event listeners
function setupEventListeners() {
    // Form submission
    checkoutForm.addEventListener('submit', handleCheckoutSubmit);
    
    // Continue shopping button
    continueShoppingBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    
    // Form validation
    setupFormValidation();
}

// Handle checkout form submission
async function handleCheckoutSubmit(event) {
    event.preventDefault();
    
    // Validate form
    if (!validateForm()) {
        return;
    }
    
    // Get form data
    const formData = new FormData(checkoutForm);
    const customerData = {
        fullname: formData.get('fullname'),
        email: formData.get('email'),
        address: formData.get('address'),
        city: formData.get('city'),
        zip: formData.get('zip'),
        country: formData.get('country'),
        payment: {
            cardNumber: formData.get('card-number'),
            expiry: formData.get('expiry'),
            cvv: formData.get('cvv')
        }
    };
    
    // Get cart data
    const cart = cartService.getCart();
    
    // Create order
    try {
        const order = await orderService.createOrder(customerData, cart);
        
        // Clear cart
        cartService.clearCart();
        
        // Show success modal
        showOrderSuccessModal(order.id);
    } catch (error) {
        console.error('Failed to create order:', error);
        alert('Failed to process your order. Please try again.');
    }
}

// Validate form
function validateForm() {
    let isValid = true;
    
    // Reset error messages
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
    });
    
    // Validate full name
    const fullname = document.getElementById('fullname');
    if (!fullname.value.trim()) {
        document.getElementById('fullname-error').textContent = 'Please enter your full name';
        isValid = false;
    }
    
    // Validate email
    const email = document.getElementById('email');
    if (!email.value.trim()) {
        document.getElementById('email-error').textContent = 'Please enter your email';
        isValid = false;
    } else if (!isValidEmail(email.value)) {
        document.getElementById('email-error').textContent = 'Please enter a valid email address';
        isValid = false;
    }
    
    // Validate address
    const address = document.getElementById('address');
    if (!address.value.trim()) {
        document.getElementById('address-error').textContent = 'Please enter your address';
        isValid = false;
    }
    
    // Validate city
    const city = document.getElementById('city');
    if (!city.value.trim()) {
        document.getElementById('city-error').textContent = 'Please enter your city';
        isValid = false;
    }
    
    // Validate ZIP code
    const zip = document.getElementById('zip');
    if (!zip.value.trim()) {
        document.getElementById('zip-error').textContent = 'Please enter your ZIP code';
        isValid = false;
    }
    
    // Validate country
    const country = document.getElementById('country');
    if (!country.value) {
        document.getElementById('country-error').textContent = 'Please select your country';
        isValid = false;
    }
    
    // Validate card number
    const cardNumber = document.getElementById('card-number');
    if (!cardNumber.value.trim()) {
        document.getElementById('card-number-error').textContent = 'Please enter your card number';
        isValid = false;
    } else if (!isValidCardNumber(cardNumber.value)) {
        document.getElementById('card-number-error').textContent = 'Please enter a valid card number';
        isValid = false;
    }
    
    // Validate expiry date
    const expiry = document.getElementById('expiry');
    if (!expiry.value.trim()) {
        document.getElementById('expiry-error').textContent = 'Please enter expiry date';
        isValid = false;
    } else if (!isValidExpiry(expiry.value)) {
        document.getElementById('expiry-error').textContent = 'Please enter a valid expiry date (MM/YY)';
        isValid = false;
    }
    
    // Validate CVV
    const cvv = document.getElementById('cvv');
    if (!cvv.value.trim()) {
        document.getElementById('cvv-error').textContent = 'Please enter CVV';
        isValid = false;
    } else if (!isValidCVV(cvv.value)) {
        document.getElementById('cvv-error').textContent = 'Please enter a valid CVV';
        isValid = false;
    }
    
    return isValid;
}

// Setup form validation
function setupFormValidation() {
    // Email validation
    const email = document.getElementById('email');
    email.addEventListener('blur', () => {
        if (email.value.trim() && !isValidEmail(email.value)) {
            document.getElementById('email-error').textContent = 'Please enter a valid email address';
        } else {
            document.getElementById('email-error').textContent = '';
        }
    });
    
    // Card number formatting
    const cardNumber = document.getElementById('card-number');
    cardNumber.addEventListener('input', () => {
        let value = cardNumber.value.replace(/\D/g, '');
        let formattedValue = '';
        
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formattedValue += ' ';
            }
            formattedValue += value[i];
        }
        
        cardNumber.value = formattedValue;
    });
    
    // Expiry date formatting
    const expiry = document.getElementById('expiry');
    expiry.addEventListener('input', () => {
        let value = expiry.value.replace(/\D/g, '');
        
        if (value.length > 2) {
            expiry.value = value.substring(0, 2) + '/' + value.substring(2, 4);
        } else {
            expiry.value = value;
        }
    });
}

// Show order success modal
function showOrderSuccessModal(orderIdValue) {
    orderId.textContent = orderIdValue;
    orderSuccessModal.classList.add('active');
    overlay.classList.add('active');
}

// Validation helpers
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidCardNumber(cardNumber) {
    const cardNumberRegex = /^[\d\s]{15,19}$/;
    return cardNumberRegex.test(cardNumber);
}

function isValidExpiry(expiry) {
    const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    return expiryRegex.test(expiry);
}

function isValidCVV(cvv) {
    const cvvRegex = /^[0-9]{3,4}$/;
    return cvvRegex.test(cvv);
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', initCheckoutPage);