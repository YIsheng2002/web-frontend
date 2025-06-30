// DashboardHandler.js

class DashboardHandler {
  constructor() {
    this.initializeEventListeners();
    this.fetchInitialData();
  }

  initializeEventListeners() {
    document.addEventListener('click', (event) => {
      const userMenu = document.querySelector('.user-menu');
      const dropdown = document.getElementById('userDropdown');
      if (!userMenu.contains(event.target)) {
        dropdown.classList.remove('show');
      }
    });

    const dropdownToggle = document.getElementById('userDropdownToggle');
    if (dropdownToggle) {
      dropdownToggle.addEventListener('click', () => this.toggleDropdown());
    }
  }

  fetchInitialData() {
    this.fetchMembers();
    this.fetchOrders();
  }

  toggleDropdown() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('show');
  }

  showPage(pageId, clickedElement) {
    document.querySelectorAll('.main-content').forEach(page => page.classList.remove('active'));
    const targetPage = document.getElementById(pageId);
    if (targetPage) targetPage.classList.add('active');
    document.querySelectorAll('.sidebar-link').forEach(link => link.classList.remove('active'));
    if (clickedElement) clickedElement.classList.add('active');
  }

  async fetchMembers() {
    try {
      const response = await fetch('http://localhost/orderManagementSystemFrontend/view/Staff/backend-api/getMembers.php');
      const data = await response.json();
      if (data.success) {
        this.renderMembers(data.data);
      } else {
        alert('Failed to load members: ' + data.message);
      }
    } catch (err) {
      console.error('Fetch Members Error:', err);
    }
  }

  renderMembers(members) {
    const container = document.querySelector('.members-container');
    const header = container.querySelector('.members-header');
    container.innerHTML = '';
    container.appendChild(header);

    if (members.length === 0) {
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
        <button class="member-edit" onclick="dashboard.showPage('editMembershipform', event)">Edit</button>
        <button class="member-delete" onclick="dashboard.deleteMember()">Delete</button>`;
      container.appendChild(row);
    });
  }

  deleteMember() {
    if (confirm('Press Ok to confirm delete.')) {
      alert("Delete successful, member has been deleted.");
    } else {
      alert("Delete failed.");
    }
  }

  async fetchOrders() {
    try {
      const response = await fetch('./backend-api/getOrders.php');
      const data = await response.json();
      if (data.success) {
        this.renderOrders(data.data);
      } else {
        alert('Failed to load orders: ' + data.message);
      }
    } catch (err) {
      console.error('Fetch Orders Error:', err);
    }
  }

  renderOrders(orderList) {
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
        <button class="accept-btn" onclick="dashboard.acceptOrder('${order.id}')">Accept</button>
        <button class="decline-btn" onclick="dashboard.declineOrder('${order.id}')">Decline</button>`;
      container.appendChild(row);
    });
  }

  acceptOrder(orderId) {
    alert("Accepted order: " + orderId);
  }

  declineOrder(orderId) {
    alert("Declined order: " + orderId);
  }

  showOrderTab(tabId, event) {
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

  assignRunner(selectElement, orderId) {
    const dropdown = selectElement.parentElement;
    const selectedValue = selectElement.value;
    const selectedText = selectElement.options[selectElement.selectedIndex].text;

    if (selectedValue === 'default') {
      dropdown.classList.remove('assigned');
      this.hideStatusIndicator(dropdown);
      return;
    }

    dropdown.classList.add('loading');
    selectElement.disabled = true;
    setTimeout(() => {
      dropdown.classList.remove('loading');
      selectElement.disabled = false;
      dropdown.classList.add('assigned');
      this.updateStatusIndicator(dropdown, selectedText);
      this.showNotification(`${orderId} successfully assigned to ${selectedText}`, 'success');
    }, 1000);
  }

  updateStatusIndicator(dropdown, runnerName) {
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

  hideStatusIndicator(dropdown) {
    const statusIndicator = dropdown.parentElement.querySelector('.status-indicator');
    if (statusIndicator) statusIndicator.style.display = 'none';
  }

  handleMemberTypeChange() {
    const memberType = document.getElementById('memberType').value;
    const runnerTypeGroup = document.getElementById('runnerTypeGroup');

    if (memberType === 'runner') {
      runnerTypeGroup.style.display = 'block';
    } else {
      runnerTypeGroup.style.display = 'none';
      document.getElementById('runnerType').value = '';
    }
  }
}

// Initialize DashboardHandler after DOM is ready
let dashboard;
document.addEventListener('DOMContentLoaded', function () {
  dashboard = new DashboardHandler();
});
