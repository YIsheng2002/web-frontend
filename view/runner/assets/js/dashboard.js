
let currentOrders = [];
let completedOrders = [];

// Function to get status display info
function getStatusInfo(status) {
  const statusMap = {
    'assigned': { class: 'status-ready', text: 'Assigned', button: 'Mark Picked Up' },
    'picked up': { class: 'status-pickup', text: 'Picked Up', button: 'Mark In Transit' },
    'in transit': { class: 'status-delivering', text: 'In Transit', button: 'Mark Delivered' },
    'delivered': { class: 'status-completed', text: 'Delivered', button: null }
  };
  return statusMap[status] || { class: 'status-waiting', text: status, button: 'Update' };
}

// Function to format time
function formatTime(date) {
  return date.toLocaleTimeString('en-MY', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
}

// Function to format date
function formatDate(date) {
  return date.toLocaleString('en-MY', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

// Function to sort current orders (non-waiting orders first)
function sortCurrentOrders(orders) {
  const statusPriority = {
    'assigned': 1,
    'picked up': 2,
    'in transit': 3,
    'delivered': 4
  };
  
  return orders.sort((a, b) => {
    const priorityA = statusPriority[a.status] || 999;
    const priorityB = statusPriority[b.status] || 999;
    
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }
    
    // If same priority, sort by time (oldest first)
    return a.time - b.time;
  });
}

// Function to render current orders
function renderCurrentOrders() {
  const container = document.querySelector('#current-orders .orders-container');
  const sortedOrders = sortCurrentOrders([...currentOrders]);
  
  // Clear existing orders (keep header)
  const header = container.querySelector('.orders-header');
  container.innerHTML = '';
  container.appendChild(header);
  
  sortedOrders.forEach((order, index) => {
    const statusInfo = getStatusInfo(order.status);
    const isHighlighted = order.status == 'assigned' || order.status == 'picked up';
    
    const orderRow = document.createElement('div');
    orderRow.className = `order-row ${isHighlighted ? 'highlighted' : ''}`;
    
    orderRow.innerHTML = `
      <div class="order-id">Order#${order.id}</div>
      <div class="customer-name">${order.customer}</div>
      <div class="customer-address">${order.address}</div>
      <div class="status-tag ${statusInfo.class}">${statusInfo.text}</div>
      ${statusInfo.button ? `<button class="accept-btn" onclick="updateOrderStatus(${order.id})">${statusInfo.button}</button>` : '<div></div>'}
    `;
    
    container.appendChild(orderRow);
  });
}

// Function to render completed orders
function renderCompletedOrders() {
  const container = document.querySelector('#completed-orders .orders-container');
  
  // Clear existing orders (keep header)
  const header = container.querySelector('.orders-header');
  container.innerHTML = '';
  container.appendChild(header);
  
  // Sort by completion time (most recent first)
  const sortedOrders = [...completedOrders].sort((a, b) => b.completedAt - a.completedAt);
  
  sortedOrders.forEach((order, index) => {
    const orderRow = document.createElement('div');
    orderRow.className = `order-row ${index % 2 === 1 ? 'highlighted' : ''}`;
    
    orderRow.innerHTML = `
      <div class="order-id">Order#${order.id}</div>
      <div class="customer-name">${order.customer}</div>
      <div class="customer-address">${formatDate(order.completedAt)}</div>
      <div class="status-tag" style="background: #96ff96; color: #214b17;">Completed</div>
    `;
    
    container.appendChild(orderRow);
  });
}

// Updated order status management
async function updateOrderStatus(orderId) {
  const order = currentOrders.find(o => o.id == orderId);
  if (!order) return;

  const statusFlow = {
    'assigned': 'picked up',
    'picked up': 'in transit',
    'in transit': 'delivered'
  };

  const currentStatus = order.status;
  const nextStatus = statusFlow[currentStatus];

  if (!nextStatus) return;

  const statusInfo = getStatusInfo(currentStatus);
  const nextStatusInfo = getStatusInfo(nextStatus);

  if (confirm(`${statusInfo.button} for Order #${orderId}?`)) {
    showLoading(`Updating Order #${orderId} to ${nextStatusInfo.text}...`);

    try {
      console.log(JSON.stringify({
          ...order,
          status: nextStatus,
          runnerId: JSON.parse(localStorage.getItem('user')).user_id // Assuming user ID is stored in localStorage
        }));
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://127.0.0.1:8000/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...order,
          status: nextStatus,
          runner_id: JSON.parse(localStorage.getItem('user')).user_id // Assuming user ID is stored in localStorage
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to update status');
      }

      const updatedOrder = await response.json();
      order.status = updatedOrder.status;

      alert(`Order #${orderId} updated to ${nextStatusInfo.text}`);
      renderCurrentOrders();

    } catch (error) {
      console.error('Error:', error);
      alert('Failed to update order: ' + error.message);
    } finally {
      hideLoading();
    }
  }
}

// Replace the old acceptOrder function
function acceptOrder(orderId) {
  updateOrderStatus(orderId);
}

// Dropdown functionality
function toggleDropdown() {
  const dropdown = document.getElementById("userDropdown");
  dropdown.classList.toggle("show");
}

// Close dropdown when clicking outside
document.addEventListener("click", function (event) {
  const userMenu = document.querySelector(".user-menu");
  const dropdown = document.getElementById("userDropdown");

  if (!userMenu.contains(event.target)) {
    dropdown.classList.remove("show");
  }
});

// Page navigation
function showPage(pageId) {
  // Hide all pages
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active");
  });

  // Remove active class from all tabs
  document.querySelectorAll(".nav-tab").forEach((tab) => {
    tab.classList.remove("active");
  });

  // Show selected page
  document.getElementById(pageId).classList.add("active");

  // Add active class to clicked tab
  event.target.classList.add("active");
  
  // Render data based on page
  if (pageId === 'completed-orders') {
    renderCompletedOrders();
  } else if (pageId === 'current-orders') {
    renderCurrentOrders();
  }
}

// User menu actions
function showOrders() {
  showPage("current-orders");
  document
    .querySelector("[onclick=\"showPage('current-orders')\"]")
    .classList.add("active");
  toggleDropdown();
}

function logout() {
  if (confirm("Are you sure you want to logout?")) {
    // Add logout logic here
    alert("Logged out successfully!");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    // Redirect to login page
    window.location.href = '/login.html';
  }
  toggleDropdown();
}

// Auto-refresh orders every 30 seconds
setInterval(() => {
  renderCurrentOrders();
  console.log("Refreshing orders...");
}, 30000);

// Real-time order notifications (simulate)
function simulateNewOrder() {
  // Create notification
  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #e74c3c;
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
  `;
  notification.innerHTML = "🔔 New order received!";
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}

function showLoading(message = 'Processing...') {
  const spinner = document.getElementById('loading-spinner');
  spinner.textContent = message;
  spinner.style.display = 'block';
}

function hideLoading() {
  const spinner = document.getElementById('loading-spinner');
  spinner.style.display = 'none';
}

async function fetchRunnerOrders() {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('authToken');

        if (!user || !token || user.role !== 'runner') {
            throw new Error('Runner not logged in or missing token.');
        }

        const runnerType = user.runner_type;
        const runnerId = user.user_id;


        console.log(`http://127.0.0.1:8000/api/orders/runner?runner_type=${encodeURIComponent(runnerType)}&runner_id=${runnerId}`);
        const response = await fetch(`http://127.0.0.1:8000/api/orders/runner?runner_type=${encodeURIComponent(runnerType)}&runner_id=${runnerId}`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch runner orders.');
        }

        const orders = await response.json();

        // Process orders into two arrays
        currentOrders = orders
            .filter(order => ['assigned', 'picked up', 'in transit'].includes(order.status))
            .map(order => ({
                id: order.order_id,
                customer: `${order.customer_name}`,
                address: order.delivery_address,
                status: order.status,
                time: new Date(order.created_at)
            }));

        completedOrders = orders
            .filter(order => order.status === 'delivered')
            .map(order => ({
                id: order.order_id,
                customer: `Customer#${order.customer_name}`,
                address: order.delivery_address,
                completedAt: new Date(order.updated_at),
                status: 'completed'
            }));

        renderCurrentOrders();
        renderCompletedOrders();

    } catch (error) {
        console.error('Error fetching runner orders:', error.message);
    }
}

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  console.log("SUP TULANG ZZ Order Management System loaded");

  fetchRunnerOrders(); // Will call renderCurrentOrders and renderCompletedOrders internally
});
