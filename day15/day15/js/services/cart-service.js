// Cart Service - Handles cart operations and state management

import { ProductService } from './product-service.js';

export class CartService {
    constructor() {
        this.cart = [];
        this.productService = new ProductService();
        
        // Initialize from localStorage if available
        this.initFromStorage();
    }
    
    // Initialize cart from localStorage
    initFromStorage() {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            try {
                this.cart = JSON.parse(storedCart);
            } catch (error) {
                console.error('Failed to parse cart from localStorage:', error);
                this.cart = [];
            }
        }
    }
    
    // Save cart to localStorage
    saveToStorage() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }
    
    // Get cart items
    async getCartItems() {
        // Fetch full product details for each cart item
        const cartWithDetails = await Promise.all(
            this.cart.map(async (item) => {
                const product = await this.productService.getProductById(item.productId);
                return {
                    ...item,
                    product
                };
            })
        );
        
        return cartWithDetails;
    }
    
    // Add item to cart
    async addToCart(productId, quantity = 1) {
        // Check if product exists and has enough stock
        const product = await this.productService.getProductById(productId);
        
        if (!product) {
            throw new Error('Product not found');
        }
        
        if (product.stock < quantity) {
            throw new Error('Not enough stock available');
        }
        
        // Check if product is already in cart
        const existingItem = this.cart.find(item => item.productId === productId);
        
        if (existingItem) {
            // Update quantity if product already in cart
            existingItem.quantity += quantity;
        } else {
            // Add new item to cart
            this.cart.push({
                productId,
                quantity,
                addedAt: new Date().toISOString()
            });
        }
        
        this.saveToStorage();
        return this.cart;
    }
    
    // Update cart item quantity
    async updateQuantity(productId, quantity) {
        if (quantity <= 0) {
            return this.removeFromCart(productId);
        }
        
        // Check if product exists and has enough stock
        const product = await this.productService.getProductById(productId);
        
        if (!product) {
            throw new Error('Product not found');
        }
        
        if (product.stock < quantity) {
            throw new Error('Not enough stock available');
        }
        
        const itemIndex = this.cart.findIndex(item => item.productId === productId);
        
        if (itemIndex === -1) {
            throw new Error('Item not found in cart');
        }
        
        this.cart[itemIndex].quantity = quantity;
        this.saveToStorage();
        
        return this.cart;
    }
    
    // Remove item from cart
    removeFromCart(productId) {
        const itemIndex = this.cart.findIndex(item => item.productId === productId);
        
        if (itemIndex === -1) {
            throw new Error('Item not found in cart');
        }
        
        this.cart.splice(itemIndex, 1);
        this.saveToStorage();
        
        return this.cart;
    }
    
    // Clear cart
    clearCart() {
        this.cart = [];
        this.saveToStorage();
        return this.cart;
    }
    
    // Get cart count
    getCartCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }
    
    // Calculate cart total
    async getCartTotal() {
        const cartItems = await this.getCartItems();
        
        return cartItems.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);
    }
}