// Products page specific functionality
let allProducts = [];
let filteredProducts = [];

document.addEventListener('DOMContentLoaded', function() {
    loadProductsData();
    initializeFilters();
    // checkUrlParams(); // Moved to after products are loaded
});

async function loadProductsData() {
    try {
        const response = await fetch('../data/products.json');
        const data = await response.json();
        allProducts = data.products;
        filteredProducts = [...allProducts];
        checkUrlParams(); // Check URL params after products are loaded
        displayProducts(filteredProducts);
    } catch (error) {
        console.error('Error loading products:', error);
        createFallbackProducts();
    }
}

function createFallbackProducts() {
    allProducts = [
        {
            id: 1,
            name: "Flawless Foundation - Ivory",
            category: "face",
            price: 32.99,
            description: "Full coverage liquid foundation for a flawless finish",
            inStock: true
        },
        {
            id: 2,
            name: "Volume Max Mascara",
            category: "eyes",
            price: 22.99,
            description: "Volumizing mascara for dramatic lashes",
            inStock: true
        },
        {
            id: 3,
            name: "Velvet Matte Lipstick - Ruby Red",
            category: "lips",
            price: 26.99,
            description: "Long-lasting matte lipstick in classic red",
            inStock: true
        },
        {
            id: 4,
            name: "Silky Smooth Body Lotion",
            category: "body",
            price: 24.99,
            description: "Hydrating body lotion with luxurious scent",
            inStock: true
        }
    ];
    filteredProducts = [...allProducts];
    checkUrlParams(); // Check URL params after fallback products are created
    displayProducts(filteredProducts);
}

function displayProducts(productsToShow) {
    const container = document.getElementById('products-container');
    const noProductsMsg = document.getElementById('no-products');
    
    if (productsToShow.length === 0) {
        container.innerHTML = '';
        noProductsMsg.classList.remove('hidden');
        return;
    }
    
    noProductsMsg.classList.add('hidden');
    
    container.innerHTML = productsToShow.map(product => `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">
                <i class="fas fa-${getProductIcon(product.category)} fa-3x"></i>
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-category">${capitalize(product.category)}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="add-to-cart" onclick="addToCartFromProducts(${product.id})" 
                        ${!product.inStock ? 'disabled' : ''}>
                    ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
            </div>
        </div>
    `).join('');
}

function getProductIcon(category) {
    const icons = {
        'face': 'user-circle',
        'eyes': 'eye',
        'lips': 'kiss',
        'body': 'spa'
    };
    return icons[category] || 'star';
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function addToCartFromProducts(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`${product.name} added to cart!`);
}

function initializeFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const sortFilter = document.getElementById('sort-filter');
    const searchInput = document.getElementById('search-input');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', filterProducts);
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', filterProducts);
    }
}

function filterProducts() {
    const categoryFilter = document.getElementById('category-filter');
    const sortFilter = document.getElementById('sort-filter');
    const searchInput = document.getElementById('search-input');
    
    let filtered = [...allProducts];
    console.log('All products:', allProducts.length);
    
    // Filter by category
    if (categoryFilter && categoryFilter.value !== 'all') {
        console.log('Filtering by category:', categoryFilter.value);
        filtered = filtered.filter(product => product.category === categoryFilter.value);
        console.log('Filtered products:', filtered.length);
    }
    
    // Filter by search
    if (searchInput && searchInput.value) {
        const searchTerm = searchInput.value.toLowerCase();
        filtered = filtered.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
    }
    
    // Sort products
    if (sortFilter) {
        switch (sortFilter.value) {
            case 'name':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
        }
    }
    
    filteredProducts = filtered;
    displayProducts(filteredProducts);
}

function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    if (category) {
        // Add a small delay to ensure DOM is ready
        setTimeout(() => {
            const categoryFilter = document.getElementById('category-filter');
            if (categoryFilter && allProducts.length > 0) {
                categoryFilter.value = category;
                console.log('Setting category filter to:', category);
                // Trigger filtering after setting the value
                filterProducts();
            }
        }, 100);
    }
}

// Update the page header styles
const style = document.createElement('style');
style.textContent = `
    .products-page {
        margin-top: 80px;
        padding: 2rem 0;
        min-height: 80vh;
    }
    
    .page-header {
        text-align: center;
        margin-bottom: 3rem;
    }
    
    .page-header h1 {
        font-size: 2.5rem;
        color: #2c3e50;
        margin-bottom: 0.5rem;
    }
    
    .page-header p {
        color: #666;
        font-size: 1.1rem;
    }
    
    .filters {
        display: flex;
        gap: 2rem;
        margin-bottom: 2rem;
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 10px;
        flex-wrap: wrap;
    }
    
    .filter-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .filter-group label {
        font-weight: 500;
        color: #2c3e50;
    }
    
    .filter-group select,
    .filter-group input {
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 1rem;
    }
    
    .filter-group input {
        min-width: 200px;
    }
    
    .product-category {
        color: #ff6b9d;
        font-size: 0.9rem;
        font-weight: 500;
        margin-bottom: 0.5rem;
        text-transform: uppercase;
    }
    
    .product-description {
        color: #666;
        font-size: 0.9rem;
        margin-bottom: 1rem;
        line-height: 1.4;
    }
    
    .no-products {
        text-align: center;
        padding: 3rem;
        color: #666;
        font-size: 1.1rem;
    }
    
    .nav-menu .active {
        color: #ffd700 !important;
        font-weight: 600;
    }
    
    @media (max-width: 768px) {
        .filters {
            flex-direction: column;
            gap: 1rem;
        }
        
        .filter-group input {
            min-width: 100%;
        }
        
        .page-header h1 {
            font-size: 2rem;
        }
    }
`;
document.head.appendChild(style);
