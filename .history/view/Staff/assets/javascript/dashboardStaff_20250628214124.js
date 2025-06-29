// dashboardStaff.js - Refactored for clarity and modularity

/*Initialization*/
document.addEventListener('DOMContentLoaded', function () {
  console.log('Dashboard loaded successfully!');
});

/*Dropdown Handling*/
function toggleDropdown() {
  const dropdown = document.getElementById('userDropdown');
  dropdown.classList.toggle('show');
}

document.addEventListener('click', function (event) {
  const userMenu = document.querySelector('.user-menu');
  const dropdown = document.getElementById('userDropdown');
  if (!userMenu.contains(event.target)) {
    dropdown.classList.remove('show');
  }
});

/*Page Navigation*/
function showPage(pageId, clickedElement) {
  document.querySelectorAll('.main-content').forEach(page => page.classList.remove('active'));
  const targetPage = document.getElementById(pageId);
  if (targetPage) targetPage.classList.add('active');
  document.querySelectorAll('.sidebar-link').forEach(link => link.classList.remove('active'));
  if (clickedElement) clickedElement.classList.add('active');
}

/*Sidebar Navigation Functions*/
function showMembership(event) { event.preventDefault(); showPage('membership', event.currentTarget); }
function showOrders(event) { event.preventDefault(); showPage('orders', event.currentTarget); }
function showAddMemberForm(event) { event.preventDefault(); showPage('membershipform', event.currentTarget); }
function showEditMemberForm(event) { event.preventDefault(); showPage('editMembershipform', event.currentTarget); }
function showNotifications(event) { event.preventDefault(); showPage('notifications', event.currentTarget); }
function showReports() { alert('Reports page - Coming soon!'); toggleDropdown(); }

/*User Menu Actions*/
function showProfile() { alert('Profile page - Coming soon!'); toggleDropdown(); }
function showSettings() { alert('Settings page - Coming soon!'); toggleDropdown(); }
function logout() {
  if (confirm('Are you sure you want to logout?')) {
    alert('Logged out successfully!');
    // Implement logout logic
  }
  toggleDropdown();
}
function showOrdersFromDropdown() {
  showPage('orders');
  document.querySelectorAll('.sidebar-link').forEach(link => link.classList.remove('active'));
  const ordersLink = document.querySelector('[onclick="showOrders(event)"]');
  if (ordersLink) ordersLink.classList.add('active');
  toggleDropdown();
}

/*Order Handling*/
function showOrderTab(tabId, event) {
  document.querySelectorAll('#orders .page').forEach(page => page.classList.remove('active'));
  const targetTab = document.getElementById(tabId);
  if (targetTab) targetTab.classList.add('active');
  document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
  if (event?.target) event.target.classList.add('active');

  const pageTitle = document.querySelector('#orders .page-title');
  if (pageTitle) {
    pageTitle.textContent = {
      'new-orders': 'New Orders',
      'current-orders': 'Current Orders',
      'completed-orders': 'Completed Orders'
    }[tabId] || '';
  }
}

function acceptOrder(orderId) { alert("Accepted order: " + orderId); }
function declineOrder(orderId) { alert("Declined order: " + orderId); }

function assignRunner(selectElement, orderId) {
  const dropdown = selectElement.parentElement;
  const selectedValue = selectElement.value;
  const selectedText = selectElement.options[selectElement.selectedIndex].text;

  if (selectedValue === 'default') {
    dropdown.classList.remove('assigned');
    hideStatusIndicator(dropdown);
    return;
  }

  dropdown.classList.add('loading');
  selectElement.disabled = true;
  setTimeout(() => {
    dropdown.classList.remove('loading');
    selectElement.disabled = false;
    dropdown.classList.add('assigned');
    updateStatusIndicator(dropdown, selectedText);
    showNotification(`${orderId} successfully assigned to ${selectedText}`, 'success');
  }, 1000);
}

function updateStatusIndicator(dropdown, runnerName) {
  const container = dropdown.parentElement;
  let statusIndicator = container.querySelector('.status-indicator');

  if (!statusIndicator) {
    statusIndicator = document.createElement('div');
    statusIndicator.className = 'status-indicator';
    container.appendChild(statusIndicator);
  }

  statusIndicator.innerHTML = `
    <div class="status-dot"></div>
    <span class="status-text">Assigned to ${runnerName}</span>
  `;
  statusIndicator.style.display = 'flex';
}

function hideStatusIndicator(dropdown) {
  const statusIndicator = dropdown.parentElement.querySelector('.status-indicator');
  if (statusIndicator) statusIndicator.style.display = 'none';
}

/*Member Handling*/
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
    </div>`;
  membershipCards.insertAdjacentHTML('beforeend', cardHTML);
}

function editMember() {
  if (confirm('Press Ok to confirm edit.')) {
    alert("Edit successful, Member's details have been updated.");
  } else {
    alert("Edit failed.");
  }
}

function deleteMember() {
  if (confirm('Press Ok to confirm delete.')) {
    alert("Delete successful, member has been deleted.");
  } else {
    alert("Delete failed.");
  }
}

/* Filters*/
function selectFilters() {
  document.getElementById('filterDropdown').classList.toggle('show');
  toggleDropdown();
}

function filterByStatus(status) {
  const filters = {
    'olderst-member': 'Filtering by oldest member - Coming soon!',
    'newest-member': 'Filtering by newest member - Coming soon!',
    'highest-total-order': 'Filtering by highest total orders - Coming soon!',
    'lowest-total-order': 'Filtering by lowest total orders - Coming soon!'
  };
  alert(filters[status] || 'Unknown filter selected');
}


 /* Utility Functions*/

function formatTime(date) {
  return date.toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function formatDate(date) {
  return date.toLocaleString('en-MY', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true
  });
}

function handleAddMember() {
  const form = document.getElementById('addMemberForm');
  // Implement form handling here
}

function renderCurrentOrders() {
  const container = document.querySelector('#current-orders .orders-container');
  const sortedOrders = sortCurrentOrders([...dummyCurrentOrders]);
  const header = container.querySelector('.orders-header');
  container.innerHTML = '';
  container.appendChild(header);

  sortedOrders.forEach(order => {
    const statusInfo = getStatusInfo(order.status);
    const orderRow = document.createElement('div');
    orderRow.className = `order-row ${order.status !== 'delivering' ? 'highlighted' : ''}`;

    orderRow.innerHTML = `
      <div class="order-id">Order#${order.id}</div>
      <div class="customer-name">${order.customer}</div>
      <div class="customer-address">${order.address}</div>
      <div class="status-tag ${statusInfo.class}">${statusInfo.text}</div>
      ${statusInfo.button ? `<button class="accept-btn" onclick="updateOrderStatus('${order.id}')">${statusInfo.button}</button>` : '<div></div>'}`;

    container.appendChild(orderRow);
  });
}

function addOrderItem(orderData) {
  const orderList = document.querySelector('.order-list');
  const orderHTML = `
    <div class="order-item">
      <span class="order-id">Order #${orderData.id}</span>
      <span class="order-status ${orderData.status.toLowerCase()}">${orderData.status}</span>
    </div>`;
  orderList.insertAdjacentHTML('beforeend', orderHTML);
}
/***********************************
 * Dummy Data
 ***********************************/
const dummyNewOrders = [
  {
    id: "22001",
    customer: "Michelle",
    address: "100, Jalan Bandar, Taman Bahagia, 50000 Durian Tunggal",
    status: "not assigned",
    time: new Date(Date.now() - 1000 * 60 * 5)
  },
  {
    id: "22002",
    customer: "Marvin McKinney",
    address: "25, Jalan Melaka Raya, Taman Indah, 75000 Melaka",
    status: "not assigned",
    time: new Date(Date.now() - 1000 * 60 * 10)
  },
  {
    id: "22003",
    customer: "Sarah Connor",
    address: "45, Jalan Sultan, Bandar Hilir, 75000 Melaka",
    status: "not assigned",
    time: new Date(Date.now() - 1000 * 60 * 3)
  },
  {
    id: "22004",
    customer: "John Doe",
    address: "12, Jalan Hang Tuah, Taman Merdeka, 75300 Melaka",
    status: "not assigned",
    time: new Date(Date.now() - 1000 * 60 * 20)
  },
  {
    id: "22005",
    customer: "Emily Wong",
    address: "88, Jalan Bunga Raya, Taman Sejahtera, 75450 Melaka",
    status: "not assigned",
    time: new Date(Date.now() - 1000 * 60 * 1)
  }
  // You can add more if needed
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
  }
  // You can extend this list as needed
];
