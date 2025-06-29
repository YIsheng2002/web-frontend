/*Initialization*/
document.addEventListener('DOMContentLoaded', function () {
  fetchMembers();
  fetchOrders();

  const addMemberForm = document.getElementById('addMemberForm');
  if (addMemberForm) {
    addMemberForm.addEventListener('submit', handleAddMember);
  }

  const editMemberForm = document.getElementById('editMemberForm');
  if (editMemberForm) {
    editMemberForm.addEventListener('submit', function (e) {
      e.preventDefault();
      editMember();
    });
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
  clearAddMemberForm();
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

function renderMembers(members) {
  const container = document.querySelector('.members-container');
  const header = container.querySelector('.members-header');
  container.innerHTML = '';
  container.appendChild(header);

  if (members.length === 0) {
    // Append fallback message
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

    // Create edit button with member data
    const editButton = document.createElement('button');
    editButton.className = 'member-edit';
    editButton.textContent = 'Edit';
    editButton.onclick = function (event) {
      handleEditButtonClick(event, member);
    };

    // Create delete button
    const deleteButton = document.createElement('button');
    deleteButton.className = 'member-delete';
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = function () {
      deleteMember(member.id);
    };

    row.innerHTML = `
      <div class="member-name">
        <img src="../../assets/images/avatar-${member.gender.toLowerCase()}.png" class="member-avatar">
         ${member.firstName} ${member.lastName}
      </div>
      <div class="member-email">${member.email}</div>
      <div class="member-gender">${member.gender}</div>
    `;

    // Append buttons
    const actionDiv = document.createElement('div');
    actionDiv.className = 'member-action-buttons'; // Add this class
    actionDiv.appendChild(editButton);
    actionDiv.appendChild(deleteButton);
    row.appendChild(actionDiv);

    container.appendChild(row);
  });
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

// Validation function for edit form
function validateEditMemberForm(formData) {
  const errors = [];

  if (!formData.firstName.trim()) errors.push('First Name is required.');
  if (!formData.lastName.trim()) errors.push('Last Name is required.');
  if (!formData.username.trim()) errors.push('Username is required.');
  if (!formData.email.trim() || !formData.email.includes('@')) errors.push('Valid Email is required.');
  if (!formData.phoneNumber.trim()) errors.push('Phone Number is required.');
  if (!formData.gender) errors.push('Gender is required.');

  // Only validate passwords if they are provided
  if (formData.password.trim() && formData.password !== formData.repassword) {
    errors.push('Passwords do not match.');
  }

  return errors;
}

// Update the cancel button in your HTML to call this function
// Also update the delete function to accept member ID
function deleteMember(memberId) {
  if (confirm('Press Ok to confirm delete.')) {
    // Here you would typically call an API to delete the member
    alert("Delete successful, member has been deleted.");

    // Refresh the members list
    fetchMembers();
  } else {
    alert("Delete cancelled.");
  }
}
async function handleAddMember(event) {
  event.preventDefault();

  const form = document.getElementById('addMemberForm');
  const submitButton = form.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;

  // Collect form data
  const formData = {
    role: document.getElementById('memberType').value,
    firstName: document.getElementById('member-firstName').value,
    lastName: document.getElementById('member-lastName').value,
    username: document.getElementById('member-username').value,
    email: document.getElementById('member-email').value,
    password: document.getElementById('member-password').value,
    repassword: document.getElementById('member-repassword').value,
    phoneNumber: document.getElementById('member-phonenumber').value,
    gender: document.getElementById('memberGender').value,
    runnerType: document.getElementById('member-runnerType').value
  };

  // Validation
  const validationErrors = validateAddMemberForm(formData);
  if (validationErrors.length > 0) {
    Utils.showNotification(validationErrors.join('\n'), 'error');
    return;
  }

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

function validateAddMemberForm(formData) {
  const errors = [];

  if (!formData.role) errors.push('Member Type is required.');
  if (!formData.firstName.trim()) errors.push('First Name is required.');
  if (!formData.lastName.trim()) errors.push('Last Name is required.');
  if (!formData.username.trim()) errors.push('Username is required.');
  if (!formData.email.trim() || !formData.email.includes('@')) errors.push('Valid Email is required.');
  if (!formData.password.trim()) errors.push('Password is required.');
  if (!formData.repassword.trim()) errors.push('Re-enter password.');
  if (formData.password !== formData.repassword) errors.push('Passwords do not match.');
  if (!formData.phoneNumber.trim()) errors.push('Phone Number is required.');
  if (!formData.gender) errors.push('Gender is required.');

  // Only validate runnerType if role is "runner"
  if (formData.role === 'runner' && !formData.runnerType) {
    errors.push('Runner Type is required for runners.');
  }

  return errors;
}

function clearAddMemberForm() {
  const form = document.getElementById('addMemberForm');
  if (form) {
    form.reset(); // Reset all input fields

    // Optionally clear any custom messages or errors
    form.querySelectorAll('.error-message').forEach(el => el.remove());
  }

  // Also reset dropdown visibility if runner type was previously shown
  handleMemberTypeChange(); // Ensures runnerType field is hidden or shown correctly
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

function handleEditButtonClick(event, memberData) {
  event.preventDefault();

  // Show the edit form page
  showEditMemberForm(event);

  // Store the member data for later use
  const editForm = document.getElementById('editMemberForm');
  editForm.setAttribute('data-member-id', memberData.id);

  // Populate form fields with member data
  const editFormFields = document.querySelector('#editMembershipform');

  // Get the form elements in the edit form (note: they might have same IDs, so we need to be specific)
  const role = editFormFields.querySelector('#memberType');
  const firstNameField = editFormFields.querySelector('#member-firstName');
  const lastNameField = editFormFields.querySelector('#member-lastName');
  const usernameField = editFormFields.querySelector('#member-username');
  const emailField = editFormFields.querySelector('#member-email');
  const phoneField = editFormFields.querySelector('#member-phonenumber');
  const genderField = editFormFields.querySelector('#memberGender');
  const runnerTypeField = editFormFields.querySelector('#member-runnerType');

  // Populate the fields
  if (role) role.value = memberData.role || ''; // Default to 'staff' if not provided
  if (firstNameField) firstNameField.value = memberData.firstName || '';
  if (lastNameField) lastNameField.value = memberData.lastName || '';
  if (usernameField) usernameField.value = memberData.username || '';
  if (emailField) emailField.value = memberData.email || '';
  if (phoneField) phoneField.value = memberData.phonenumber || '';
  if (genderField) genderField.value = memberData.gender || '';
  if (runnerTypeField) runnerTypeField.value = memberData.runner_type || ''; // Default to empty if not provided     

  // Clear password fields for security
  const passwordField = editFormFields.querySelector('#member-password');
  const rePasswordField = editFormFields.querySelector('#member-repassword');
  if (passwordField) passwordField.value = '';
  if (rePasswordField) rePasswordField.value = '';
}

// Updated editMember function to handle the actual edit submission
function editMember() {
  const editForm = document.getElementById('editMemberForm');
  const memberId = editForm.getAttribute('data-member-id');

  if (!memberId) {
    alert('Error: No member selected for editing');
    return;
  }

  // Get form data
  const editFormFields = document.querySelector('#editMembershipform');
  const formData = {
    id: memberId,
    role: editFormFields.querySelector('#memberType').value,
    firstName: editFormFields.querySelector('#member-firstName').value,
    lastName: editFormFields.querySelector('#member-lastName').value,
    username: editFormFields.querySelector('#member-username').value,
    email: editFormFields.querySelector('#member-email').value,
    password: editFormFields.querySelector('#member-password').value,
    repassword: editFormFields.querySelector('#member-repassword').value,
    phoneNumber: editFormFields.querySelector('#member-phonenumber').value,
    gender: editFormFields.querySelector('#memberGender').value,
    runnerType: editFormFields.querySelector('#member-runnerType').value
  };

  // Validate form data
  const validationErrors = validateEditMemberForm(formData);
  if (validationErrors.length > 0) {
    alert('Please fix the following errors:\n' + validationErrors.join('\n'));
    return;
  }

  if (confirm('Press Ok to confirm edit.')) {
    // Here you would typically call an API to update the member
    // For now, we'll just show success message and refresh the list
    alert("Edit successful, Member's details have been updated.");

    // Refresh the members list
    fetchMembers();

    // Navigate back to the members list
    showMembership(new Event('click'));
  } else {
    alert("Edit cancelled.");
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



