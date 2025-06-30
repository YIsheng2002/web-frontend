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
      deleteMember(member.user_id);
    };

    row.innerHTML = `
    <div class="member-profile">
    <img src="../../assets/images/avatar-${member.gender.toLowerCase()}.png" class="member-avatar">
    </div>
      <div class="member-name"> ${member.firstName} ${member.lastName}</div>
      <div class="member-email">${member.email}</div>
      <div class="member-role">${member.role}</div>
      <div class="member-gender">${member.gender}</div>
      <div class="member-phone">${member.phonenumber}</div>
      <div class="member-address">${member.address || 'N/A'}</div>
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
async function fetchMembers(role = '') {
  try {
    const response = await fetch(`http://localhost/orderManagementSystemFrontend/view/Staff/backend-api/getMembers.php${role ? `?role=${role}` : ''}`);
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


  return errors;
}

async function deleteMember(memberId) {
  if (!memberId) {
    alert('Error: Member ID not found.');
    return;
  }

  if (confirm('Press Ok to confirm delete.')) {
    try {
      const response = await fetch('http://localhost/orderManagementSystemFrontend/view/Staff/backend-api/deleteMember.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: memberId })
      });

      const result = await response.json();
      console.log('Delete API response:', result);

      if (result.success) {
        alert("Delete successful, member has been deleted.");
        fetchMembers(); // Refresh the list
      } else {
        alert("Delete failed: " + result.message);
      }
    } catch (error) {
      console.error("Delete API error:", error);
      alert("An error occurred while deleting the member.");
    }
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
  editForm.setAttribute('data-member-id', memberData.user_id);


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

// editMember function to handle the actual edit submission
async function editMember() {
  const editForm = document.getElementById('editMemberForm');
  const memberId = editForm.getAttribute('data-member-id');

  if (!memberId) {
    alert('Error: No member selected for editing');
    return;
  }

  // Get form data
  const editFormFields = document.querySelector('#editMembershipform');
  const formData = {
    user_id: memberId,
    role: editFormFields.querySelector('#memberType').value,
    firstName: editFormFields.querySelector('#member-firstName').value,
    lastName: editFormFields.querySelector('#member-lastName').value,
    username: editFormFields.querySelector('#member-username').value,
    email: editFormFields.querySelector('#member-email').value,
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
    try {
      const response = await fetch('http://localhost/orderManagementSystemFrontend/view/Staff/backend-api/editMember.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'editMember',
          data: formData
        })
      });

      const result = await response.json();
      console.log('Edit Member API response:', result);

      if (result.success) {
        alert("Edit successful, Member's details have been updated.");

        // Refresh the members list
        fetchMembers();

        // Navigate back to the members list
        showMembership(new Event('click'));
      } else {
        alert('Failed to update member: ' + result.message);
      }

    } catch (error) {
      console.error('Edit Member API error:', error);
      alert('An error occurred while updating the member.');
    }
  } else {
    alert("Edit cancelled.");
  }
}


function cancelEdit() {
  if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
    // Navigate back to membership page
    showMembership(new Event('click'));

    // Optionally reset the edit form
    const editForm = document.getElementById('editMemberForm');
    if (editForm) editForm.reset();

    // Hide runner type section if visible
    const runnerGroup = document.getElementById('runnerTypeGroupEdit');
    if (runnerGroup) runnerGroup.classList.add('hidden');
  }
}


/*Order Handling*/
function showOrderTab(tabId, event) {
  document.querySelectorAll('#orders .page').forEach(page => page.classList.remove('active'));
  const targetTab = document.getElementById(tabId);
  if (targetTab) targetTab.classList.add('active');
  document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
  if (event?.target) event.target.classList.add('active');

  // Set title if needed
  const pageTitle = document.querySelector('#orders .page-title');
  if (pageTitle) {
    pageTitle.textContent = {
      'new-orders': 'New Orders',
      'current-orders': 'Current Orders',
      'completed-orders': 'Completed Orders'
    }[tabId] || '';
  }

  if (tabId === 'new-orders') {
    fetchOrders('pending', tabId);
  } else if (tabId === 'current-orders') {
    fetchOrders('assigned, picked up, in transit', tabId);
  } else if (tabId === 'completed-orders') {
    fetchOrders('delivered', tabId);
  }

}

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

function filterByStatus(role) {
  fetchMembers(role);
  document.getElementById('filterDropdown').classList.remove('show');
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

async function fetchOrders(status = '', tabId = 'new-orders') {
  try {
    const response = await fetch(`http://localhost/orderManagementSystemFrontend/view/Staff/backend-api/getOrders.php${status ? `?status=${status}` : ''}`);
    const data = await response.json();
    if (data.success) {
      if (tabId === 'new-orders') {
        renderNewOrders(data.data);
      } else if (tabId === 'current-orders') {
        renderCurrentOrders(data.data);
      } else if (tabId === 'completed-orders') {
        renderCompletedOrders(data.data);
      }
    } else {
      alert('Failed to load orders: ' + data.message);
    }
  } catch (err) {
    console.error('Fetch Orders Error:', err);
  }
}


function renderNewOrders(orderList) {
  const container = document.querySelector('#new-orders .orders-container');
  const header = container.querySelector('.orders-header');
  container.innerHTML = '';
  container.appendChild(header);

  if (orderList.length === 0) {
    const emptyMessage = document.createElement('div');
    emptyMessage.className = 'no-orders-message';
    emptyMessage.innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <img src="../../assets/images/no-orders.png" alt="No Orders" style="max-width: 300px; margin-bottom: 16px;" />
        <p style="font-weight: bold; font-size: 18px;">No New Orders at this time</p>
        <p>Orders will appear here when they are placed.</p>
      </div>`;
    container.appendChild(emptyMessage);
    return;
  }

  orderList.forEach(order => {
    const row = document.createElement('div');
    row.className = 'order-row highlighted';
    row.innerHTML = `
      <div>${order.order_id}</div>
      <div>${order.customer_first_name} ${order.customer_last_name}</div>
      <div>${order.delivery_address || 'N/A'}</div>
      <div class="buttons-arrangement">
      <button class="accept-btn" onclick="acceptOrder(${order.order_id})">Accept</button>
      <button class="decline-btn" onclick="declineOrder(${order.order_id})">Decline</button>
      </div>
    `;
    container.appendChild(row);
  });
}

function acceptOrder(orderId) {
  fetch('http://localhost/orderManagementSystemFrontend/view/Staff/backend-api/updateOrderStatus.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      order_id: orderId,
      status: 'assigned' // Change to 'preparing' if needed
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert('Order status updated');
        //Utils.showNotification('Order accepted and updated to preparing!', 'success');
        fetchOrders('pending', 'new-orders');
      } else {
        alert('Failed: ' + data.message);
      }
    })
    .catch(err => {
      console.error('Fetch error:', err);
      alert('Network error');
    });
}

function declineOrder(orderId) { alert("Declined order: " + orderId); }

async function renderCurrentOrders(orderList) {
  const container = document.querySelector('#current-orders .orders-container');
  const header = container.querySelector('.orders-header');
  container.innerHTML = '';
  container.appendChild(header);

  if (orderList.length === 0) {
    const emptyMessage = document.createElement('div');
    emptyMessage.className = 'no-orders-message';
    emptyMessage.innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <img src="../../assets/images/no-orders.png" alt="No Orders" style="max-width: 300px; margin-bottom: 16px;" />
        <p style="font-weight: bold; font-size: 18px;">No Current Orders</p>
        <p>Orders will appear here once they are assigned.</p>
      </div>`;
    container.appendChild(emptyMessage);
    return;
  }

  const runnerList = await fetchAvailableRunners();

  // Separate into unassigned and assigned
  const unassignedOrders = orderList.filter(order =>
    !order.runner_id || order.runner_id === 'null' || order.runner_id === null
  );
  const assignedOrders = orderList.filter(order =>
    order.runner_id && order.runner_id !== 'null' && order.runner_id !== null
  );

  const renderOrderRow = (order, isUnassigned) => {
    const row = document.createElement('div');
    row.className = `order-row ${isUnassigned ? 'highlighted' : 'ongoing'}`;
    const runnerOptions = runnerList.map(runner => {
      const isSelected = runner.runner_id === order.runner_id ? 'selected' : '';
      return `<option value="${runner.runner_id}|${runner.runner_type}" ${isSelected}>
        Runner #${runner.runner_id} - ${runner.runner_type}
      </option>`;
    }).join('');

    row.innerHTML = `
      <div>${order.order_id}</div>
      <div>${order.customer_first_name} ${order.customer_last_name}</div>
      <div>${order.delivery_address || 'N/A'}</div>
      <div>
        <select ${isUnassigned ? '' : 'disabled'}>
          <option disabled ${isUnassigned ? 'selected' : ''}>${isUnassigned ? 'Assign runner' : 'Assigned'}</option>
          ${runnerOptions}
        </select>
      </div>
    `;

    // Only add event listener if it's unassigned
    if (isUnassigned) {
      row.querySelector('select').addEventListener('change', function () {
        const [id, type] = this.value.split('|');
        assignRunner(order.order_id, id, type);
      });
    }

    container.appendChild(row);
  };

  // Render unassigned first
  unassignedOrders.forEach(order => renderOrderRow(order, true));

  // Then assigned orders
  assignedOrders.forEach(order => renderOrderRow(order, false));
}


async function fetchAvailableRunners() {
  try {
    const response = await fetch('http://localhost/orderManagementSystemFrontend/view/Staff/backend-api/getRunner.php');
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Failed to fetch runners:', error);
    return [];
  }
}

async function assignRunner(orderId, runnerId, runnerType) {
  try {
    const response = await fetch('http://localhost/orderManagementSystemFrontend/view/Staff/backend-api/assignRunner.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: orderId, runner_id: runnerId, runner_type: runnerType })
    });

    const result = await response.json();
    if (result.success) {
      //Utils.showNotification(`Runner assigned to order #${orderId}`, 'success');
      alert(`Runner assigned to order #${orderId}`);
    } else {
      //Utils.showNotification('Failed to assign runner', 'error');
      alert('Failed to assign runner: ' + result.message);
    }
  } catch (err) {
    Utils.showNotification('Error assigning runner: ' + err.message, 'error');
  }
}


function renderCompletedOrders(orderList) {
  const container = document.querySelector('#completed-orders .orders-container');
  const header = container.querySelector('.orders-header');
  container.innerHTML = '';
  container.appendChild(header);

  if (orderList.length === 0) {
    const emptyMessage = document.createElement('div');
    emptyMessage.className = 'no-orders-message';
    emptyMessage.innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <img src="../../assets/images/no-orders.png" alt="No Orders" style="max-width: 300px; margin-bottom: 16px;" />
        <p style="font-weight: bold; font-size: 18px;">No Completed Orders</p>
        <p>Orders will appear here once they are delivered.</p>
      </div>`;
    container.appendChild(emptyMessage);
    return;
  }

  orderList.forEach(order => {
    const row = document.createElement('div');
    row.className = 'order-row completed';
    row.innerHTML = `
      <div>${order.order_id}</div>
      <div>${order.customer_first_name} ${order.customer_last_name}</div>
      <div>${order.completed_at || '-'}</div>
      <div>${order.status}</div>`;
    container.appendChild(row);
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





