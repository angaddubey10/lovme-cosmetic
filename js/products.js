// Products page functionality
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('products-container');
    if (container) {
        // Load and display products
        fetch('/data/products.json')
            .then(response => response.json())
            .then(data => {
                // Check if there's a category parameter in the URL
                const urlParams = new URLSearchParams(window.location.search);
                const category = urlParams.get('category');
                
                let productsToShow = data.products;
                
                // Filter products by category if parameter exists
                if (category) {
                    productsToShow = data.products.filter(product => 
                        product.category.toLowerCase() === category.toLowerCase()
                    );
                }
                
                displayProducts(productsToShow);
            })
            .catch(error => {
                console.error('Error loading products:', error);
                container.innerHTML = '<div style="text-align: center; padding: 20px; color: red;">Unable to load products. Please try again later.</div>';
            });
    }
});

function displayProducts(products) {
    const container = document.getElementById('products-container');
    
    container.innerHTML = products.map(product => {
        // Ensure image path is absolute from root
        let imagePath = product.image;
        if (imagePath && !imagePath.startsWith('/') && !imagePath.startsWith('http')) {
            imagePath = '/' + imagePath;
        }
        
        return `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image">
                <img src="${imagePath}" alt="${product.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                <i class="fas fa-${getProductIcon(product.category)} fa-3x" style="display: none;"></i>
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-category">${capitalize(product.category)}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-price">₹${product.price.toFixed(0)}</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})" 
                        ${!product.inStock ? 'disabled' : ''}>
                    ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
            </div>
        </div>
        `;
    }).join('');
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