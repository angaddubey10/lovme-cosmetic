// Global variables
let products = [];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('featured-products')) {
        loadProducts();
    }
    initializeEventListeners();
});

// Load products from JSON
async function loadProducts() {
    try {
        const response = await fetch('data/products.json', { cache: 'no-cache' });
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
            price: 499,
            description: "Full coverage liquid foundation",
            inStock: true
        },
        {
            id: 2,
            name: "Volume Max Mascara",
            category: "eyes",
            price: 299,
            description: "Volumizing mascara for dramatic lashes",
            inStock: true
        },
        {
            id: 3,
            name: "Velvet Matte Lipstick",
            category: "lips",
            price: 299,
            description: "Long-lasting matte lipstick",
            inStock: true
        },
        {
            id: 4,
            name: "Silky Body Lotion",
            category: "body",
            price: 249,
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
                ${product.image ? `<img src="images/${product.image}" alt="${product.name}" loading="lazy" onerror="this.remove()">` : ''}
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">${formatPrice(product.price)}</div>
            </div>
        </div>
    `).join('');
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
    return `₹${price.toFixed(0)}`;
}

// Add CSS animation for notifications
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
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
document.head.appendChild(notificationStyle);
