// Admin Dashboard - Main dashboard functionality

import { OrderService } from '../services/order-service.js';
import { ProductService } from '../services/product-service.js';

class Dashboard {
    constructor() {
        this.orderService = new OrderService();
        this.productService = new ProductService();
        
        this.init();
    }
    
    async init() {
        this.setupSidebar();
        await this.loadDashboardData();
    }
    
    setupSidebar() {
        const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
        
        // Highlight current page in sidebar
        sidebarLinks.forEach(link => {
            const currentPath = window.location.pathname;
            if (currentPath.includes(link.getAttribute('href'))) {
                link.classList.add('active');
            }
        });
    }
    
    async loadDashboardData() {
        try {
            await Promise.all([
                this.loadOrderStats(),
                this.loadProductStats(),
                this.loadRevenueStats(),
                this.loadRecentOrders(),
                this.loadTopProducts()
            ]);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.showError('Failed to load dashboard data. Please try again later.');
        }
    }
    
    async loadOrderStats() {
        const orderCount = await this.orderService.getOrderCount();
        const pendingOrders = (await this.orderService.getOrdersByStatus('pending')).length;
        
        document.querySelector('#order-count').textContent = orderCount;
        document.querySelector('#pending-orders').textContent = pendingOrders;
    }
    
    async loadProductStats() {
        const products = await this.productService.getProducts();
        const productCount = products.length;
        const lowStockCount = products.filter(product => product.stock < 5).length;
        
        document.querySelector('#product-count').textContent = productCount;
        document.querySelector('#low-stock-count').textContent = lowStockCount;
    }
    
    async loadRevenueStats() {
        const totalRevenue = await this.orderService.getTotalRevenue();
        document.querySelector('#total-revenue').textContent = `$${totalRevenue.toFixed(2)}`;
        
        // Get customer count (unique customers from orders)
        const orders = await this.orderService.getOrders();
        const uniqueCustomers = new Set();
        
        orders.forEach(order => {
            if (order.customer && order.customer.email) {
                uniqueCustomers.add(order.customer.email);
            }
        });
        
        document.querySelector('#customer-count').textContent = uniqueCustomers.size;
    }
    
    async loadRecentOrders() {
        const recentOrders = await this.orderService.getRecentOrders(5);
        const recentOrdersContainer = document.querySelector('#recent-orders tbody');
        
        if (!recentOrdersContainer) return;
        
        if (recentOrders.length === 0) {
            recentOrdersContainer.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">No orders found</td>
                </tr>
            `;
            return;
        }
        
        recentOrdersContainer.innerHTML = '';
        
        recentOrders.forEach(order => {
            const date = new Date(order.createdAt).toLocaleDateString();
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${order.id.substring(0, 8)}...</td>
                <td>${order.customer.name || 'N/A'}</td>
                <td>${date}</td>
                <td>$${order.total.toFixed(2)}</td>
                <td><span class="status-badge ${order.status}">${order.status}</span></td>
            `;
            
            recentOrdersContainer.appendChild(row);
        });
    }
    
    async loadTopProducts() {
        const products = await this.productService.getProducts();
        const topProducts = products
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 5);
            
        const topProductsContainer = document.querySelector('#top-products tbody');
        
        if (!topProductsContainer) return;
        
        if (topProducts.length === 0) {
            topProductsContainer.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center">No products found</td>
                </tr>
            `;
            return;
        }
        
        topProductsContainer.innerHTML = '';
        
        topProducts.forEach(product => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>
                    <div class="product-cell">
                        <img src="${product.image}" alt="${product.title}" class="product-img">
                        <span>${product.title}</span>
                    </div>
                </td>
                <td>${product.category}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>${product.rating} ★</td>
            `;
            
            topProductsContainer.appendChild(row);
        });
    }
    
    showError(message) {
        const alertElement = document.createElement('div');
        alertElement.className = 'alert alert-danger';
        alertElement.textContent = message;
        
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.prepend(alertElement);
            
            // Auto-remove after 5 seconds
            setTimeout(() => {
                alertElement.remove();
            }, 5000);
        }
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Dashboard();
});