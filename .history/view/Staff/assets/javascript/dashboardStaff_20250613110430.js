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

function selectFilters(){
    // add logic here to handle filter selection  
          
    alert('Filter selection - Coming soon!');
       toggleDropdown();
    window.addEventListener("click", function(e) {
  if (!e.target.matches('.filter-btn')) {
    const dropdown = document.getElementById("filterDropdown");
    if (dropdown && dropdown.classList.contains('show')) {
      dropdown.classList.remove('show');
    }
  }
});
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
document.addEventListener('DOMContentLoaded', function() {
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

function handleAddMember(){
   form = document.getElementById('addMemberForm');
   

}

// Example usage:
// addMembershipCard({
//     type: 'Gold',
//     name: 'Sarah Johnson',
//     joinDate: 'May 2024',
//     status: 'Active',
//     benefits: '25% discount, free appetizer'
// });

// addOrderItem({
//     id: '12349',
//     status: 'Completed'
// });