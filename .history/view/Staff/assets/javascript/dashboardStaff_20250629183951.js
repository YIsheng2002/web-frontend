/*Initialization*/
document.addEventListener('DOMContentLoaded', function () {
  fetchMembers();
  fetchOrders();

  const addMemberForm = document.getElementById('addMemberForm');
  if (addMemberForm) {
    addMemberForm.addEventListener('submit', handleAddMember);
  }

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
function showMembership(event) {
  event.preventDefault();
  showPage('membership', event.currentTarget);
}
function showOrders(event) { 
  event.preventDefault(); showPage('orders', event.currentTarget); 
}

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

/* member Handling */
async function fetchMembers() {
  try {
    const response = await fetch('http://localhost/orderManagementSystemFrontend/view/Staff/backend-api/getMembers.php');
    const data = await response.json();
    if (data.success) {
      renderMembers(data.data);
    } else {
      alert('Failed to load members: ' + data.message);
    }
  } catch (err) {
    console.error('Fetch Members Error:', err);
  }
}

function renderMembers(members) {
  const container = document.querySelector('.members-container');
  const header = container.querySelector('.members-header');
  container.innerHTML = '';
  container.appendChild(header);

  if (members.length === 0) {
    // 👇 Append fallback message
    const emptyMessage = document.createElement('div');
    emptyMessage.className = 'no-members-message';
    emptyMessage.innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <img src="../../assets/images/no-members.png" alt="No Members" style="max-width: 300px; margin-bottom: 16px;" />
        <p style="font-weight: bold; font-size: 18px;">No Members at this time</p>
        <p>Members will appear here after they register account.</p>
      </div>
    `;
    container.appendChild(emptyMessage);
    return;
  }

  members.forEach((member, index) => {
    const row = document.createElement('div');
    row.className = index % 2 === 0 ? 'member-row' : 'member-row-highlighted';
    row.innerHTML = `
      <div class="member-name">
        <img src="../../assets/images/avatar-${member.gender.toLowerCase()}.png" class="member-avatar">
        ${member.fullname}
      </div>
      <div class="member-email">${member.email}</div>
      <div class="member-gender">${member.gender}</div>
      <button class="member-edit" onclick="showEditMemberForm(event)">Edit</button>
      <button class="member-delete" onclick="deleteMember()">Delete</button>`;
    container.appendChild(row);
  });
}

async function handleAddMember(event) {
  event.preventDefault();

  const form = document.getElementById('addMemberForm');
  const submitButton = form.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;

  // Clear any previous validation errors
  Utils.clearFormErrors(form);

  

  // Validate form
        if (!Utils.validateForm(form)) {
            return;
        }

        // Check password match
        if (!this.validatePasswordMatch()) {
            return;
        }

  // Collect form data
  const formData = {
    memberType: document.getElementById('memberType').value,
    firstName: document.getElementById('member-firstName').value,
    lastName: document.getElementById('member-lastName').value,
    username: document.getElementById('member-username').value,
    email: document.getElementById('member-email').value,
    password: document.getElementById('member-password').value,
    phoneNumber: document.getElementById('member-phonenumber').value,
    gender: document.getElementById('memberGender').value,
    runnerType: document.getElementById('member-runnerType').value
  };
  
  try {
    // Set loading state
    submitButton.setAttribute('data-original-text', originalText);
    Utils.setLoading(submitButton, true);

    // Call backend API
    const response = await addMemberApi(formData);

    if (response.success) {
      Utils.showNotification('Member added successfully!', 'success');
      fetchMembers(); // Refresh list
      showMembership(new Event('click')); // Navigate to member list
    } else {
      throw new Error(response.message || 'Failed to add member');
    }

  } catch (error) {
    Utils.showNotification(error.message, 'error');
  } finally {
    Utils.setLoading(submitButton, false);
    submitButton.textContent = originalText;
  }
}


function handleMemberTypeChange() {
  const memberType = document.getElementById('memberType').value;
  const runnerTypeGroup = document.getElementById('runnerTypeGroup');

  if (memberType === 'runner') {
    runnerTypeGroup.classList.remove('hidden');
  } else {
    runnerTypeGroup.classList.add('hidden');
    document.getElementById('member-runnerType').value = ''; // Reset dropdown
  }
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

async function addMemberApi(formData) {
  try {
    const response = await fetch('http://localhost/orderManagementSystemFrontend/view/Staff/backend-api/addMembers.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'addMember',
        data: formData
      })
    });

    const result = await response.json();
    console.log('Add Member API response:', result);
    return result;
  } catch (error) {
    console.error('Add Member API error:', error);
    return { success: false, message: 'API error occurred' };
  }
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

async function fetchOrders() {
  try {
    const response = await fetch('./backend-api/getOrders.php');
    const data = await response.json();
    if (data.success) {
      renderOrders(data.data);
    } else {
      alert('Failed to load orders: ' + data.message);
    }
  } catch (err) {
    console.error('Fetch Orders Error:', err);
  }
}

function renderOrders(orderList) {
  const container = document.querySelector('#new-orders .orders-container');
  const header = container.querySelector('.orders-header');
  container.innerHTML = '';
  container.appendChild(header);

  orderList.forEach(order => {
    const row = document.createElement('div');
    row.className = 'order-row highlighted';
    row.innerHTML = `
      <div class="order-id">Order#${order.id}</div>
      <div class="customer-name">${order.customer}</div>
      <div class="customer-address">${order.address}</div>
      <button class="accept-btn" onclick="acceptOrder('${order.id}')">Accept</button>
      <button class="decline-btn" onclick="declineOrder('${order.id}')">Decline</button>`;
    container.appendChild(row);
  });
}



