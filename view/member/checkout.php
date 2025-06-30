<?php
session_start(); // Start the session
// Check if the user is logged in
if (!isset($_SESSION['user']) || !$_SESSION['user']['is_logged_in']) {
    // Redirect to login page if not logged in
    header('Location: userLogin.html');
    exit();
}

$cartItems = isset($_SESSION['cart']) ? $_SESSION['cart'] : [];
$userId = $_SESSION['user']['user_id'];
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SUP TULANG ZZ - Order Cart</title>
    <link rel="stylesheet" href="assets/css/checkout_style.css">
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="header-content">
            <div class="logo">
                <img src="../../assets/images/logo.png" alt="SUP TULANG ZZ Logo" class="logo-img">
                <span class="logo-text">SUP TULANG ZZ</span>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
        <div class="container">
            <!-- Order Header -->
            <h1 class="order-title">Order Cart #12456</h1>

            <!-- Cart Items -->
            <div class="cart-items"></div>

            <!-- Delivery Information -->
            <div class="delivery-section">
                <h2 class="section-title">
                    Delivery Details
                    <span class="dropdown-arrow">▼</span>
                </h2>
                <div class="delivery-info">
                    <div class="info-row">
                        <span for="recipientName" class="info-label">Recipient Name :</span>
                        <input type="text" id="recipientName" class="info-value" value="<?php echo isset($_SESSION['user']['full_name']) ? htmlspecialchars($_SESSION['user']['full_name']) : ''; ?>" required>
                    </div>
                    <div class="info-row">
                        <label for="phoneNumber" class="info-label">Phone Number:</label>
                        <input type="text" id="phoneNumber" class="info-value" value="<?php echo isset($_SESSION['user']['phone_number']) ? htmlspecialchars($_SESSION['user']['phone_number']) : ''; ?>" required>
                    </div>
                    <div class="info-row">
                        <span for="email" class="info-label">Email :</span>
                        <input type="text" id="email" class="info-value" value="<?php echo isset($_SESSION['user']['email']) ? htmlspecialchars($_SESSION['user']['email']) : ''; ?>" required>
                    </div>
                    <div class="info-row">
                        <label for="address" class="info-label">Address:</label>
                        <input type="text" id="address" class="info-value" value="<?php echo isset($_SESSION['user']['address']) ? htmlspecialchars($_SESSION['user']['address']) : ''; ?>" required>
                    </div>
                </div>
            </div>

            <!-- Payment Method Section -->
            <div class="payment-section">
                <h2 class="section-title">Payment Method</h2>
                <div class="payment-options">
                    <label>
                        <input type="radio" name="payment-method" value="credit-card" checked>
                        Credit Card
                    </label>
                    <label>
                        <input type="radio" name="payment-method" value="paypal">
                        PayPal
                    </label>
                    <label>
                        <input type="radio" name="payment-method" value="bank-transfer">
                        Bank Transfer
                    </label>
                </div>
            </div>

            <!-- Order Summary -->
            <div class="order-summary">
                <div class="summary-row">
                    <span class="summary-label">Subtotal</span>
                    <span class="summary-value" id="subtotal">$ 0.00</span>
                </div>
                <div class="summary-row">
                    <span class="summary-label">Delivery fee</span>
                    <span class="summary-value">$6.00</span>
                </div>
                <div class="summary-row">
                    <span class="summary-label">Tax</span>
                    <span class="summary-value" id="tax">$0.00</span>
                </div>
                <div class="summary-divider"></div>
                <div class="summary-row total-row">
                    <span class="summary-label total-label">Total</span>
                    <span class="summary-value total-value" id="total">$ 0.00</span>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons">
                <button class="confirm-btn">Confirm</button>
                <button class="cancel-btn">Cancel</button>
            </div>
        </div>
    </main>

    <!-- Loading Indicator -->
    <div id="loadingIndicator" class="loading-indicator" style="display: none;">
        <p>Loading...</p>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            
            // Delivery fee and tax rate
            const deliveryFee = 6.00;
            const taxRate = 0.24; // 24% tax rate

            const cartItems = <?php echo json_encode($cartItems); ?>;

            const cartItemsContainer = document.querySelector('.cart-items');
            cartItems.forEach((item, index) => {
                const cartItemHTML = `
                    <div class="cart-item">
                        <div class="item-image">
                            <img src="${item.picture}" alt="${item.name}">
                        </div>
                        <div class="item-details">
                            <h3 class="item-name">${item.name}</h3>
                            <p class="item-price">RM${item.price.toFixed(2)}</p>
                            <div class="quantity-controls">
                                <button class="quantity-btn minus-btn" data-item="${index}">-</button>
                                <span class="quantity" data-item="${index}">${item.quantity}</span>
                                <button class="quantity-btn plus-btn" data-item="${index}">+</button>
                            </div>
                        </div>
                    </div>
                `;
                cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHTML);
            });

            // Update totals function
            function updateTotals() {
                let subtotal = 0;
                const quantityElements = document.querySelectorAll('.quantity');
                quantityElements.forEach((qty, index) => {
                    console.log('quantity is ' + qty.textContent + ' and price is RM' + cartItems[index].price);
                    subtotal += parseInt(qty.textContent) * cartItems[index].price;
                    console.log('subtotal is RM' + subtotal);
                });

                const tax = subtotal * taxRate;
                const total = subtotal + deliveryFee + tax;

                document.getElementById('subtotal').textContent = `RM ${subtotal.toFixed(2)}`;
                document.getElementById('tax').textContent = `RM ${tax.toFixed(2)}`;
                document.getElementById('total').textContent = `RM ${total.toFixed(2)}`;
            }

            // Plus button functionality
            document.querySelectorAll('.plus-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const itemId = this.getAttribute('data-item');
                    const quantityElement = document.querySelector(`.quantity[data-item="${itemId}"]`);
                    let currentQuantity = parseInt(quantityElement.textContent);
                    currentQuantity++;
                    quantityElement.textContent = currentQuantity;
                    cartItems[itemId].quantity = currentQuantity;
                    updateTotals();
                });
            });

            // Minus button functionality
            document.querySelectorAll('.minus-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const itemId = this.getAttribute('data-item');
                    const quantityElement = document.querySelector(`.quantity[data-item="${itemId}"]`);
                    let currentQuantity = parseInt(quantityElement.textContent);
                    if (currentQuantity > 1) {
                        currentQuantity--;
                        quantityElement.textContent = currentQuantity;
                        cartItems[itemId].quantity = currentQuantity;
                        updateTotals();
                    }
                });
            });

            // Delivery section toggle
            const deliveryTitle = document.querySelector('.section-title');
            const deliveryInfo = document.querySelector('.delivery-info');
            const dropdownArrow = document.querySelector('.dropdown-arrow');
            
            deliveryTitle.addEventListener('click', function() {
                deliveryInfo.classList.toggle('collapsed');
                dropdownArrow.textContent = deliveryInfo.classList.contains('collapsed') ? '▶' : '▼';
            });
            
            // Action buttons
            document.querySelector('.confirm-btn').addEventListener('click', function() {
                // Show loading indicator
                document.getElementById('loadingIndicator').style.display = 'flex';

                // Get delivery and payment details
                const recipientName = document.getElementById('recipientName').value;
                const phoneNumber = document.getElementById('phoneNumber').value;
                const email = document.getElementById('email').value;
                const address = document.getElementById('address').value;
                const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;

                // Prepare order data
                const orderData = {
                    user_id: <?php echo $userId; ?>,
                    address: address,
                    payment_method: paymentMethod,
                    cart_items: cartItems
                };

                // Send order data to create_order.php
                fetch('backend/create_order.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(orderData)
                })
                .then(response => response.json())
                .then(data => {
                // Hide loading indicator
                document.getElementById('loadingIndicator').style.display = 'none';

                    if (data.status === 'success') {
                        alert('Order placed successfully! Your order ID is: ' + data.order_id);
                        window.location.href = 'menu.php'; // Redirect to menu page
                    } else {
                        alert('Error: ' + data.message);
                    }
                })
                .catch(error => {
                    console.error('Error placing order:', error);
                });
            });

            document.querySelector('.cancel-btn').addEventListener('click', function() {
                if (confirm('Are you sure you want to cancel this order?')) {
                    window.history.back();
                }
            });

            // Initial update of totals
            updateTotals();
        });
    </script>
</body>
</html>