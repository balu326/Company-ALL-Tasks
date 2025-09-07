// Admin Analytics - Analytics functionality

import { OrderService } from '../services/order-service.js';
import { ProductService } from '../services/product-service.js';

class Analytics {
    constructor() {
        this.orderService = new OrderService();
        this.productService = new ProductService();
        this.orders = [];
        this.products = [];
        
        this.init();
    }
    
    async init() {
        this.setupSidebar();
        await this.loadData();
        this.setupEventListeners();
        this.renderAnalytics();
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
    
    async loadData() {
        try {
            // Load orders and products
            this.orders = await this.orderService.getOrders();
            this.products = await this.productService.getProducts();
        } catch (error) {
            console.error('Error loading data:', error);
            this.showError('Failed to load data. Please try again later.');
        }
    }
    
    setupEventListeners() {
        // Date range filter
        const dateRangeSelect = document.querySelector('#date-range');
        if (dateRangeSelect) {
            dateRangeSelect.addEventListener('change', () => {
                this.renderAnalytics();
            });
        }
        
        // Custom date range
        const startDateInput = document.querySelector('#start-date');
        const endDateInput = document.querySelector('#end-date');
        
        if (startDateInput && endDateInput) {
            startDateInput.addEventListener('change', () => {
                if (dateRangeSelect.value === 'custom') {
                    this.renderAnalytics();
                }
            });
            
            endDateInput.addEventListener('change', () => {
                if (dateRangeSelect.value === 'custom') {
                    this.renderAnalytics();
                }
            });
        }
    }
    
    renderAnalytics() {
        const filteredOrders = this.getFilteredOrders();
        
        this.renderSalesOverview(filteredOrders);
        this.renderRevenueByCategory(filteredOrders);
        this.renderTopSellingProducts(filteredOrders);
    }
    
    getFilteredOrders() {
        const dateRangeSelect = document.querySelector('#date-range');
        const startDateInput = document.querySelector('#start-date');
        const endDateInput = document.querySelector('#end-date');
        
        if (!dateRangeSelect) return this.orders;
        
        const dateRange = dateRangeSelect.value;
        const now = new Date();
        let startDate, endDate;
        
        switch (dateRange) {
            case 'today':
                startDate = new Date(now.setHours(0, 0, 0, 0));
                endDate = new Date();
                break;
            case 'yesterday':
                startDate = new Date(now.setDate(now.getDate() - 1));
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date(startDate);
                endDate.setHours(23, 59, 59, 999);
                break;
            case 'last7days':
                startDate = new Date(now.setDate(now.getDate() - 7));
                endDate = new Date();
                break;
            case 'last30days':
                startDate = new Date(now.setDate(now.getDate() - 30));
                endDate = new Date();
                break;
            case 'thisMonth':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date();
                break;
            case 'lastMonth':
                startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                endDate = new Date(now.getFullYear(), now.getMonth(), 0);
                break;
            case 'custom':
                if (startDateInput && endDateInput && startDateInput.value && endDateInput.value) {
                    startDate = new Date(startDateInput.value);
                    endDate = new Date(endDateInput.value);
                    endDate.setHours(23, 59, 59, 999);
                } else {
                    return this.orders;
                }
                break;
            default:
                return this.orders;
        }
        
        return this.orders.filter(order => {
            const orderDate = new Date(order.createdAt);
            return orderDate >= startDate && orderDate <= endDate;
        });
    }
    
    renderSalesOverview(filteredOrders) {
        const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
        const totalOrders = filteredOrders.length;
        const totalItems = filteredOrders.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
        
        // Calculate average order value
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        
        // Update UI
        document.querySelector('#total-revenue-value').textContent = `$${totalRevenue.toFixed(2)}`;
        document.querySelector('#total-orders-value').textContent = totalOrders;
        document.querySelector('#total-items-value').textContent = totalItems;
        document.querySelector('#average-order-value').textContent = `$${averageOrderValue.toFixed(2)}`;
    }
    
    renderRevenueByCategory(filteredOrders) {
        // Get all product categories
        const categories = [...new Set(this.products.map(product => product.category))];
        
        // Calculate revenue by category
        const categoryRevenue = {};
        
        // Initialize categories with zero revenue
        categories.forEach(category => {
            categoryRevenue[category] = 0;
        });
        
        // Calculate revenue for each category
        filteredOrders.forEach(order => {
            order.items.forEach(item => {
                const product = this.products.find(p => p.id === item.productId);
                if (product) {
                    categoryRevenue[product.category] += item.subtotal;
                }
            });
        });
        
        // Sort categories by revenue
        const sortedCategories = Object.keys(categoryRevenue).sort((a, b) => categoryRevenue[b] - categoryRevenue[a]);
        
        // Render chart (simplified version with bars)
        const chartContainer = document.querySelector('#category-revenue-chart');
        if (!chartContainer) return;
        
        chartContainer.innerHTML = '';
        
        sortedCategories.forEach(category => {
            const revenue = categoryRevenue[category];
            const totalRevenue = Object.values(categoryRevenue).reduce((sum, val) => sum + val, 0);
            const percentage = totalRevenue > 0 ? (revenue / totalRevenue) * 100 : 0;
            
            const barContainer = document.createElement('div');
            barContainer.className = 'chart-bar-container';
            
            barContainer.innerHTML = `
                <div class="chart-label">${category}</div>
                <div class="chart-bar-wrapper">
                    <div class="chart-bar" style="width: ${percentage}%"></div>
                </div>
                <div class="chart-value">$${revenue.toFixed(2)} (${percentage.toFixed(1)}%)</div>
            `;
            
            chartContainer.appendChild(barContainer);
        });
    }
    
    renderTopSellingProducts(filteredOrders) {
        // Calculate product sales
        const productSales = {};
        
        filteredOrders.forEach(order => {
            order.items.forEach(item => {
                if (!productSales[item.productId]) {
                    productSales[item.productId] = {
                        id: item.productId,
                        title: item.title,
                        quantity: 0,
                        revenue: 0
                    };
                }
                
                productSales[item.productId].quantity += item.quantity;
                productSales[item.productId].revenue += item.subtotal;
            });
        });
        
        // Convert to array and sort by quantity
        const sortedProducts = Object.values(productSales).sort((a, b) => b.quantity - a.quantity);
        
        // Get top 5 products
        const topProducts = sortedProducts.slice(0, 5);
        
        // Render table
        const tableBody = document.querySelector('#top-products-table tbody');
        if (!tableBody) return;
        
        if (topProducts.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="3" class="text-center">No data available</td>
                </tr>
            `;
            return;
        }
        
        tableBody.innerHTML = '';
        
        topProducts.forEach(product => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${product.title}</td>
                <td>${product.quantity}</td>
                <td>$${product.revenue.toFixed(2)}</td>
            `;
            
            tableBody.appendChild(row);
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

// Initialize analytics when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Analytics();
});