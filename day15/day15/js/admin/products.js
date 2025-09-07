// Admin Products - Products management functionality

import { ProductService } from '../services/product-service.js';

class ProductsManager {
    constructor() {
        this.productService = new ProductService();
        this.products = [];
        this.filteredProducts = [];
        this.currentPage = 1;
        this.productsPerPage = 10;
        
        this.init();
    }
    
    async init() {
        this.setupSidebar();
        await this.loadProducts();
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
    
    async loadProducts() {
        try {
            this.products = await this.productService.getProducts();
            this.filteredProducts = [...this.products];
            this.renderProducts();
            this.populateCategories();
        } catch (error) {
            console.error('Error loading products:', error);
            this.showError('Failed to load products. Please try again later.');
        }
    }
    
    populateCategories() {
        const categoryFilter = document.querySelector('#category-filter');
        if (!categoryFilter) return;
        
        // Get unique categories
        const categories = [...new Set(this.products.map(product => product.category))];
        
        // Clear existing options except the first one (All)
        while (categoryFilter.options.length > 1) {
            categoryFilter.remove(1);
        }
        
        // Add category options
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            categoryFilter.appendChild(option);
        });
    }
    
    setupEventListeners() {
        // Search input
        const searchInput = document.querySelector('#product-search');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                this.filterProducts();
            });
        }
        
        // Category filter
        const categoryFilter = document.querySelector('#category-filter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => {
                this.filterProducts();
            });
        }
        
        // Stock filter
        const stockFilter = document.querySelector('#stock-filter');
        if (stockFilter) {
            stockFilter.addEventListener('change', () => {
                this.filterProducts();
            });
        }
        
        // Add new product button
        const addProductBtn = document.querySelector('#add-product-btn');
        if (addProductBtn) {
            addProductBtn.addEventListener('click', () => {
                this.showAddProductModal();
            });
        }
        
        // Edit product button
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('edit-product-btn')) {
                const productId = event.target.dataset.id;
                this.showEditProductModal(productId);
            }
        });
        
        // Delete product button
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('delete-product-btn')) {
                const productId = event.target.dataset.id;
                this.showDeleteConfirmation(productId);
            }
        });
        
        // Save product button (for both add and edit)
        const saveProductBtn = document.querySelector('#save-product-btn');
        if (saveProductBtn) {
            saveProductBtn.addEventListener('click', async () => {
                const isEdit = saveProductBtn.dataset.mode === 'edit';
                const productId = saveProductBtn.dataset.id;
                
                if (isEdit) {
                    await this.updateProduct(productId);
                } else {
                    await this.addProduct();
                }
            });
        }
        
        // Confirm delete button
        const confirmDeleteBtn = document.querySelector('#confirm-delete-btn');
        if (confirmDeleteBtn) {
            confirmDeleteBtn.addEventListener('click', async () => {
                const productId = confirmDeleteBtn.dataset.id;
                await this.deleteProduct(productId);
            });
        }
        
        // Close modal buttons
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
    
    filterProducts() {
        const searchTerm = document.querySelector('#product-search').value.toLowerCase();
        const categoryFilter = document.querySelector('#category-filter').value;
        const stockFilter = document.querySelector('#stock-filter').value;
        
        this.filteredProducts = this.products.filter(product => {
            // Search term filter
            const matchesSearch = 
                product.title.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm);
            
            // Category filter
            let matchesCategory = true;
            if (categoryFilter) {
                matchesCategory = product.category === categoryFilter;
            }
            
            // Stock filter
            let matchesStock = true;
            if (stockFilter === 'in-stock') {
                matchesStock = product.stock > 0;
            } else if (stockFilter === 'out-of-stock') {
                matchesStock = product.stock <= 0;
            } else if (stockFilter === 'low-stock') {
                matchesStock = product.stock > 0 && product.stock < 5;
            }
            
            return matchesSearch && matchesCategory && matchesStock;
        });
        
        this.currentPage = 1;
        this.renderProducts();
    }
    
    renderProducts() {
        const productsTableBody = document.querySelector('#products-table tbody');
        
        if (!productsTableBody) return;
        
        if (this.filteredProducts.length === 0) {
            productsTableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center">No products found</td>
                </tr>
            `;
            return;
        }
        
        // Calculate pagination
        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        const productsToDisplay = this.filteredProducts.slice(startIndex, endIndex);
        
        productsTableBody.innerHTML = '';
        
        productsToDisplay.forEach(product => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>
                    <div class="product-cell">
                        <img src="${product.image}" alt="${product.title}" class="product-img">
                    </div>
                </td>
                <td>${product.title}</td>
                <td>${product.category}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>
                    <span class="${product.stock <= 0 ? 'out-of-stock' : product.stock < 5 ? 'low-stock' : ''}">
                        ${product.stock}
                    </span>
                </td>
                <td>${product.rating} ★</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn edit-product-btn" data-id="${product.id}">Edit</button>
                        <button class="btn delete-product-btn" data-id="${product.id}">Delete</button>
                    </div>
                </td>
            `;
            
            productsTableBody.appendChild(row);
        });
        
        this.renderPagination();
    }
    
    renderPagination() {
        const paginationContainer = document.querySelector('.pagination');
        
        if (!paginationContainer) return;
        
        const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
        
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
                    this.renderProducts();
                }
            });
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                if (this.currentPage < totalPages) {
                    this.currentPage++;
                    this.renderProducts();
                }
            });
        }
        
        pageButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.currentPage = parseInt(button.textContent);
                this.renderProducts();
            });
        });
    }
    
    showAddProductModal() {
        const modal = document.querySelector('#product-modal');
        const modalTitle = modal.querySelector('.modal-title');
        const saveButton = modal.querySelector('#save-product-btn');
        const form = modal.querySelector('#product-form');
        
        // Set modal title and button text
        modalTitle.textContent = 'Add New Product';
        saveButton.textContent = 'Add Product';
        saveButton.dataset.mode = 'add';
        saveButton.dataset.id = '';
        
        // Reset form
        form.reset();
        
        // Show modal
        modal.classList.add('active');
    }
    
    async showEditProductModal(productId) {
        try {
            const product = await this.productService.getProductById(productId);
            
            if (!product) {
                this.showError('Product not found');
                return;
            }
            
            const modal = document.querySelector('#product-modal');
            const modalTitle = modal.querySelector('.modal-title');
            const saveButton = modal.querySelector('#save-product-btn');
            const form = modal.querySelector('#product-form');
            
            // Set modal title and button text
            modalTitle.textContent = 'Edit Product';
            saveButton.textContent = 'Update Product';
            saveButton.dataset.mode = 'edit';
            saveButton.dataset.id = productId;
            
            // Fill form with product data
            form.elements['product-title'].value = product.title;
            form.elements['product-price'].value = product.price;
            form.elements['product-category'].value = product.category;
            form.elements['product-image'].value = product.image;
            form.elements['product-stock'].value = product.stock;
            form.elements['product-rating'].value = product.rating;
            form.elements['product-description'].value = product.description;
            
            // Show modal
            modal.classList.add('active');
            
        } catch (error) {
            console.error('Error showing edit product modal:', error);
            this.showError('Failed to load product details');
        }
    }
    
    showDeleteConfirmation(productId) {
        const modal = document.querySelector('#delete-modal');
        const confirmButton = modal.querySelector('#confirm-delete-btn');
        
        // Set product ID to confirm button
        confirmButton.dataset.id = productId;
        
        // Show modal
        modal.classList.add('active');
    }
    
    async addProduct() {
        try {
            const form = document.querySelector('#product-form');
            
            // Validate form
            if (!this.validateProductForm(form)) {
                return;
            }
            
            // Get form data
            const productData = {
                title: form.elements['product-title'].value,
                price: parseFloat(form.elements['product-price'].value),
                category: form.elements['product-category'].value,
                image: form.elements['product-image'].value,
                stock: parseInt(form.elements['product-stock'].value),
                rating: parseFloat(form.elements['product-rating'].value),
                description: form.elements['product-description'].value
            };
            
            // Add product
            await this.productService.addProduct(productData);
            
            // Close modal
            const modal = document.querySelector('#product-modal');
            modal.classList.remove('active');
            
            // Reload products
            await this.loadProducts();
            
            this.showSuccess('Product added successfully');
            
        } catch (error) {
            console.error('Error adding product:', error);
            this.showError('Failed to add product');
        }
    }
    
    async updateProduct(productId) {
        try {
            const form = document.querySelector('#product-form');
            
            // Validate form
            if (!this.validateProductForm(form)) {
                return;
            }
            
            // Get form data
            const productData = {
                title: form.elements['product-title'].value,
                price: parseFloat(form.elements['product-price'].value),
                category: form.elements['product-category'].value,
                image: form.elements['product-image'].value,
                stock: parseInt(form.elements['product-stock'].value),
                rating: parseFloat(form.elements['product-rating'].value),
                description: form.elements['product-description'].value
            };
            
            // Update product
            await this.productService.updateProduct(productId, productData);
            
            // Close modal
            const modal = document.querySelector('#product-modal');
            modal.classList.remove('active');
            
            // Reload products
            await this.loadProducts();
            
            this.showSuccess('Product updated successfully');
            
        } catch (error) {
            console.error('Error updating product:', error);
            this.showError('Failed to update product');
        }
    }
    
    async deleteProduct(productId) {
        try {
            // Delete product
            await this.productService.deleteProduct(productId);
            
            // Close modal
            const modal = document.querySelector('#delete-modal');
            modal.classList.remove('active');
            
            // Reload products
            await this.loadProducts();
            
            this.showSuccess('Product deleted successfully');
            
        } catch (error) {
            console.error('Error deleting product:', error);
            this.showError('Failed to delete product');
        }
    }
    
    validateProductForm(form) {
        // Check required fields
        const title = form.elements['product-title'].value;
        const price = form.elements['product-price'].value;
        const category = form.elements['product-category'].value;
        const image = form.elements['product-image'].value;
        const stock = form.elements['product-stock'].value;
        const rating = form.elements['product-rating'].value;
        
        if (!title || !price || !category || !image || !stock || !rating) {
            this.showError('Please fill in all required fields');
            return false;
        }
        
        // Validate price
        if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
            this.showError('Price must be a positive number');
            return false;
        }
        
        // Validate stock
        if (isNaN(parseInt(stock)) || parseInt(stock) < 0) {
            this.showError('Stock must be a non-negative integer');
            return false;
        }
        
        // Validate rating
        if (isNaN(parseFloat(rating)) || parseFloat(rating) < 0 || parseFloat(rating) > 5) {
            this.showError('Rating must be a number between 0 and 5');
            return false;
        }
        
        return true;
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

// Initialize products manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProductsManager();
});