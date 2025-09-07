// Mini Cart Component - Handles the mini cart display and interactions

import { CartService } from '../services/cart-service.js';

export class MiniCart {
    constructor() {
        this.cartService = new CartService();
        this.miniCartElement = document.querySelector('.mini-cart');
        this.cartIconElement = document.querySelector('.cart-icon');
        this.cartCountElement = document.querySelector('.cart-count');
        this.cartTotalElement = null;
        this.cartItemsElement = null;
        
        this.init();
    }
    
    // Initialize mini cart
    async init() {
        if (!this.miniCartElement || !this.cartIconElement) {
            console.error('Mini cart elements not found');
            return;
        }
        
        // Create mini cart structure if it doesn't exist
        if (this.miniCartElement.children.length === 0) {
            this.createMiniCartStructure();
        }
        
        // Set references to elements
        this.cartItemsElement = this.miniCartElement.querySelector('.cart-items');
        this.cartTotalElement = this.miniCartElement.querySelector('.cart-total-value');
        
        // Add event listeners
        this.addEventListeners();
        
        // Update cart display
        await this.updateCartDisplay();
    }
    
    // Create mini cart structure
    createMiniCartStructure() {
        this.miniCartElement.innerHTML = `
            <div class="mini-cart-header">
                <h3>Your Cart</h3>
                <button class="close-mini-cart">×</button>
            </div>
            <div class="cart-items"></div>
            <div class="cart-footer">
                <div class="cart-total">
                    <span>Total:</span>
                    <span class="cart-total-value">$0.00</span>
                </div>
                <div class="cart-actions">
                    <button class="btn view-cart">View Cart</button>
                    <button class="btn checkout">Checkout</button>
                </div>
            </div>
        `;
    }
    
    // Add event listeners
    addEventListeners() {
        // Toggle mini cart on cart icon click
        this.cartIconElement.addEventListener('click', () => {
            this.toggleMiniCart();
        });
        
        // Close mini cart on close button click
        const closeButton = this.miniCartElement.querySelector('.close-mini-cart');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.closeMiniCart();
            });
        }
        
        // Close mini cart when clicking outside
        document.addEventListener('click', (event) => {
            if (!this.miniCartElement.contains(event.target) && 
                !this.cartIconElement.contains(event.target) &&
                this.miniCartElement.classList.contains('active')) {
                this.closeMiniCart();
            }
        });
        
        // Checkout button
        const checkoutButton = this.miniCartElement.querySelector('.checkout');
        if (checkoutButton) {
            checkoutButton.addEventListener('click', () => {
                window.location.href = 'checkout.html';
            });
        }
        
        // View cart button (same as checkout for this simple app)
        const viewCartButton = this.miniCartElement.querySelector('.view-cart');
        if (viewCartButton) {
            viewCartButton.addEventListener('click', () => {
                window.location.href = 'checkout.html';
            });
        }
    }
    
    // Toggle mini cart visibility
    toggleMiniCart() {
        this.miniCartElement.classList.toggle('active');
    }
    
    // Close mini cart
    closeMiniCart() {
        this.miniCartElement.classList.remove('active');
    }
    
    // Update cart display
    async updateCartDisplay() {
        // Update cart count
        const cartCount = this.cartService.getCartCount();
        if (this.cartCountElement) {
            this.cartCountElement.textContent = cartCount;
            this.cartCountElement.style.display = cartCount > 0 ? 'flex' : 'none';
        }
        
        // Get cart items with product details
        const cartItems = await this.cartService.getCartItems();
        
        // Update cart items display
        if (this.cartItemsElement) {
            if (cartItems.length === 0) {
                this.cartItemsElement.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
            } else {
                this.cartItemsElement.innerHTML = '';
                
                // Add each cart item
                cartItems.forEach(item => {
                    const cartItemElement = this.createCartItemElement(item);
                    this.cartItemsElement.appendChild(cartItemElement);
                });
            }
        }
        
        // Update cart total
        if (this.cartTotalElement) {
            const total = await this.cartService.getCartTotal();
            this.cartTotalElement.textContent = `$${total.toFixed(2)}`;
        }
    }
    
    // Create cart item element
    createCartItemElement(item) {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.dataset.id = item.productId;
        
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.product.image}" alt="${item.product.title}">
            </div>
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.product.title}</h4>
                <div class="cart-item-price">$${item.product.price.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn increase">+</button>
                </div>
            </div>
            <button class="remove-item">×</button>
        `;
        
        // Add event listeners for quantity buttons
        const decreaseBtn = cartItem.querySelector('.decrease');
        decreaseBtn.addEventListener('click', async () => {
            try {
                if (item.quantity > 1) {
                    await this.cartService.updateQuantity(item.productId, item.quantity - 1);
                } else {
                    await this.cartService.removeFromCart(item.productId);
                }
                await this.updateCartDisplay();
            } catch (error) {
                console.error('Error updating quantity:', error);
            }
        });
        
        const increaseBtn = cartItem.querySelector('.increase');
        increaseBtn.addEventListener('click', async () => {
            try {
                await this.cartService.updateQuantity(item.productId, item.quantity + 1);
                await this.updateCartDisplay();
            } catch (error) {
                console.error('Error updating quantity:', error);
                alert(error.message);
            }
        });
        
        // Add event listener for remove button
        const removeBtn = cartItem.querySelector('.remove-item');
        removeBtn.addEventListener('click', async () => {
            try {
                await this.cartService.removeFromCart(item.productId);
                await this.updateCartDisplay();
            } catch (error) {
                console.error('Error removing item:', error);
            }
        });
        
        return cartItem;
    }
}