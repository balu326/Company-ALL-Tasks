// LuxeMarket - Storefront JavaScript

// Global state
let products = [];
let cart = [];
let filteredProducts = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    loadData();
    setupEventListeners();
    displayProducts();
    updateCartCount();
}

// Data Management
function loadData() {
    // Load products from localStorage or initialize with sample data
    const savedProducts = localStorage.getItem('luxemarket_products');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    } else {
        products = getSampleProducts();
        saveProducts();
    }
    
    // Load cart from localStorage
    const savedCart = localStorage.getItem('luxemarket_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    
    filteredProducts = [...products];
}

function saveProducts() {
    localStorage.setItem('luxemarket_products', JSON.stringify(products));
}

function saveCart() {
    localStorage.setItem('luxemarket_cart', JSON.stringify(cart));
}

function getSampleProducts() {
    return [
        // JEWELRY CATEGORY
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
            name: "Pearl Drop Earrings",
            category: "jewelry",
            price: 899.99,
            stock: 12,
            image: "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?ixlib=rb-4.0.3&w=500",
            description: "Cultured pearl earrings with sterling silver settings. Timeless elegance that complements any sophisticated look."
        },
        {
            id: 3,
            name: "Emerald Tennis Bracelet",
            category: "jewelry",
            price: 3799.99,
            stock: 4,
            image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&w=500",
            description: "Stunning emerald tennis bracelet set in platinum. Features carefully selected emeralds of exceptional clarity and color."
        },
        {
            id: 4,
            name: "Ruby Solitaire Ring",
            category: "jewelry",
            price: 4299.99,
            stock: 3,
            image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&w=500",
            description: "Magnificent ruby solitaire ring in 18K white gold. Features a 2-carat Burmese ruby with exceptional fire and brilliance."
        },
        {
            id: 5,
            name: "Sapphire Halo Pendant",
            category: "jewelry",
            price: 1899.99,
            stock: 8,
            image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&w=500",
            description: "Ceylon sapphire surrounded by brilliant-cut diamonds in a classic halo setting. Includes matching 18-inch chain."
        },
        {
            id: 6,
            name: "Vintage Art Deco Brooch",
            category: "jewelry",
            price: 1299.99,
            stock: 6,
            image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&w=500",
            description: "Authentic 1920s platinum brooch with geometric diamond pattern. A rare collector's piece from the Art Deco era."
        },
        {
            id: 7,
            name: "Black Pearl Statement Earrings",
            category: "jewelry",
            price: 1599.99,
            stock: 10,
            image: "https://images.unsplash.com/photo-1596944924591-4e756dc5b0d5?ixlib=rb-4.0.3&w=500",
            description: "Tahitian black pearl earrings with rose gold accents. Each pearl is hand-selected for its lustrous nacre."
        },
        {
            id: 8,
            name: "Infinity Diamond Band",
            category: "jewelry",
            price: 2799.99,
            stock: 7,
            image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&w=500",
            description: "Elegant infinity symbol ring with pave diamonds. Crafted in 14K rose gold with conflict-free diamonds."
        },
        
        // WATCHES CATEGORY
        {
            id: 9,
            name: "Swiss Luxury Watch",
            category: "watches",
            price: 3299.99,
            stock: 3,
            image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?ixlib=rb-4.0.3&w=500",
            description: "Precision Swiss timepiece with automatic movement, sapphire crystal, and leather strap. A masterpiece of horological excellence."
        },
        {
            id: 10,
            name: "Titanium Sports Watch",
            category: "watches",
            price: 1599.99,
            stock: 6,
            image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?ixlib=rb-4.0.3&w=500",
            description: "Lightweight titanium construction with water resistance and chronograph features. Perfect for the active luxury lifestyle."
        },
        {
            id: 11,
            name: "Rose Gold Dress Watch",
            category: "watches",
            price: 2899.99,
            stock: 4,
            image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?ixlib=rb-4.0.3&w=500",
            description: "Elegant rose gold watch with mother-of-pearl dial and diamond hour markers. Swiss quartz movement ensures precision."
        },
        {
            id: 12,
            name: "Vintage Pilot's Watch",
            category: "watches",
            price: 4599.99,
            stock: 2,
            image: "https://images.unsplash.com/photo-1594534475808-b18fc33b045e?ixlib=rb-4.0.3&w=500",
            description: "Heritage aviation timepiece with large crown and luminous hands. Inspired by WWII-era pilot watches."
        },
        {
            id: 13,
            name: "Smart Luxury Hybrid",
            category: "watches",
            price: 1999.99,
            stock: 8,
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&w=500",
            description: "Traditional Swiss craftsmanship meets modern technology. Features fitness tracking and smartphone connectivity."
        },
        {
            id: 14,
            name: "Ceramic Diving Watch",
            category: "watches",
            price: 2199.99,
            stock: 5,
            image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?ixlib=rb-4.0.3&w=500",
            description: "Professional diving watch with ceramic bezel and 300m water resistance. Helium escape valve for deep-sea diving."
        },
        {
            id: 15,
            name: "Skeleton Automatic Watch",
            category: "watches",
            price: 3799.99,
            stock: 3,
            image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?ixlib=rb-4.0.3&w=500",
            description: "Open-heart design showcases the intricate automatic movement. Hand-assembled with 40-hour power reserve."
        },
        
        // HANDBAGS CATEGORY
        {
            id: 16,
            name: "Designer Leather Handbag",
            category: "handbags",
            price: 1899.99,
            stock: 8,
            image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&w=500",
            description: "Handcrafted Italian leather handbag with gold hardware and silk lining. The epitome of luxury fashion accessories."
        },
        {
            id: 17,
            name: "Silk Evening Clutch",
            category: "handbags",
            price: 699.99,
            stock: 15,
            image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&w=500",
            description: "Elegant silk evening clutch with beaded embellishments. The perfect accessory for formal events and special occasions."
        },
        {
            id: 18,
            name: "Crocodile Leather Tote",
            category: "handbags",
            price: 4299.99,
            stock: 3,
            image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?ixlib=rb-4.0.3&w=500",
            description: "Exclusive crocodile leather tote bag with palladium hardware. Ethically sourced and certified genuine exotic leather."
        },
        {
            id: 19,
            name: "Vintage Velvet Evening Bag",
            category: "handbags",
            price: 899.99,
            stock: 12,
            image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&w=500",
            description: "Luxurious velvet evening bag with crystal clasp and chain strap. Inspired by 1920s glamour and sophistication."
        },
        {
            id: 20,
            name: "Python Skin Crossbody",
            category: "handbags",
            price: 2599.99,
            stock: 6,
            image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&w=500",
            description: "Contemporary python crossbody bag with adjustable strap. Features multiple compartments and magnetic closure."
        },
        {
            id: 21,
            name: "Quilted Luxury Backpack",
            category: "handbags",
            price: 1599.99,
            stock: 9,
            image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?ixlib=rb-4.0.3&w=500",
            description: "Sophisticated quilted leather backpack with chain details. Combines functionality with high-fashion aesthetics."
        },
        {
            id: 22,
            name: "Beaded Vintage Purse",
            category: "handbags",
            price: 799.99,
            stock: 14,
            image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&w=500",
            description: "Hand-beaded vintage-style purse with intricate patterns. Features satin lining and antique brass frame."
        },
        
        // ACCESSORIES CATEGORY
        {
            id: 23,
            name: "Gold Cufflinks Set",
            category: "accessories",
            price: 449.99,
            stock: 20,
            image: "https://images.unsplash.com/photo-1611923134239-e15b7c7c6551?ixlib=rb-4.0.3&w=500",
            description: "18K gold cufflinks with intricate engraving. A distinguished addition to any gentleman's formal wear collection."
        },
        {
            id: 24,
            name: "Silk Pocket Square Set",
            category: "accessories",
            price: 299.99,
            stock: 25,
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=500",
            description: "Collection of five premium silk pocket squares with classic patterns. Hand-rolled edges and luxurious texture."
        },
        {
            id: 25,
            name: "Leather Card Holder",
            category: "accessories",
            price: 199.99,
            stock: 30,
            image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&w=500",
            description: "Minimalist leather card holder with RFID blocking. Crafted from full-grain Italian leather with contrast stitching."
        },
        {
            id: 26,
            name: "Crystal Brooch Collection",
            category: "accessories",
            price: 899.99,
            stock: 12,
            image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&w=500",
            description: "Set of three vintage-inspired crystal brooches. Features Swarovski crystals in silver-tone settings."
        },
        {
            id: 27,
            name: "Monogrammed Money Clip",
            category: "accessories",
            price: 149.99,
            stock: 35,
            image: "https://images.unsplash.com/photo-1611923134239-e15b7c7c6551?ixlib=rb-4.0.3&w=500",
            description: "Sterling silver money clip with personalized engraving. Sleek design perfect for the modern gentleman."
        },
        {
            id: 28,
            name: "Designer Sunglasses",
            category: "accessories",
            price: 599.99,
            stock: 18,
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=500",
            description: "Luxury aviator sunglasses with titanium frame and polarized lenses. UV400 protection with anti-reflective coating."
        },
        {
            id: 29,
            name: "Pearl Hair Pins Set",
            category: "accessories",
            price: 259.99,
            stock: 22,
            image: "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?ixlib=rb-4.0.3&w=500",
            description: "Elegant pearl hair pins perfect for special occasions. Set of six pins with freshwater pearls and gold-tone finish."
        },
        {
            id: 30,
            name: "Cashmere Scarf",
            category: "accessories",
            price: 399.99,
            stock: 16,
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=500",
            description: "Ultra-soft cashmere scarf in classic plaid pattern. Made from 100% Mongolian cashmere with fringed edges."
        },
        
        // ADDITIONAL JEWELRY
        {
            id: 31,
            name: "Platinum Wedding Band",
            category: "jewelry",
            price: 1899.99,
            stock: 8,
            image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&w=500",
            description: "Classic platinum wedding band with brushed finish. Timeless elegance crafted to perfection for life's most precious moments."
        },
        {
            id: 32,
            name: "Vintage Cameo Brooch",
            category: "jewelry",
            price: 749.99,
            stock: 12,
            image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&w=500",
            description: "Authentic vintage cameo brooch from the Victorian era. Hand-carved shell cameo in gold-filled setting."
        },
        {
            id: 33,
            name: "Tanzanite Drop Earrings",
            category: "jewelry",
            price: 2299.99,
            stock: 6,
            image: "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?ixlib=rb-4.0.3&w=500",
            description: "Rare Tanzanite gemstones in elegant drop earring design. Set in 14K white gold with diamond accents."
        },
        {
            id: 34,
            name: "Gold Charm Bracelet",
            category: "jewelry",
            price: 1649.99,
            stock: 9,
            image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&w=500",
            description: "18K yellow gold charm bracelet with seven luxury charms. A personalized piece that tells your unique story."
        },
        {
            id: 35,
            name: "Opal Cocktail Ring",
            category: "jewelry",
            price: 1299.99,
            stock: 5,
            image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&w=500",
            description: "Australian boulder opal in a striking cocktail ring setting. Features play-of-color in a bold contemporary design."
        },
        
        // ADDITIONAL WATCHES
        {
            id: 36,
            name: "Limited Edition Chronograph",
            category: "watches",
            price: 5999.99,
            stock: 2,
            image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?ixlib=rb-4.0.3&w=500",
            description: "Limited edition luxury chronograph with in-house movement. Only 500 pieces made worldwide with exhibition caseback."
        },
        {
            id: 37,
            name: "Diamond Bezel Ladies Watch",
            category: "watches",
            price: 3799.99,
            stock: 4,
            image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?ixlib=rb-4.0.3&w=500",
            description: "Elegant ladies timepiece with diamond-set bezel and mother-of-pearl dial. Swiss quartz movement in rose gold."
        },
        {
            id: 38,
            name: "GMT Travel Watch",
            category: "watches",
            price: 2899.99,
            stock: 7,
            image: "https://images.unsplash.com/photo-1594534475808-b18fc33b045e?ixlib=rb-4.0.3&w=500",
            description: "Professional GMT watch for world travelers. Features dual time zones and date display with rotating 24-hour bezel."
        },
        {
            id: 39,
            name: "Vintage Dress Watch",
            category: "watches",
            price: 1799.99,
            stock: 8,
            image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?ixlib=rb-4.0.3&w=500",
            description: "Classic dress watch inspired by 1950s design. Hand-wound movement in yellow gold case with leather strap."
        },
        {
            id: 40,
            name: "Sports Luxury Smartwatch",
            category: "watches",
            price: 2199.99,
            stock: 12,
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&w=500",
            description: "Premium smartwatch with titanium case and ceramic bezel. Advanced health tracking with luxury aesthetics."
        },
        
        // ADDITIONAL HANDBAGS
        {
            id: 41,
            name: "Executive Leather Briefcase",
            category: "handbags",
            price: 2299.99,
            stock: 5,
            image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?ixlib=rb-4.0.3&w=500",
            description: "Professional leather briefcase with laptop compartment. Handcrafted Italian leather with brass hardware."
        },
        {
            id: 42,
            name: "Vintage Clutch Collection",
            category: "handbags",
            price: 1299.99,
            stock: 8,
            image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&w=500",
            description: "Set of three vintage-inspired clutches in different textures. Perfect for various occasions and events."
        },
        {
            id: 43,
            name: "Luxury Travel Bag",
            category: "handbags",
            price: 3499.99,
            stock: 3,
            image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&w=500",
            description: "Premium leather travel bag with multiple compartments. Features wheels and telescopic handle for convenience."
        },
        {
            id: 44,
            name: "Mini Designer Bag",
            category: "handbags",
            price: 899.99,
            stock: 15,
            image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&w=500",
            description: "Trendy mini bag in patent leather with chain strap. Compact yet stylish for modern urban lifestyle."
        },
        {
            id: 45,
            name: "Structured Work Tote",
            category: "handbags",
            price: 1799.99,
            stock: 10,
            image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?ixlib=rb-4.0.3&w=500",
            description: "Professional structured tote with padded laptop section. Premium saffiano leather in classic silhouette."
        },
        
        // ADDITIONAL ACCESSORIES
        {
            id: 46,
            name: "Silk Tie Collection",
            category: "accessories",
            price: 449.99,
            stock: 20,
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=500",
            description: "Set of five luxury silk ties in classic patterns. Hand-sewn with premium silk and matching gift box."
        },
        {
            id: 47,
            name: "Leather Phone Case",
            category: "accessories",
            price: 159.99,
            stock: 25,
            image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&w=500",
            description: "Premium leather phone case with card slots. Compatible with wireless charging and available in multiple colors."
        },
        {
            id: 48,
            name: "Crystal Cufflink Set",
            category: "accessories",
            price: 699.99,
            stock: 15,
            image: "https://images.unsplash.com/photo-1611923134239-e15b7c7c6551?ixlib=rb-4.0.3&w=500",
            description: "Swarovski crystal cufflinks in rhodium-plated setting. Comes with matching shirt studs and gift box."
        },
        {
            id: 49,
            name: "Luxury Pen Set",
            category: "accessories",
            price: 799.99,
            stock: 12,
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=500",
            description: "Premium fountain pen and ballpoint set with gold trim. Features smooth writing mechanism and elegant case."
        },
        {
            id: 50,
            name: "Designer Belt Collection",
            category: "accessories",
            price: 499.99,
            stock: 18,
            image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&w=500",
            description: "Set of two luxury leather belts with reversible buckles. Full-grain leather in black and brown with gift box."
        }
    ];
}

// Event Listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    // Filter functionality
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', handleFilters);
    }
    
    const sortFilter = document.getElementById('sortFilter');
    if (sortFilter) {
        sortFilter.addEventListener('change', handleFilters);
    }
    
    const priceRange = document.getElementById('priceRange');
    if (priceRange) {
        priceRange.addEventListener('input', handlePriceRange);
    }
    
    // Modal functionality
    const modal = document.getElementById('productModal');
    if (modal) {
        const closeModal = modal.querySelector('.close-modal');
        if (closeModal) {
            closeModal.addEventListener('click', hideProductModal);
        }
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                hideProductModal();
            }
        });
    }
    
    // Modal add to cart
    const addToCartModal = document.getElementById('addToCartModal');
    if (addToCartModal) {
        addToCartModal.addEventListener('click', handleModalAddToCart);
    }
}

// Search and Filter Functions
function handleSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (searchTerm === '') {
        filteredProducts = [...products];
    } else {
        filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
    }
    
    handleFilters();
}

function handleFilters() {
    let filtered = [...filteredProducts];
    
    // Category filter
    const category = document.getElementById('categoryFilter').value;
    if (category) {
        filtered = filtered.filter(product => product.category === category);
    }
    
    // Price range filter
    const maxPrice = document.getElementById('priceRange').value;
    filtered = filtered.filter(product => product.price <= maxPrice);
    
    // Sort
    const sortBy = document.getElementById('sortFilter').value;
    switch (sortBy) {
        case 'price-low':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'name':
        default:
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
    }
    
    displayProducts(filtered);
}

function handlePriceRange() {
    const priceValue = document.getElementById('priceRange').value;
    document.getElementById('priceValue').textContent = priceValue;
    handleFilters();
}

// Product Display Functions
function displayProducts(productsToShow = filteredProducts) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    if (productsToShow.length === 0) {
        productsGrid.innerHTML = '<div class="text-center" style="grid-column: 1/-1; padding: 2rem; color: var(--secondary-color);">No products found matching your criteria.</div>';
        return;
    }
    
    productsToShow.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card fade-in';
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300x200/1a1a1a/d4af37?text=Image+Not+Found'">
        </div>
        <div class="product-info">
            <div class="product-category">${product.category}</div>
            <div class="product-name">${product.name}</div>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <div class="product-actions">
                <button class="btn btn-secondary btn-small" onclick="showProductModal(${product.id})">
                    <i class="fas fa-eye"></i>
                    View Details
                </button>
                <button class="btn btn-primary btn-small" onclick="addToCart(${product.id})">
                    <i class="fas fa-gem"></i>
                    Add to Collection
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Product Modal Functions
function showProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('productModal');
    const modalImage = document.getElementById('modalProductImage');
    const modalName = document.getElementById('modalProductName');
    const modalDescription = document.getElementById('modalProductDescription');
    const modalPrice = document.getElementById('modalProductPrice');
    const modalStock = document.getElementById('modalProductStock');
    const addToCartBtn = document.getElementById('addToCartModal');
    
    modalImage.src = product.image;
    modalImage.alt = product.name;
    modalImage.onerror = function() {
        this.src = 'https://via.placeholder.com/300x200/1a1a1a/d4af37?text=Image+Not+Found';
    };
    
    modalName.textContent = product.name;
    modalDescription.textContent = product.description;
    modalPrice.textContent = `$${product.price.toFixed(2)}`;
    modalStock.textContent = `${product.stock} in stock`;
    
    addToCartBtn.dataset.productId = productId;
    
    modal.classList.add('show');
}

function hideProductModal() {
    const modal = document.getElementById('productModal');
    modal.classList.remove('show');
}

function handleModalAddToCart() {
    const productId = parseInt(document.getElementById('addToCartModal').dataset.productId);
    addToCart(productId);
    hideProductModal();
}

// Cart Functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || product.stock <= 0) {
        alert('Product is out of stock!');
        return;
    }
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        if (existingItem.quantity < product.stock) {
            existingItem.quantity += 1;
        } else {
            alert('Cannot add more items. Stock limit reached!');
            return;
        }
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    updateCartDisplay();
    
    // Show success feedback
    showToast('Item added to your collection!');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    updateCartDisplay();
    showToast('Item removed from collection!');
}

function updateCartQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            const product = products.find(p => p.id === productId);
            if (product && newQuantity <= product.stock) {
                item.quantity = newQuantity;
                saveCart();
                updateCartCount();
                updateCartDisplay();
            } else {
                alert('Stock limit reached!');
            }
        }
    }
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
    updateCartText();
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems || !cartTotal) return;
    
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--secondary-color);"><i class="fas fa-shopping-bag" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.3;"></i><br>Your collection is empty<br><small style="opacity: 0.7;">Add luxury items to get started</small></div>';
        cartTotal.textContent = '0.00';
        return;
    }
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/60x60/1a1a1a/d4af37?text=Image+Not+Found'">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
}

function toggleCart() {
    const cartDrawer = document.getElementById('cartDrawer');
    const cartOverlay = document.getElementById('cartOverlay');
    
    if (cartDrawer.classList.contains('open')) {
        cartDrawer.classList.remove('open');
        cartOverlay.classList.remove('show');
    } else {
        cartDrawer.classList.add('open');
        cartOverlay.classList.add('show');
        updateCartDisplay();
    }
}

function clearCart() {
    if (cart.length === 0) return;
    
    if (confirm('Are you sure you want to clear your collection?')) {
        cart = [];
        saveCart();
        updateCartCount();
        updateCartDisplay();
        showToast('Collection cleared!');
    }
}

function checkout() {
    if (cart.length === 0) {
        alert('Your collection is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Generate order ID
    const orderId = 'LM' + Date.now();
    
    // Create order object
    const order = {
        id: orderId,
        customer: 'Guest Customer', // In a real app, this would be the logged-in user
        items: [...cart],
        total: total,
        status: 'pending',
        date: new Date().toISOString()
    };
    
    // Save order to localStorage
    const existingOrders = JSON.parse(localStorage.getItem('luxemarket_orders') || '[]');
    existingOrders.push(order);
    localStorage.setItem('luxemarket_orders', JSON.stringify(existingOrders));
    
    // Update product stock
    cart.forEach(cartItem => {
        const product = products.find(p => p.id === cartItem.id);
        if (product) {
            product.stock -= cartItem.quantity;
        }
    });
    saveProducts();
    
    // Clear cart
    cart = [];
    saveCart();
    updateCartCount();
    updateCartDisplay();
    toggleCart();
    
    // Refresh products display
    displayProducts();
    
    alert(`Order placed successfully! Order ID: ${orderId}\\nTotal: $${total.toFixed(2)}\\n\\nThank you for shopping with LuxeMarket!`);
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

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Close modal with Escape key
    if (e.key === 'Escape') {
        const modal = document.getElementById('productModal');
        if (modal && modal.classList.contains('show')) {
            hideProductModal();
        }
        
        const cartDrawer = document.getElementById('cartDrawer');
        if (cartDrawer && cartDrawer.classList.contains('open')) {
            toggleCart();
        }
    }
    
    // Open cart with C key
    if (e.key === 'c' && !e.ctrlKey && !e.altKey && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        toggleCart();
    }
    
    // Focus search with S key
    if (e.key === 's' && !e.ctrlKey && !e.altKey && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.focus();
        }
    }
});

// Initialize sample data on first load
function initializeSampleData() {
    if (!localStorage.getItem('luxemarket_products')) {
        products = getSampleProducts();
        saveProducts();
    }
}

// Navigation Functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
        
        // Update active navigation link
        updateActiveNavLink(sectionId);
    }
}

function updateActiveNavLink(activeId) {
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current link
    const activeLink = document.querySelector(`[href="#${activeId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

function filterByCategory(category) {
    // Set the category filter
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.value = category;
    }
    
    // Scroll to shop section
    scrollToSection('shop');
    
    // Apply filters
    setTimeout(() => {
        handleFilters();
    }, 500);
}

function focusSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        scrollToSection('shop');
        setTimeout(() => {
            searchInput.focus();
        }, 500);
    }
}

// Update cart text references
function updateCartText() {
    const cartText = document.querySelector('.cart-text');
    if (cartText) {
        const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (itemCount === 0) {
            cartText.textContent = 'My Collection';
        } else if (itemCount === 1) {
            cartText.textContent = '1 Item';
        } else {
            cartText.textContent = `${itemCount} Items`;
        }
    }
}
