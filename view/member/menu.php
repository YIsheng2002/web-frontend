<?php
session_start(); // Start the session
// Check if the user is logged in
if (!isset($_SESSION['user']) || !$_SESSION['user']['is_logged_in']) {
    // Redirect to login page if not logged in
    header('Location: userLogin.html');
    exit();
}
$userId = $_SESSION['user']['user_id'];
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SUP TULANG ZZ - Menu</title>
    <link rel="stylesheet" href="assets/css/menu_style.css">
</head>
<body>
    <!-- Header section for the SUP TULANG ZZ menu page -->
    <header class="header">
        <div class="header-content">
            <div class="logo">
                <!-- Logo image for the restaurant -->
                <img src="../../assets/images/logo.png" alt="SUP TULANG ZZ Logo" class="logo-img">
                <span class="logo-text">SUP TULANG ZZ</span>
            </div>
            <div class="header-right">
                <!-- Shopping cart icon and count -->
                <div class="cart">
                    <div class="cart-icon">
                        🛒
                        <span class="cart-count">0</span> <!-- Initialize cart count to 0 -->
                    </div>
                </div>
                <!-- Button to check order status -->
                <div class="order-status">
                    <button class="order-status-btn">Check Order Status</button>
                </div>
                <!-- Logout button -->
                <div class="logout">
                    <button class="logout-btn">Logout</button>
                </div>
            </div>
        </div>
    </header>

    <!-- Order Status Modal: Hidden by default, shown when "Check Order Status" is clicked -->
    <div class="modal" id="orderStatusModal" style="display: none;">
        <div class="modal-content">
            <span class="close-modal">&times;</span> <!-- Close button for the modal -->
            <h2>Check Order Status</h2>
            <form id="orderStatusForm">
                <div class="form-group">
                    <label for="orderNumber">Order Number</label>
                    <input type="text" id="orderNumber" name="orderNumber" required>
                </div>
                <button type="submit" class="check-status-btn">Check Status</button>
            </form>
            <div id="orderStatusMessage" class="order-status-message"></div>
        </div>
    </div>

    <!-- Navigation Menu for different food categories -->
    <nav class="nav-menu">
        <button class="nav-arrow nav-arrow-left">‹</button> <!-- Left scroll arrow -->
        <div class="nav-items">
        </div>
        <button class="nav-arrow nav-arrow-right">›</button> <!-- Right scroll arrow -->
    </nav>

    <!-- Main Content area where product sections are displayed -->
    <main class="main-content">
    </main>

    <!-- Loading Indicator -->
    <div id="loadingIndicator" class="loading-indicator" style="display: none;">
        <p>Loading...</p>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', async function() {
            // Initialize cart count and items array
            let cartCount = 0;
            let cartItems = [];

            // Fetch menu data
            const menuData = await fetchMenuData();
            if (!menuData) return;
            
            // Generate navigation and menu sections
            generateMenuStructure(menuData);
            
            // Initialize interactive elements
            initializeMenuInteractions();

            /**
             * Function to replace "Add To Cart" button with quantity selector and Confirm/Cancel buttons.
             * @param {HTMLElement} productCard - The product card element.
             * @param {string} productName - The name of the product.
             * @param {string} productPrice - The price of the product.
             */
            function createQuantitySelector(productCard, productName, productPrice, productPicture, productId) {
                // Update the product info div with quantity controls and action buttons
                productCard.querySelector('.product-info').innerHTML = `
                    <h3 class="product-name">${productName}</h3>
                    <p class="product-price">${productPrice}</p>
                    <div class="quantity-selector">
                        <button class="quantity-btn quantity-minus">-</button>
                        <span class="quantity-display">1</span>
                        <button class="quantity-btn quantity-plus">+</button>
                    </div>
                    <div class="button-container">
                        <button class="confirm-btn">Confirm</button>
                        <button class="cancel-btn">Cancel</button>
                    </div>
                `;

                // Get references to new quantity buttons and display
                const quantityMinusBtn = productCard.querySelector('.quantity-minus');
                const quantityPlusBtn = productCard.querySelector('.quantity-plus');
                const quantityDisplay = productCard.querySelector('.quantity-display');
                let quantity = 1; // Initialize quantity for this specific product

                // Add event listener for decreasing quantity
                quantityMinusBtn.addEventListener('click', function() {
                    if (quantity > 1) {
                        quantity--;
                        quantityDisplay.textContent = quantity;
                    }
                });

                // Add event listener for increasing quantity
                quantityPlusBtn.addEventListener('click', function() {
                    quantity++;
                    quantityDisplay.textContent = quantity;
                });

                // Confirm button functionality
                const confirmBtn = productCard.querySelector('.confirm-btn');
                confirmBtn.addEventListener('click', function() {
                    // Create item object to add to cart
                    const item = {
                        id: productId,
                        name: productName,
                        price: parseFloat(productPrice.replace(/[^0-9.]/g, '')),
                        quantity: quantity,
                        picture: productPicture
                    };
                    const orderIndex = cartItems.length; // Store current index for removal later
                    cartItems.push(item); // Add item to the global cart array
                    cartCount += quantity; // Update global cart count
                    document.querySelector('.cart-count').textContent = cartCount; // Update cart display in header
                    
                    console.log(`Added to cart: ${quantity} x ${productName} (${productPrice})`);
                    
                    // Show confirmed state with "Remove from Cart" button
                    showConfirmedState(productCard, productName, productPrice, productPicture, quantity, orderIndex, productId);
                });

                // Cancel button functionality
                const cancelBtn = productCard.querySelector('.cancel-btn');
                cancelBtn.addEventListener('click', function() {
                    // Reset the product card to its original "Add To Cart" state
                    resetProductCard(productCard, productName, productPrice, productPicture, productId);
                });
            }

            /**
             * Function to change product card to a "confirmed" state after adding to cart.
             * @param {HTMLElement} productCard - The product card element.
             * @param {string} productName - The name of the product.
             * @param {string} productPrice - The price of the product.
             * @param {number} quantity - The quantity added to cart.
             * @param {number} orderIndex - The index of the item in the cartItems array.
             */
            function showConfirmedState(productCard, productName, productPrice, productPicture, quantity, orderIndex, productId){
                productCard.classList.add('order-confirmed'); // Add a class for styling confirmed orders
                productCard.querySelector('.product-info').innerHTML = `
                    <h3 class="product-name">${productName}</h3>
                    <p class="product-price">${productPrice}</p>
                    <div class="confirmed-message">✓ Added ${quantity}x to cart</div>
                    <button class="remove-order-btn" data-order-index="${orderIndex}">Remove from Cart</button>
                `;

                // Add functionality for removing the item from cart
                const removeOrderBtn = productCard.querySelector('.remove-order-btn');
                removeOrderBtn.addEventListener('click', function() {
                    const idxToRemove = parseInt(this.getAttribute('data-order-index')); // Get the original index

                    // Check if the item actually exists at this index before removing
                    if (cartItems[idxToRemove]) {
                        const removedItem = cartItems[idxToRemove];
                        cartCount -= removedItem.quantity; // Decrease global cart count

                        // Remove item from cartItems array
                        cartItems.splice(idxToRemove, 1);
                        
                        // Update cart display in header
                        document.querySelector('.cart-count').textContent = cartCount;
                        
                        console.log(`Removed from cart: ${removedItem.quantity} x ${removedItem.name}`);
                    }
                    
                    // Reset the product card to its original "Add To Cart" state
                    resetProductCard(productCard, productName, productPrice, productPicture, productId);
                });
            }

            /**
             * Function to reset a product card back to its initial "Add To Cart" button state.
             * @param {HTMLElement} productCard - The product card element.
             * @param {string} productName - The name of the product.
             * @param {string} productPrice - The price of the product.
             */
            function resetProductCard(productCard, productName, productPrice, productPicture, productId) {
                productCard.classList.remove('order-confirmed'); // Remove confirmed styling
                productCard.querySelector('.product-info').innerHTML = `
                    <h3 class="product-name">${productName}</h3>
                    <p class="product-price">${productPrice}</p>
                    <button class="add-to-cart-btn">Add To Cart</button>
                `;

                // Reattach the event listener to the newly created "Add To Cart" button
                const newAddToCartBtn = productCard.querySelector('.add-to-cart-btn');
                newAddToCartBtn.addEventListener('click', function() {
                    createQuantitySelector(productCard, productName, productPrice, productPicture, productId);
                });
            }

            // Initial setup for "Add To Cart" buttons when the page loads
            const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
            addToCartBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    const productCard = this.closest('.product-card'); // Get the parent product card
                    const productName = productCard.querySelector('.product-name').textContent;
                    const productPrice = productCard.querySelector('.product-price').textContent;
                    const productPicture = productCard.querySelector('.product-image img').src;
                    const productId = productCard.dataset.productId;

                    // Call function to show quantity selector
                    createQuantitySelector(productCard, productName, productPrice, productPicture, productId);
                });
            });

            // Cart icon click functionality to redirect to checkout page
            document.querySelector('.cart-icon').addEventListener('click', function() {
                if (cartItems.length > 0) {
                    // Send cartItems as JSON to checkout.php
                    fetch('backend/checkout_order.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(cartItems) // Send cart items as JSON
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === 'success') {
                            window.location.href = 'checkout.php'; // Redirect to checkout page
                        } else {
                            alert('Error: ' + data.message);
                        }
                    })
                    .catch(error => {
                        console.error('Error sending cart data:', error);
                    });
                } else {
                    alert('Your cart is empty!');
                }
            });

            // Order Status Button Functionality - show modal
            document.querySelector('.order-status-btn').addEventListener('click', function() {
                document.getElementById('orderStatusModal').style.display = 'block';
            });

            // Close Modal Functionality for order status modal
            document.querySelector('.close-modal').addEventListener('click', function() {
                document.getElementById('orderStatusModal').style.display = 'none';
            });

            // Handle Order Status Form Submission
        document.getElementById('orderStatusForm').addEventListener('submit', function(event) {
            event.preventDefault();
            const orderNumber = document.getElementById('orderNumber').value;

            const orderStatusData = {
                user_id: <?php echo $userId; ?>,
                order_number: orderNumber
            };
                
            fetch('backend/check_order_status.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: JSON.stringify(orderStatusData)
            })
            .then(response => response.json())
            .then(data => {
                document.getElementById('orderStatusMessage').textContent = data.message;
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById('orderStatusMessage').textContent = 'Error checking order status';
            });
        });
        }
    );

        async function fetchMenuData() {
            // Show loading indicator
            document.getElementById('loadingIndicator').style.display = 'flex';

            try {
                const response = await fetch('backend/fetch_menu.php');
                if (!response.ok) throw new Error('Network response failed');
                const menuData = await response.json();

                // Hide loading indicator
                document.getElementById('loadingIndicator').style.display = 'none';

                console.log('Fetched Menu Data:', menuData);
                return menuData;
            } catch (error) {
                console.error('Error loading menu:', error);
                return null;
            }
        }

        function generateMenuStructure(menuData) {
            const navItems = document.querySelector('.nav-items');
            const mainContent = document.querySelector('.main-content');
            
            // Clear existing content
            navItems.innerHTML = '';
            mainContent.innerHTML = '';
            
            // Create category navigation and sections
            Object.keys(menuData.categories).forEach(category => {
                // Create nav item
                const navItem = document.createElement('a');
                navItem.href = '#';
                navItem.className = 'nav-item';
                navItem.dataset.target = `category_${slugify(category)}`;
                navItem.textContent = category.toUpperCase();
                navItems.appendChild(navItem);
                
                // Create category section
                const section = document.createElement('div');
                section.className = 'product-section';
                section.id = `category_${slugify(category)}`;
                section.style.display = 'none'; // Hide by default
                
                // Category title
                const title = document.createElement('h1');
                title.className = 'page-title';
                title.textContent = category;
                section.appendChild(title);
                
                // Get subcategories for this category
                const subcategories = menuData.categories[category];
                
                // Create subcategory navigation if exists
                if (subcategories.length > 0) {
                    const subNav = document.createElement('div');
                    subNav.className = 'subcategory-nav';
                    
                    // Add "All" option
                    const allBtn = document.createElement('button');
                    allBtn.className = 'subcategory-btn active';
                    allBtn.dataset.target = `all_${slugify(category)}`;
                    allBtn.textContent = 'All';
                    subNav.appendChild(allBtn);
                    
                    // Add subcategory buttons
                    subcategories.forEach(subcategory => {
                        const subBtn = document.createElement('button');
                        subBtn.className = 'subcategory-btn';
                        subBtn.dataset.target = `subcategory_${slugify(subcategory)}`;
                        subBtn.textContent = subcategory;
                        subNav.appendChild(subBtn);
                    });
                    
                    section.appendChild(subNav);
                    
                    // Create "All" products grid
                    const allGrid = createProductGrid(menuData.menuItems.filter(
                        item => item.category === category
                    ));
                    allGrid.id = `all_${slugify(category)}`;
                    section.appendChild(allGrid);
                    
                    // Create subcategory grids
                    subcategories.forEach(subcategory => {
                        const subGrid = createProductGrid(menuData.menuItems.filter(
                            item => item.category === category && item.subcategory === subcategory
                        ));
                        subGrid.id = `subcategory_${slugify(subcategory)}`;
                        subGrid.style.display = 'none';
                        section.appendChild(subGrid);
                    });
                } else {
                    // No subcategories - create single grid
                    const grid = createProductGrid(menuData.menuItems.filter(
                        item => item.category === category
                    ));
                    section.appendChild(grid);
                }
                
                mainContent.appendChild(section);
            });

            // Show first category by default
            const firstSection = document.querySelector('.product-section');
            if (firstSection) {
                firstSection.style.display = 'block';
                document.querySelector('.nav-item').classList.add('active');
            }
        }

        // Helper function to create slug-like IDs
        function slugify(text) {
            return text.toString().toLowerCase()
                .replace(/\s+/g, '-')           // Replace spaces with -
                .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
                .replace(/\-\-+/g, '-')         // Replace multiple - with single -
                .replace(/^-+/, '')             // Trim - from start of text
                .replace(/-+$/, '');            // Trim - from end of text
        }

        function createProductGrid(items) {
            const grid = document.createElement('div');
            grid.className = 'product-grid';
            
            if (items.length === 0) {
                grid.innerHTML = '<p class="no-items">No items in this category</p>';
                return grid;
            }
            
            items.forEach(item => {
                const card = document.createElement('div');
                card.className = 'product-card';
                card.dataset.productId = item.menu_id;
                card.innerHTML = `
                    <div class="product-image">
                        <img src="${item.picture}" alt="${item.name}" 
                            onerror="this.src='https://placehold.co/300x200?text=Image+Not+Found'">
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">${item.name}</h3>
                        <p class="product-price">RM${parseFloat(item.price).toFixed(2)}</p>
                        <button class="add-to-cart-btn">Add To Cart</button>
                    </div>
                `;
                grid.appendChild(card);
            });
            
            return grid;
        }

        function initializeMenuInteractions() {
            // Category navigation
            document.querySelectorAll('.nav-item').forEach(item => {
                item.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetId = this.dataset.target;
                    console.log(`target id: ${targetId}`);

                    // Hide all sections
                    document.querySelectorAll('.product-section').forEach(section => {
                        section.style.display = 'none';
                    });
                    
                    // Show selected section
                    document.getElementById(targetId).style.display = 'block';
                    
                    // Hide all subcategory grids if any
                    document.querySelectorAll('.product-grid').forEach(grid => {
                        if (grid.id.includes('subcategory_')) {
                            grid.style.display = 'none';
                        }
                    });
                    
                    // Show "All" grid if exists
                    const allGrid = document.getElementById(`all_${targetId.split('_')[1]}`);
                    if (allGrid) allGrid.style.display = 'grid';
                    
                    // Update active states
                    document.querySelectorAll('.nav-item').forEach(navItem => {
                        navItem.classList.remove('active');
                    });
                    document.querySelectorAll('.subcategory-btn').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    
                    this.classList.add('active');
                    const defaultBtn = document.querySelector(`#${targetId} .subcategory-btn`);
                    if (defaultBtn) defaultBtn.classList.add('active');
                });
            });
            
            // Subcategory navigation
            document.addEventListener('click', function(e) {
                if (!e.target.classList.contains('subcategory-btn')) return;
                e.preventDefault();
                
                const targetId = e.target.dataset.target;
                const section = e.target.closest('.product-section');
                
                // Hide all grids in this section
                section.querySelectorAll('.product-grid').forEach(grid => {
                    grid.style.display = 'none';
                });
                
                // Show selected grid
                document.getElementById(targetId).style.display = 'grid';
                
                // Update active subcategory button
                section.querySelectorAll('.subcategory-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                e.target.classList.add('active');
            });
        }


        /**
         * Simulated function to check order status (replace with real backend API call).
         * @param {string} orderNumber - The order number to check.
         * @returns {string} The status message.
         */

        // Logout click event to redirect to landing page
        document.querySelector('.logout-btn').addEventListener('click', function() {
            fetch('backend/logout.php', {
                method: 'POST'
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    window.location.href = 'landing.html';
                }
            })
            .catch(error => {
                console.error('Logout error:', error);
            });
        });
    </script>
</body>
</html>
