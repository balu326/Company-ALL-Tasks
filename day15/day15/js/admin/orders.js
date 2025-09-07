// Admin Orders - Orders management functionality

import { OrderService } from '../services/order-service.js';

class OrdersManager {
    constructor() {
        this.orderService = new OrderService();
        this.orders = [];
        this.filteredOrders = [];
        this.currentPage = 1;
        this.ordersPerPage = 10;
        
        this.init();
    }
    
    async init() {
        this.setupSidebar();
        await this.loadOrders();
        this.setupEventListeners();
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
    
    async loadOrders() {
        try {
            this.orders = await this.orderService.getOrders();
            this.filteredOrders = [...this.orders];
            this.renderOrders();
        } catch (error) {
            console.error('Error loading orders:', error);
            this.showError('Failed to load orders. Please try again later.');
        }
    }
    
    setupEventListeners() {
        // Search input
        const searchInput = document.querySelector('#order-search');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                this.filterOrders();
            });
        }
        
        // Date filter
        const dateFilter = document.querySelector('#date-filter');
        if (dateFilter) {
            dateFilter.addEventListener('change', () => {
                this.filterOrders();
            });
        }
        
        // Status filter
        const statusFilter = document.querySelector('#status-filter');
        if (statusFilter) {
            statusFilter.addEventListener('change', () => {
                this.filterOrders();
            });
        }
        
        // Order details modal
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('view-order-btn')) {
                const orderId = event.target.dataset.id;
                this.showOrderDetails(orderId);
            }
        });
        
        // Update order status
        document.addEventListener('click', async (event) => {
            if (event.target.classList.contains('update-status-btn')) {
                const orderId = event.target.dataset.id;
                const status = document.querySelector('#order-status-select').value;
                await this.updateOrderStatus(orderId, status);
            }
        });
        
        // Close modal
        const closeModalButtons = document.querySelectorAll('.close-modal');
        closeModalButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modal = button.closest('.modal');
                if (modal) {
                    modal.classList.remove('active');
                }
            });
        });
        
        // Close modal when clicking outside
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('modal')) {
                event.target.classList.remove('active');
            }
        });
    }
    
    filterOrders() {
        const searchTerm = document.querySelector('#order-search').value.toLowerCase();
        const dateFilter = document.querySelector('#date-filter').value;
        const statusFilter = document.querySelector('#status-filter').value;
        
        this.filteredOrders = this.orders.filter(order => {
            // Search term filter
            const matchesSearch = 
                order.id.toLowerCase().includes(searchTerm) ||
                (order.customer.name && order.customer.name.toLowerCase().includes(searchTerm)) ||
                (order.customer.email && order.customer.email.toLowerCase().includes(searchTerm));
            
            // Date filter
            let matchesDate = true;
            if (dateFilter) {
                const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
                matchesDate = orderDate === dateFilter;
            }
            
            // Status filter
            let matchesStatus = true;
            if (statusFilter) {
                matchesStatus = order.status === statusFilter;
            }
            
            return matchesSearch && matchesDate && matchesStatus;
        });
        
        this.currentPage = 1;
        this.renderOrders();
    }
    
    renderOrders() {
        const ordersTableBody = document.querySelector('#orders-table tbody');
        
        if (!ordersTableBody) return;
        
        if (this.filteredOrders.length === 0) {
            ordersTableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center">No orders found</td>
                </tr>
            `;
            return;
        }
        
        // Calculate pagination
        const startIndex = (this.currentPage - 1) * this.ordersPerPage;
        const endIndex = startIndex + this.ordersPerPage;
        const ordersToDisplay = this.filteredOrders.slice(startIndex, endIndex);
        
        ordersTableBody.innerHTML = '';
        
        ordersToDisplay.forEach(order => {
            const date = new Date(order.createdAt).toLocaleDateString();
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${order.id.substring(0, 8)}...</td>
                <td>${order.customer.name || 'N/A'}</td>
                <td>${date}</td>
                <td>${order.items.length}</td>
                <td>$${order.total.toFixed(2)}</td>
                <td><span class="status-badge ${order.status}">${order.status}</span></td>
                <td>
                    <button class="btn view-order-btn" data-id="${order.id}">View</button>
                </td>
            `;
            
            ordersTableBody.appendChild(row);
        });
        
        this.renderPagination();
    }
    
    renderPagination() {
        const paginationContainer = document.querySelector('.pagination');
        
        if (!paginationContainer) return;
        
        const totalPages = Math.ceil(this.filteredOrders.length / this.ordersPerPage);
        
        let paginationHTML = '';
        
        // Previous button
        paginationHTML += `
            <button class="pagination-btn prev" ${this.currentPage === 1 ? 'disabled' : ''}>
                &laquo; Previous
            </button>
        `;
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `
                <button class="pagination-btn page-num ${i === this.currentPage ? 'active' : ''}">
                    ${i}
                </button>
            `;
        }
        
        // Next button
        paginationHTML += `
            <button class="pagination-btn next" ${this.currentPage === totalPages ? 'disabled' : ''}>
                Next &raquo;
            </button>
        `;
        
        paginationContainer.innerHTML = paginationHTML;
        
        // Add event listeners to pagination buttons
        const prevButton = paginationContainer.querySelector('.prev');
        const nextButton = paginationContainer.querySelector('.next');
        const pageButtons = paginationContainer.querySelectorAll('.page-num');
        
        if (prevButton) {
            prevButton.addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.renderOrders();
                }
            });
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                if (this.currentPage < totalPages) {
                    this.currentPage++;
                    this.renderOrders();
                }
            });
        }
        
        pageButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.currentPage = parseInt(button.textContent);
                this.renderOrders();
            });
        });
    }
    
    async showOrderDetails(orderId) {
        try {
            const order = await this.orderService.getOrderById(orderId);
            
            if (!order) {
                this.showError('Order not found');
                return;
            }
            
            const modal = document.querySelector('#order-details-modal');
            const orderIdElement = modal.querySelector('#order-id');
            const orderDateElement = modal.querySelector('#order-date');
            const customerNameElement = modal.querySelector('#customer-name');
            const customerEmailElement = modal.querySelector('#customer-email');
            const customerAddressElement = modal.querySelector('#customer-address');
            const orderItemsElement = modal.querySelector('#order-items');
            const orderTotalElement = modal.querySelector('#order-total');
            const orderStatusSelect = modal.querySelector('#order-status-select');
            const updateStatusBtn = modal.querySelector('.update-status-btn');
            
            // Set order details
            orderIdElement.textContent = order.id;
            orderDateElement.textContent = new Date(order.createdAt).toLocaleString();
            customerNameElement.textContent = order.customer.name || 'N/A';
            customerEmailElement.textContent = order.customer.email || 'N/A';
            customerAddressElement.textContent = order.customer.address || 'N/A';
            orderTotalElement.textContent = `$${order.total.toFixed(2)}`;
            
            // Set order items
            orderItemsElement.innerHTML = '';
            order.items.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'order-item';
                itemElement.innerHTML = `
                    <div class="item-name">${item.title}</div>
                    <div class="item-details">
                        <span>${item.quantity} × $${item.price.toFixed(2)}</span>
                        <span>$${item.subtotal.toFixed(2)}</span>
                    </div>
                `;
                orderItemsElement.appendChild(itemElement);
            });
            
            // Set order status select
            orderStatusSelect.value = order.status;
            
            // Set update status button data-id
            updateStatusBtn.dataset.id = order.id;
            
            // Show modal
            modal.classList.add('active');
            
        } catch (error) {
            console.error('Error showing order details:', error);
            this.showError('Failed to load order details');
        }
    }
    
    async updateOrderStatus(orderId, status) {
        try {
            await this.orderService.updateOrderStatus(orderId, status);
            
            // Update orders list
            await this.loadOrders();
            
            // Close modal
            const modal = document.querySelector('#order-details-modal');
            modal.classList.remove('active');
            
            this.showSuccess('Order status updated successfully');
            
        } catch (error) {
            console.error('Error updating order status:', error);
            this.showError('Failed to update order status');
        }
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
    
    showSuccess(message) {
        const alertElement = document.createElement('div');
        alertElement.className = 'alert alert-success';
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

// Initialize orders manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new OrdersManager();
});