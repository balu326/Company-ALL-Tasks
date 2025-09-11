// LuxeMarket - Admin Dashboard JavaScript

// Global state
let products = [];
let orders = [];
let currentEditProduct = null;
let salesChart = null;

// Initialize the admin dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
});

function initializeAdmin() {
    loadAdminData();
    setupAdminEventListeners();
    showTab('orders'); // Default tab
    updateAnalytics();
}

// Data Management
function loadAdminData() {
    // Load products from localStorage
    const savedProducts = localStorage.getItem('luxemarket_products');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    } else {
        products = [];
    }
    
    // Load orders from localStorage
    const savedOrders = localStorage.getItem('luxemarket_orders');
    if (savedOrders) {
        orders = JSON.parse(savedOrders);
    } else {
        orders = [];
    }
}

function saveProducts() {
    localStorage.setItem('luxemarket_products', JSON.stringify(products));
}

function saveOrders() {
    localStorage.setItem('luxemarket_orders', JSON.stringify(orders));
}

// Event Listeners
function setupAdminEventListeners() {
    // Tab navigation is handled by onclick in HTML
    // Form submission
    const productForm = document.getElementById('addProductForm');
    if (productForm) {
        productForm.addEventListener('submit', saveProduct);
    }
}

// Tab Management
function showTab(tabName) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.admin-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Remove active class from all nav buttons
    const navBtns = document.querySelectorAll('.admin-nav-btn');
    navBtns.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    const selectedTab = document.getElementById(tabName + 'Tab');
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Add active class to selected nav button
    const selectedNavBtn = document.querySelector(`[onclick="showTab('${tabName}')"]`);
    if (selectedNavBtn) {
        selectedNavBtn.classList.add('active');
    }
    
    // Load tab-specific content
    switch (tabName) {
        case 'orders':
            loadOrdersTable();
            break;
        case 'products':
            loadProductsTable();
            break;
        case 'analytics':
            updateAnalytics();
            renderSalesChart();
            break;
    }
}

// Orders Management
function loadOrdersTable() {
    const tableBody = document.getElementById('ordersTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (orders.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--secondary-color);">No orders found</td></tr>';
        return;
    }
    
    // Sort orders by date (newest first)
    const sortedOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedOrders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.items.length} items</td>
            <td>$${order.total.toFixed(2)}</td>
            <td><span class="status-badge status-${order.status}">${order.status}</span></td>
            <td>${new Date(order.date).toLocaleDateString()}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Products Management
function loadProductsTable() {
    const tableBody = document.getElementById('productsTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (products.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--secondary-color);">No products found</td></tr>';
        return;
    }
    
    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${product.image}" alt="${product.name}" class="product-thumbnail" 
                     onerror="this.src='https://via.placeholder.com/50x50/1a1a1a/d4af37?text=No+Image'">
            </td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${product.stock}</td>
            <td>
                <button class="btn btn-secondary" onclick="editProduct(${product.id})" style="margin-right: 0.5rem; font-size: 0.8rem; padding: 0.25rem 0.5rem;">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn" onclick="deleteProduct(${product.id})" style="background: var(--danger-color); color: white; font-size: 0.8rem; padding: 0.25rem 0.5rem;">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Product Form Management
function showAddProductForm() {
    currentEditProduct = null;
    document.getElementById('formTitle').textContent = 'Add New Product';
    document.getElementById('addProductForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('productForm').classList.remove('hidden');
    
    // Scroll to form
    document.getElementById('productForm').scrollIntoView({ behavior: 'smooth' });
}

function hideProductForm() {
    document.getElementById('productForm').classList.add('hidden');
    currentEditProduct = null;
}

function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    currentEditProduct = product;
    
    // Populate form
    document.getElementById('formTitle').textContent = 'Edit Product';
    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productImage').value = product.image;
    document.getElementById('productDescription').value = product.description;
    
    document.getElementById('productForm').classList.remove('hidden');
    
    // Scroll to form
    document.getElementById('productForm').scrollIntoView({ behavior: 'smooth' });
}

function saveProduct(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('productName').value.trim(),
        category: document.getElementById('productCategory').value,
        price: parseFloat(document.getElementById('productPrice').value),
        stock: parseInt(document.getElementById('productStock').value),
        image: document.getElementById('productImage').value.trim(),
        description: document.getElementById('productDescription').value.trim()
    };
    
    // Validate form data
    if (!formData.name || !formData.category || !formData.price || !formData.stock || !formData.image || !formData.description) {
        alert('Please fill in all fields');
        return;
    }
    
    if (formData.price <= 0) {
        alert('Price must be greater than 0');
        return;
    }
    
    if (formData.stock < 0) {
        alert('Stock cannot be negative');
        return;
    }
    
    const productId = document.getElementById('productId').value;
    
    if (productId) {
        // Edit existing product
        const existingProduct = products.find(p => p.id === parseInt(productId));
        if (existingProduct) {
            existingProduct.name = formData.name;
            existingProduct.category = formData.category;
            existingProduct.price = formData.price;
            existingProduct.stock = formData.stock;
            existingProduct.image = formData.image;
            existingProduct.description = formData.description;
            
            showToast('Product updated successfully!');
        }
    } else {
        // Add new product
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        const newProduct = {
            id: newId,
            ...formData
        };
        products.push(newProduct);
        
        showToast('Product added successfully!');
    }
    
    saveProducts();
    loadProductsTable();
    hideProductForm();
    updateAnalytics();
}

function deleteProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
        products = products.filter(p => p.id !== productId);
        saveProducts();
        loadProductsTable();
        updateAnalytics();
        showToast('Product deleted successfully!');
    }
}

// Analytics
function updateAnalytics() {
    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    document.getElementById('totalRevenue').textContent = `$${totalRevenue.toFixed(2)}`;
    
    // Calculate total orders
    document.getElementById('totalOrders').textContent = orders.length;
    
    // Calculate total products
    document.getElementById('totalProducts').textContent = products.length;
    
    // Calculate average order value
    const averageOrder = orders.length > 0 ? totalRevenue / orders.length : 0;
    document.getElementById('averageOrder').textContent = `$${averageOrder.toFixed(2)}`;
}

function renderSalesChart() {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;
    
    // Destroy existing chart if it exists
    if (salesChart) {
        salesChart.destroy();
    }
    
    // Calculate sales by category
    const salesByCategory = {};
    orders.forEach(order => {
        order.items.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (product) {
                const category = product.category;
                if (!salesByCategory[category]) {
                    salesByCategory[category] = 0;
                }
                salesByCategory[category] += item.price * item.quantity;
            }
        });
    });
    
    const labels = Object.keys(salesByCategory);
    const data = Object.values(salesByCategory);
    
    // Chart colors matching the luxury theme
    const colors = [
        'rgba(212, 175, 55, 0.8)',   // Gold
        'rgba(102, 126, 234, 0.8)',  // Blue
        'rgba(46, 213, 115, 0.8)',   // Green
        'rgba(255, 71, 87, 0.8)',    // Red
        'rgba(255, 193, 7, 0.8)',    // Yellow
        'rgba(156, 39, 176, 0.8)'    // Purple
    ];
    
    const borderColors = colors.map(color => color.replace('0.8', '1'));
    
    salesChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels.map(label => label.charAt(0).toUpperCase() + label.slice(1)),
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderColor: borderColors,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#ffffff',
                        font: {
                            family: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${context.label}: $${value.toFixed(2)} (${percentage}%)`;
                        }
                    }
                }
            },
            maintainAspectRatio: false
        }
    });
    
    // Set chart container height
    ctx.parentElement.style.height = '400px';
}

// Utility Functions
function showToast(message, type = 'success') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--card-bg);
        color: var(--primary-color);
        padding: 1rem 1.5rem;
        border-radius: 8px;
        border: 1px solid var(--glass-border);
        box-shadow: var(--shadow-medium);
        z-index: 4000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    if (type === 'success') {
        toast.style.borderLeftColor = 'var(--success-color)';
        toast.style.borderLeftWidth = '4px';
    } else if (type === 'error') {
        toast.style.borderLeftColor = 'var(--danger-color)';
        toast.style.borderLeftWidth = '4px';
    }
    
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Export functionality (optional)
function exportData() {
    const data = {
        products: products,
        orders: orders,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `luxemarket-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
}

// Auto-refresh data every 30 seconds to sync with storefront
setInterval(() => {
    loadAdminData();
    
    // Refresh current tab
    const activeTab = document.querySelector('.admin-tab.active');
    if (activeTab) {
        const tabId = activeTab.id.replace('Tab', '');
        if (tabId === 'orders') {
            loadOrdersTable();
        } else if (tabId === 'products') {
            loadProductsTable();
        } else if (tabId === 'analytics') {
            updateAnalytics();
            renderSalesChart();
        }
    }
}, 30000);

// Initialize sample data for demo purposes
function initializeSampleData() {
    if (products.length === 0) {
        // Add sample products if none exist
        products = [
            {
                id: 1,
                name: "Diamond Elegance Necklace",
                category: "jewelry",
                price: 2499.99,
                stock: 5,
                image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&w=500",
                description: "Exquisite diamond necklace featuring premium cut diamonds in an elegant setting. Perfect for special occasions and formal events."
            },
            {
                id: 2,
                name: "Swiss Luxury Watch",
                category: "watches",
                price: 3299.99,
                stock: 3,
                image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?ixlib=rb-4.0.3&w=500",
                description: "Precision Swiss timepiece with automatic movement, sapphire crystal, and leather strap. A masterpiece of horological excellence."
            }
        ];
        saveProducts();
    }
    
    if (orders.length === 0) {
        // Add sample orders if none exist
        orders = [
            {
                id: 'LM1234567890',
                customer: 'John Doe',
                items: [
                    { id: 1, name: 'Diamond Elegance Necklace', price: 2499.99, quantity: 1 }
                ],
                total: 2499.99,
                status: 'completed',
                date: new Date(Date.now() - 86400000).toISOString() // Yesterday
            },
            {
                id: 'LM1234567891',
                customer: 'Jane Smith',
                items: [
                    { id: 2, name: 'Swiss Luxury Watch', price: 3299.99, quantity: 1 }
                ],
                total: 3299.99,
                status: 'pending',
                date: new Date().toISOString() // Today
            }
        ];
        saveOrders();
    }
}

// Call initialize sample data on first load
// initializeSampleData();
