// Dropdown functionality
function toggleDropdown() {
  const dropdown = document.getElementById('userDropdown');
  dropdown.classList.toggle('show');
}

// Close dropdown when clicking outside
document.addEventListener('click', function (event) {
  const userMenu = document.querySelector('.user-menu');
  const dropdown = document.getElementById('userDropdown');

  if (!userMenu.contains(event.target)) {
    dropdown.classList.remove('show');
  }
});

// Page navigation
function showPage(pageId, clickedElement) {
  // Hide all pages
  document.querySelectorAll('.main-content').forEach(page => {
    page.classList.remove('active');
  });

  // Show selected page
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.add('active');
  }

  // Remove active class from all sidebar links
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.classList.remove('active');
  });

  // Add active class to clicked element
  if (clickedElement) {
    clickedElement.classList.add('active');
  }
}

// Add this new function to handle order tab switching
function showOrderTab(tabId, event) {
  // Hide all order tab content
  document.querySelectorAll('#orders .page').forEach(page => {
    page.classList.remove('active');
  });

  // Show selected tab
  const targetTab = document.getElementById(tabId);
  if (targetTab) {
    targetTab.classList.add('active');
  }

  // Update nav-tab states
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.classList.remove('active');
  });

  if (event?.target) {
    event.target.classList.add('active');
  }

  // Update title
  const pageTitle = document.querySelector('#orders .page-title');
  if (pageTitle) {
    pageTitle.textContent = {
      'new-orders': 'New Orders',
      'current-orders': 'Current Orders',
      'completed-orders': 'Completed Orders'
    }[tabId] || '';
  }
}



// Sidebar navigation functions
function showMembership(event) {
  event.preventDefault();
  showPage('membership', event.currentTarget);
}

function showOrders(event) {
  event.preventDefault();
  showPage('orders', event.currentTarget);
}

function showAddMemberForm(event) {
  event.preventDefault();
  showPage('membershipform', event.currentTarget);
}

function showEditMemberForm(event) {
  event.preventDefault();
  showPage('editMembershipform', event.currentTarget);
}

function showNotifications(event) {
  event.preventDefault();
  showPage('notifications', event.currentTarget);
}

// User menu actions
function showProfile() {
  alert('Profile page - Coming soon!');
  toggleDropdown();
}

function showSettings() {
  alert('Settings page - Coming soon!');
  toggleDropdown();
}

function showOrdersFromDropdown() {
  showPage('orders');
  // Also update sidebar active state
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.classList.remove('active');
  });
  const ordersLink = document.querySelector('[onclick="showOrders(event)"]');
  if (ordersLink) {
    ordersLink.classList.add('active');
  }
  toggleDropdown();
}

function selectFilters() {
  // add logic here to handle filter selection  
  const dropdown = document.getElementById('filterDropdown');
  dropdown.classList.toggle('show'); // This will display or hide the dropdown
  toggleDropdown();
}

function filterByStatus(status) {
  // Handle the filter logic here
  switch (status) {
    case 'olderst-member':
      alert('Filtering by oldest member - Coming soon!');

      break;
    case 'newest-member':
      alert('Filtering by newest member - Coming soon!');
      break;
    case 'highest-total-order':
      alert('Filtering by highest total orders - Coming soon!');
      break;
    case 'lowest-total-order':
      alert('Filtering by lowest total orders - Coming soon!');
      break;
    default:
      console.log("Unknown filter selected:", status);
  }

  // You can replace console.log with actual filtering logic later
}

function acceptOrder(orderId) {
  alert("Accepted order: " + orderId);
  // You can update status here
}

function declineOrder(orderId) {
  alert("Declined order: " + orderId);
}

function assignRunner(runner, orderId) {
  const row = document.querySelector(`.order-row[data-id="${orderId}"]`);
  const dd = row.querySelector('.runner-dropdown');
  const btn = row.querySelector('.assign-runner');

  // mark as assigned
  dd.classList.remove('unassigned');
  dd.classList.add('assigned');

  btn.classList.remove('unassigned');
  btn.classList.add('assigned');
  btn.textContent = `Runner: ${runner}`;

  alert(`Assigned ${runner} to Order ${orderId}`);
}



function showReports() {
  alert('Reports page - Coming soon!');
  toggleDropdown();
}

function logout() {
  if (confirm('Are you sure you want to logout?')) {
    alert('Logged out successfully!');
    // Add your logout logic here
    // For example: window.location.href = '/login.html';
  }
  toggleDropdown();
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', function () {
  console.log('Dashboard loaded successfully!');

  // You can add any initialization code here
  // For example, loading data from API, setting up event listeners, etc.
});

// Utility function to add new membership card
function addMembershipCard(memberData) {
  const membershipCards = document.querySelector('.membership-cards');
  const cardHTML = `
        <div class="membership-card">
            <div class="membership-title">${memberData.type} Member</div>
            <div class="membership-details">
                <p><strong>${memberData.name}</strong></p>
                <p>Member since: ${memberData.joinDate}</p>
                <p>Status: ${memberData.status}</p>
                <p>Benefits: ${memberData.benefits}</p>
            </div>
        </div>
    `;
  membershipCards.insertAdjacentHTML('beforeend', cardHTML);
}

// Utility function to add new order
function addOrderItem(orderData) {
  const orderList = document.querySelector('.order-list');
  const orderHTML = `
        <div class="order-item">
            <span class="order-id">Order #${orderData.id}</span>
            <span class="order-status ${orderData.status.toLowerCase()}">${orderData.status}</span>
        </div>
    `;
  orderList.insertAdjacentHTML('beforeend', orderHTML);
}

function handleAddMember() {
  form = document.getElementById('addMemberForm');


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
    const isHighlighted = order.status !== 'delivering';

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

const dummyNewOrders = [
  {
    id: "22001",
    customer: "Michelle",
    address: "100, Jalan Bandar, Taman Bahagia, 50000 Durian Tunggal",
    status: "not assigned",
    time: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
  },
  {
    id: "22002",
    customer: "Marvin McKinney",
    address: "25, Jalan Melaka Raya, Taman Indah, 75000 Melaka",
    status: "not assigned",
    time: new Date(Date.now() - 1000 * 60 * 10) // 10 minutes ago
  },
  {
    id: "22003",
    customer: "Sarah Connor",
    address: "45, Jalan Sultan, Bandar Hilir, 75000 Melaka",
    status: "not assigned",
    time: new Date(Date.now() - 1000 * 60 * 3) // 3 minutes ago
  },
  {
    id: "22004",
    customer: "John Doe",
    address: "12, Jalan Hang Tuah, Taman Merdeka, 75300 Melaka",
    status: "not assigned",
    time: new Date(Date.now() - 1000 * 60 * 20) // 20 minutes ago
  },
  {
    id: "22005",
    customer: "Emily Wong",
    address: "88, Jalan Bunga Raya, Taman Sejahtera, 75450 Melaka",
    status: "not assigned",
    time: new Date(Date.now() - 1000 * 60 * 1) // 1 minute ago
  },
  {
    id: "22006",
    customer: "Ahmad Rahman",
    address: "33, Jalan Mawar, Taman Damai, 75200 Melaka",
    status: "not assigned",
    time: new Date(Date.now() - 1000 * 60 * 15) // 15 minutes ago
  },
  {
    id: "22007",
    customer: "Nurul Aisyah",
    address: "77, Jalan Kenanga, Taman Melawati, 75250 Melaka",
    status: "not assigned",
    time: new Date(Date.now() - 1000 * 60 * 25)    // 25 min ago
  },
  {
    id: "22008",
    customer: "Lim Guan",
    address: "56, Jalan Tun Fatimah, Taman Sri Melaka, 75400 Melaka",
    status: "not assigned",
    time: new Date(Date.now() - 1000 * 60 * 12)    // 12 min ago
  },
  {
    id: "22009",
    customer: "Maria Gonzales",
    address: "101, Jalan Tun Razak, Taman Maju, 75350 Melaka",
    status: "not assigned",
    time: new Date(Date.now() - 1000 * 60 * 30)    // 30 min ago
  },
  {
    id: "22010",
    customer: "Jason Lee",
    address: "9, Jalan Bunga Raya, Taman Damai, 75460 Melaka",
    status: "not assigned",
    time: new Date(Date.now() - 1000 * 60 * 2)     // 2 min ago
  }
];

const dummyMemberProfiles = [
  {
    fullName: "Michelle Tan",
    email: "michelle.tan@example.com",
    gender: "Female",
    phone: "012-3456789"
  },
  {
    fullName: "Marvin McKinney",
    email: "marvin.mckinney@example.com",
    gender: "Male",
    phone: "011-2233445"
  },
  {
    fullName: "Sarah Connor",
    email: "sarah.connor@example.com",
    gender: "Female",
    phone: "017-8899001"
  },
  {
    fullName: "John Doe",
    email: "john.doe@example.com",
    gender: "Male",
    phone: "019-5566778"
  },
  {
    fullName: "Emily Wong",
    email: "emily.wong@example.com",
    gender: "Female",
    phone: "013-7788990"
  },
  {
    fullName: "Ahmad Rahman",
    email: "ahmad.rahman@example.com",
    gender: "Male",
    phone: "010-1111222"
  },
  {
    fullName: "Hafiz Rahman",
    email: "hafiz.rahman@example.com",
    gender: "Male",
    phone: "018-1234567"
  },
  {
    fullName: "Nurul Aisyah Binti Mohamad",
    email: "nurul.aisyah@example.com",
    gender: "Female",
    phone: "014-9988776"
  },
  {
    fullName: "Lim Guan Yi",
    email: "lim.guan@example.com",
    gender: "Male",
    phone: "016-3322114"
  },
  {
    fullName: "Maria Gonzales",
    email: "maria.gonzales@example.com",
    gender: "Female",
    phone: "017-4445556"
  },
  {
    fullName: "Jason Lee",
    email: "jason.lee@example.com",
    gender: "Male",
    phone: "012-6688994"
  },
  {
    fullName: "Putri Zulaikha",
    email: "putri.zulaikha@example.com",
    gender: "Female",
    phone: "019-8899771"
  },
  {
    fullName: "Ravi Kumar",
    email: "ravi.kumar@example.com",
    gender: "Male",
    phone: "018-7744552"
  }
];

function editMember() {
  if (confirm('Press Ok to confirm edit.') == true) {
    alert("Edit successful, Member's details have been updated.");
  } else {
    alert("Edit failed.")
  }
}

function deleteMember() {
  if (confirm('Press Ok to confirm delete.') == true) {
    alert("Delete successful, member has been deleted.");
  } else {
    alert("Delete failed.")
  }
}