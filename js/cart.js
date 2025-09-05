// Cart page functionality
let cart = [];

document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    displayCart();
    initializeCheckoutForm();
});

function loadCart() {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCartCount();
}

function displayCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart');
    const cartContent = document.querySelector('.cart-content');
    
    if (cart.length === 0) {
        cartContent.classList.add('hidden');
        emptyCartMessage.classList.remove('hidden');
        return;
    }
    
    emptyCartMessage.classList.add('hidden');
    cartContent.classList.remove('hidden');
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="item-image">
                <i class="fas fa-${getProductIcon(item.category)} fa-2x"></i>
            </div>
            <div class="item-details">
                <h4>${item.name}</h4>
                <p class="item-category">${capitalize(item.category)}</p>
                <p class="item-price">$${item.price.toFixed(2)} each</p>
            </div>
            <div class="quantity-controls">
                <button onclick="updateQuantity(${item.id}, -1)" class="qty-btn">-</button>
                <span class="quantity">${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, 1)" class="qty-btn">+</button>
            </div>
            <div class="item-total">
                $${(item.price * item.quantity).toFixed(2)}
            </div>
            <button onclick="removeFromCart(${item.id})" class="remove-btn">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
    
    updateCartSummary();
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

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartCount();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
    updateCartCount();
    showNotification('Item removed from cart');
}

function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    document.getElementById('modal-total').textContent = `$${total.toFixed(2)}`;
}

function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    const modal = document.getElementById('checkout-modal');
    modal.classList.remove('hidden');
    updateCartSummary();
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    modal.classList.add('hidden');
}

function initializeCheckoutForm() {
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckout);
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('checkout-modal');
        if (event.target === modal) {
            closeCheckoutModal();
        }
    });
}

function handleCheckout(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const orderData = {
        customer: {
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: {
                street: formData.get('address'),
                city: formData.get('city'),
                state: formData.get('state'),
                zip: formData.get('zip')
            }
        },
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        orderDate: new Date().toISOString()
    };
    
    // Simulate order processing
    showNotification('Processing your order...');
    
    setTimeout(() => {
        // Clear cart
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Show success message
        closeCheckoutModal();
        showSuccessMessage(orderData);
        
        // Redirect to home page after 3 seconds
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 3000);
    }, 2000);
}

function showSuccessMessage(orderData) {
    const successModal = document.createElement('div');
    successModal.className = 'modal';
    successModal.innerHTML = `
        <div class="modal-content success-modal">
            <div class="success-content">
                <i class="fas fa-check-circle fa-4x" style="color: #28a745; margin-bottom: 1rem;"></i>
                <h2>Order Placed Successfully!</h2>
                <p>Thank you for your purchase, ${orderData.customer.fullName}!</p>
                <p>Order total: $${(orderData.total * 1.08).toFixed(2)}</p>
                <p>A confirmation email has been sent to ${orderData.customer.email}</p>
                <p>You will be redirected to the homepage shortly...</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(successModal);
    
    setTimeout(() => {
        successModal.remove();
    }, 3000);
}

// Add cart page specific styles
const style = document.createElement('style');
style.textContent = `
    .cart-page {
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
    
    .cart-content {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 2rem;
        margin-bottom: 2rem;
    }
    
    .cart-items {
        background: #fff;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .cart-item {
        display: grid;
        grid-template-columns: 80px 1fr 120px 100px 40px;
        gap: 1rem;
        align-items: center;
        padding: 1.5rem;
        border-bottom: 1px solid #eee;
    }
    
    .cart-item:last-child {
        border-bottom: none;
    }
    
    .item-image {
        text-align: center;
        color: #ff6b9d;
    }
    
    .item-details h4 {
        margin: 0 0 0.5rem 0;
        color: #2c3e50;
    }
    
    .item-category {
        color: #ff6b9d;
        font-size: 0.9rem;
        margin: 0;
        text-transform: uppercase;
    }
    
    .item-price {
        color: #666;
        margin: 0;
    }
    
    .quantity-controls {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .qty-btn {
        background: #ff6b9d;
        color: white;
        border: none;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .qty-btn:hover {
        background: #c44569;
    }
    
    .quantity {
        font-weight: bold;
        min-width: 20px;
        text-align: center;
    }
    
    .item-total {
        font-weight: bold;
        color: #2c3e50;
        text-align: right;
    }
    
    .remove-btn {
        background: #dc3545;
        color: white;
        border: none;
        width: 35px;
        height: 35px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 0.9rem;
    }
    
    .remove-btn:hover {
        background: #c82333;
    }
    
    .cart-summary {
        background: #fff;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        padding: 2rem;
        height: fit-content;
    }
    
    .cart-summary h3 {
        margin: 0 0 1.5rem 0;
        color: #2c3e50;
        text-align: center;
    }
    
    .summary-line {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
        padding: 0.5rem 0;
    }
    
    .summary-line.total {
        border-top: 2px solid #eee;
        margin-top: 1rem;
        font-weight: bold;
        font-size: 1.2rem;
        color: #2c3e50;
    }
    
    .checkout-btn {
        width: 100%;
        background: linear-gradient(135deg, #ff6b9d, #c44569);
        color: white;
        border: none;
        padding: 1rem;
        border-radius: 25px;
        font-size: 1.1rem;
        font-weight: 600;
        cursor: pointer;
        margin: 1rem 0;
        transition: transform 0.3s;
    }
    
    .checkout-btn:hover {
        transform: translateY(-2px);
    }
    
    .continue-shopping {
        display: block;
        text-align: center;
        color: #ff6b9d;
        text-decoration: none;
        font-weight: 500;
        margin-top: 1rem;
    }
    
    .continue-shopping:hover {
        text-decoration: underline;
    }
    
    .empty-cart {
        text-align: center;
        padding: 4rem 2rem;
    }
    
    .empty-cart-content i {
        color: #ddd;
        margin-bottom: 2rem;
    }
    
    .empty-cart-content h3 {
        color: #2c3e50;
        margin-bottom: 1rem;
    }
    
    .empty-cart-content p {
        color: #666;
        margin-bottom: 2rem;
    }
    
    .modal {
        position: fixed;
        z-index: 9999;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .modal-content {
        background: white;
        border-radius: 10px;
        padding: 2rem;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
    }
    
    .close {
        position: absolute;
        right: 1rem;
        top: 1rem;
        font-size: 2rem;
        cursor: pointer;
        color: #999;
    }
    
    .close:hover {
        color: #333;
    }
    
    .checkout-form {
        margin-top: 1rem;
    }
    
    .form-group {
        margin-bottom: 1rem;
    }
    
    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: #2c3e50;
    }
    
    .form-group input {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 1rem;
    }
    
    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 1rem;
    }
    
    .order-total {
        text-align: center;
        font-size: 1.2rem;
        margin: 1.5rem 0;
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 5px;
    }
    
    .place-order-btn {
        width: 100%;
        background: #28a745;
        color: white;
        border: none;
        padding: 1rem;
        border-radius: 25px;
        font-size: 1.1rem;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.3s;
    }
    
    .place-order-btn:hover {
        background: #218838;
    }
    
    .success-modal {
        text-align: center;
    }
    
    .success-content p {
        margin: 0.5rem 0;
        color: #666;
    }
    
    @media (max-width: 768px) {
        .cart-content {
            grid-template-columns: 1fr;
        }
        
        .cart-item {
            grid-template-columns: 60px 1fr;
            gap: 1rem;
            grid-template-areas:
                "image details"
                "controls total"
                "remove remove";
        }
        
        .item-image { grid-area: image; }
        .item-details { grid-area: details; }
        .quantity-controls { grid-area: controls; }
        .item-total { grid-area: total; text-align: left; }
        .remove-btn { grid-area: remove; width: auto; border-radius: 5px; height: 40px; }
        
        .form-row {
            grid-template-columns: 1fr;
        }
        
        .modal-content {
            margin: 1rem;
        }
    }
`;
document.head.appendChild(style);
