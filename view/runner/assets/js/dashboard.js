// Dummy data for orders
const dummyCurrentOrders = [
  {
    id: "21345",
    customer: "Michelle",
    address: "100, Jalan Bandar, Taman Bahagia, 50000 Durian Tunggal",
    status: "waiting",
    time: new Date(Date.now() - 1000 * 60 * 15) // 15 minutes ago
  },
  {
    id: "21346",
    customer: "Marvin McKinney",
    address: "25, Jalan Melaka Raya, Taman Indah, 75000 Melaka",
    status: "in-kitchen",
    time: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
  },
  {
    id: "21347",
    customer: "Sarah Connor",
    address: "45, Jalan Sultan, Bandar Hilir, 75000 Melaka",
    status: "ready",
    time: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
  },
  {
    id: "21348",
    customer: "John Doe",
    address: "12, Jalan Hang Tuah, Taman Merdeka, 75300 Melaka",
    status: "waiting",
    time: new Date(Date.now() - 1000 * 60 * 45) // 45 minutes ago
  },
  {
    id: "21349",
    customer: "Emily Wong",
    address: "88, Jalan Bunga Raya, Taman Sejahtera, 75450 Melaka",
    status: "delivering",
    time: new Date(Date.now() - 1000 * 60 * 10) // 10 minutes ago
  },
  {
    id: "21350",
    customer: "Ahmad Rahman",
    address: "33, Jalan Mawar, Taman Damai, 75200 Melaka",
    status: "waiting",
    time: new Date(Date.now() - 1000 * 60 * 20) // 20 minutes ago
  }
];

const dummyCompletedOrders = [
  {
    id: "21340",
    customer: "Lisa Park",
    address: "67, Jalan Tun Razak, Bandar Baru, 75000 Melaka",
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    status: "completed"
  },
  {
    id: "21341",
    customer: "David Kim",
    address: "22, Jalan Laksamana, Taman Seri, 75300 Melaka",
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 1), // 1 hour ago
    status: "completed"
  },
  {
    id: "21342",
    customer: "Maria Santos",
    address: "55, Jalan Bendahara, Kampung Jawa, 75200 Melaka",
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    status: "completed"
  },
  {
    id: "21343",
    customer: "Robert Chen",
    address: "99, Jalan Portugis, Bandar Hilir, 75000 Melaka",
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    status: "completed"
  },
  {
    id: "21344",
    customer: "Jennifer Lopez",
    address: "11, Jalan Kota, Taman Melaka Raya, 75000 Melaka",
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    status: "completed"
  }
];

// Function to get status display info
function getStatusInfo(status) {
  const statusMap = {
    'waiting': { class: 'status-waiting', text: 'Waiting', button: 'Accept' },
    'in-kitchen': { class: 'status-delivering', text: 'In Kitchen', button: 'Update Status' },
    'ready': { class: 'status-ready', text: 'Ready', button: 'Mark Delivering' },
    'delivering': { class: 'status-delivering', text: 'Delivering', button: 'Mark Completed' },
    'completed': { class: 'status-completed', text: 'Completed', button: null }
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
    'ready': 1,
    'delivering': 2,
    'in-kitchen': 3,
    'waiting': 4
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
  const sortedOrders = sortCurrentOrders([...dummyCurrentOrders]);
  
  // Clear existing orders (keep header)
  const header = container.querySelector('.orders-header');
  container.innerHTML = '';
  container.appendChild(header);
  
  sortedOrders.forEach((order, index) => {
    const statusInfo = getStatusInfo(order.status);
    const isHighlighted = order.status !== 'waiting';
    
    const orderRow = document.createElement('div');
    orderRow.className = `order-row ${isHighlighted ? 'highlighted' : ''}`;
    
    orderRow.innerHTML = `
      <div class="order-id">Order#${order.id}</div>
      <div class="customer-name">${order.customer}</div>
      <div class="customer-address">${order.address}</div>
      <div class="status-tag ${statusInfo.class}">${statusInfo.text}</div>
      ${statusInfo.button ? `<button class="accept-btn" onclick="updateOrderStatus('${order.id}')">${statusInfo.button}</button>` : '<div></div>'}
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
  const sortedOrders = [...dummyCompletedOrders].sort((a, b) => b.completedAt - a.completedAt);
  
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
function updateOrderStatus(orderId) {
  const order = dummyCurrentOrders.find(o => o.id === orderId);
  if (!order) return;
  
  const statusFlow = {
    'waiting': 'in-kitchen',
    'in-kitchen': 'ready',
    'ready': 'delivering',
    'delivering': 'completed'
  };
  
  const currentStatus = order.status;
  const nextStatus = statusFlow[currentStatus];
  
  if (!nextStatus) return;
  
  const statusInfo = getStatusInfo(currentStatus);
  const nextStatusInfo = getStatusInfo(nextStatus);
  
  if (confirm(`${statusInfo.button} for Order #${orderId}?`)) {
    if (nextStatus === 'completed') {
      // Move to completed orders
      const completedOrder = {
        id: order.id,
        customer: order.customer,
        address: order.address,
        completedAt: new Date(),
        status: 'completed'
      };
      
      dummyCompletedOrders.unshift(completedOrder);
      
      // Remove from current orders
      const orderIndex = dummyCurrentOrders.findIndex(o => o.id === orderId);
      if (orderIndex > -1) {
        dummyCurrentOrders.splice(orderIndex, 1);
      }
      
      alert(`Order #${orderId} completed successfully!`);
      renderCurrentOrders();
      
    } else {
      // Update status
      order.status = nextStatus;
      alert(`Order #${orderId} status updated to ${nextStatusInfo.text}!`);
      renderCurrentOrders();
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
function showProfile() {
  alert("Profile page - Coming soon!");
  toggleDropdown();
}

function showSettings() {
  alert("Settings page - Coming soon!");
  toggleDropdown();
}

function showOrders() {
  showPage("current-orders");
  document
    .querySelector("[onclick=\"showPage('current-orders')\"]")
    .classList.add("active");
  toggleDropdown();
}

function showReports() {
  showPage("analytics");
  document
    .querySelector("[onclick=\"showPage('analytics')\"]")
    .classList.add("active");
  toggleDropdown();
}

function logout() {
  if (confirm("Are you sure you want to logout?")) {
    // Add logout logic here
    alert("Logged out successfully!");
    // Redirect to login page
    // window.location.href = '/login.html';
  }
  toggleDropdown();
}

// Function to simulate adding new orders
function addNewOrder() {
  const newOrderId = String(Math.max(...dummyCurrentOrders.map(o => parseInt(o.id))) + 1);
  const customers = ["Alex Johnson", "Sophie Lee", "Michael Brown", "Anna Davis", "Chris Wilson"];
  const addresses = [
    "77, Jalan Bukit Baru, Taman Harmoni, 75150 Melaka",
    "44, Jalan Cheng Ho, Bandar Hilir, 75000 Melaka",
    "66, Jalan Laksamana, Taman Seri, 75300 Melaka",
    "23, Jalan Bendahara, Kampung Jawa, 75200 Melaka"
  ];
  
  const newOrder = {
    id: newOrderId,
    customer: customers[Math.floor(Math.random() * customers.length)],
    address: addresses[Math.floor(Math.random() * addresses.length)],
    status: "waiting",
    time: new Date()
  };
  
  dummyCurrentOrders.push(newOrder);
  renderCurrentOrders();
  
  // Show notification
  simulateNewOrder();
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

// Simulate new orders every 2 minutes for demo
setInterval(() => {
  // Randomly add new orders (30% chance every 2 minutes)
  if (Math.random() < 0.3) {
    addNewOrder();
  }
}, 120000);

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  console.log("SUP TULANG ZZ Order Management System loaded");
  
  // Load initial data
  renderCurrentOrders();
  renderCompletedOrders();
  
  // Add CSS for new status classes
  const style = document.createElement('style');
  style.textContent = `
    .status-ready {
      background: #3498db;
      color: white;
    }
    
    .status-completed {
      background: #96ff96;
      color: #214b17;
    }
    
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
  `;
  document.head.appendChild(style);
});
