// Global variables
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = [];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    updateCartCount();
    initializeEventListeners();
});

// Load products from JSON
async function loadProducts() {
    try {
        const response = await fetch('data/products.json');
        const data = await response.json();
        products = data.products;
        displayFeaturedProducts();
    } catch (error) {
        console.error('Error loading products:', error);
        // Fallback: create some sample products
        createSampleProducts();
    }
}

// Create sample products if JSON fails to load
function createSampleProducts() {
    products = [
        {
            id: 1,
            name: "Flawless Foundation",
            category: "face",
            price: 32.99,
            description: "Full coverage liquid foundation",
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
            name: "Velvet Matte Lipstick",
            category: "lips",
            price: 26.99,
            description: "Long-lasting matte lipstick",
            inStock: true
        },
        {
            id: 4,
            name: "Silky Body Lotion",
            category: "body",
            price: 24.99,
            description: "Hydrating body lotion",
            inStock: true
        }
    ];
    displayFeaturedProducts();
}

// Display featured products on homepage
function displayFeaturedProducts() {
    const container = document.getElementById('featured-products');
    if (!container) return;
    
    // Show first 8 products as featured
    const featuredProducts = products.slice(0, 8);
    
    container.innerHTML = featuredProducts.map(product => `
        <div class="product-card">
            <div class="product-image">
                <i class="fas fa-star fa-3x"></i>
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">$${product.price}</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
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

// Update cart count in navigation
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize event listeners
function initializeEventListeners() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
    
    // Category card clicks
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            if (category) {
                window.location.href = `pages/products.html?category=${category}`;
            }
        });
    });
    
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            showNotification('Thank you for subscribing!');
            newsletterForm.reset();
        });
    }
}

// Utility functions
function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}

function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification {
        animation: slideIn 0.3s ease;
    }
`;
document.head.appendChild(style);
