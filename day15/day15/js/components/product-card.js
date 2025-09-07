// Product Card Component - Renders a product card for the product gallery

export function createProductCard(product, onAddToCart) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = product.id;
    
    // Create star rating display
    const stars = generateStarRating(product.rating);
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.title}">
        </div>
        <div class="product-info">
            <h3 class="product-title">${product.title}</h3>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <div class="product-rating">${stars}</div>
        </div>
        <div class="product-actions">
            <button class="btn view-details">View Details</button>
            <button class="btn add-to-cart" ${product.stock <= 0 ? 'disabled' : ''}>
                ${product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
        </div>
    `;
    
    // Add event listeners
    const viewDetailsBtn = card.querySelector('.view-details');
    viewDetailsBtn.addEventListener('click', () => {
        window.location.href = `product.html?id=${product.id}`;
    });
    
    const addToCartBtn = card.querySelector('.add-to-cart');
    if (product.stock > 0) {
        addToCartBtn.addEventListener('click', () => {
            if (typeof onAddToCart === 'function') {
                onAddToCart(product.id);
            }
        });
    }
    
    return card;
}

// Generate star rating HTML
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let starsHTML = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<span class="star full">★</span>';
    }
    
    // Half star
    if (halfStar) {
        starsHTML += '<span class="star half">★</span>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<span class="star empty">☆</span>';
    }
    
    return `<div class="stars">${starsHTML}</div> <span class="rating-value">(${rating})</span>`;
}