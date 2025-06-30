// Replace static notifications array
let notifications = [];
let currentFilter = "all";

function getStatusIcon(status) {
  
  const normalizedStatus = status.toLowerCase().replace(/ /g, "_");

  const unicodeIcons = {
    preparing: "⏰", // Clock
    assigned: "✅", // Check mark
    picked_up: "🚲", // Bicycle
    in_transit: "🚚", // Truck
    delivered: "✅", // Check circle
    cancelled: "❌", // X mark
    pending: "⏳", // Hourglass
    processing: "⚙️", // Gear
    shipped: "📦", // Package
    completed: "✅", // Check
    failed: "⚠️"  // Warning
  };
  
  const icon = unicodeIcons[normalizedStatus] || "🔔"; // Fixed: use unicodeIcons instead of icons
  return icon;
}

function formatTimeAgo(timestamp) {
  const now = new Date();
  const diff = Math.floor((now - timestamp) / 1000);

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function renderNotifications(filter = "all") {
  const container = document.getElementById("notifications-list");
  let filteredNotifications = notifications;

  if (filter === "unread") {
    filteredNotifications = notifications.filter((n) => !n.isRead);
  } else if (filter !== "all") {
    filteredNotifications = notifications.filter((n) => n.status === filter);
  }

  if (filteredNotifications.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <span class="unicode-icon" style="font-size: 3em;">🔕</span>
        <h3>No notifications found</h3>
        <p>You're all caught up!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filteredNotifications
    .map(
      (notification) => `
        <div class="notification-item ${!notification.isRead ? "unread" : ""}" 
             data-id="${notification.id}">
          <div class="notification-icon status-${notification.status}">
            <span class="unicode-icon">${getStatusIcon(notification.status)}</span>
          </div>
          <div class="notification-content">
            <div class="notification-title">${notification.customer}</div>
            <div class="notification-message">${notification.message}</div>
            <div class="notification-meta">
              <span class="order-id">${notification.orderId}</span>
              <span class="timestamp">
                <span class="unicode-icon">🕐</span>
                ${formatTimeAgo(notification.timestamp)}
              </span>
            </div>
          </div>
          <div class="notification-actions">
            ${!notification.isRead
              ? `<button class="action-btn mark-read-btn" data-id="${notification.id}" title="Mark as read">
                   <span class="unicode-icon">✓</span>
                 </button>`
              : ""
            }
            <button class="action-btn delete-btn" data-id="${notification.id}" title="Delete">
              <span class="unicode-icon">🗑️</span>
            </button>
          </div>
        </div>
      `
    )
    .join("");
}

function updateStats() {
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const totalCount = notifications.length;

  const unreadEl = document.getElementById("unread-count");
  const totalEl = document.getElementById("total-count");

  if (unreadEl) {
    unreadEl.textContent = unreadCount;
  }
  if (totalEl) {
    totalEl.textContent = totalCount;
  }
}

// Fetch notifications from Laravel API
async function fetchNotifications() {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/all-notifications", {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) throw new Error("Failed to fetch notifications");

    const data = await response.json();

    notifications = data
      .map((n) => {
        const updatedAt = n.data.updated_at || n.created_at;

        return {
          id: n.id,
          orderId: n.data.order_id ? `Order#${n.data.order_id}` : "Order#N/A",
          customer: `User#${n.notifiable_id}`,
          email: n.notifiable_type,
          status: n.data.status,
          message: n.data.message,
          timestamp: new Date(updatedAt),
          isRead: n.read_at && !n.read_at.startsWith("-000001"),
        };
      })
      .sort((a, b) => b.timestamp - a.timestamp);


    renderNotifications(currentFilter);
    updateStats();
  } catch (error) {
    console.error("Error fetching notifications:", error);
  }
}

function markAsRead(notificationId) {
  const notification = notifications.find((n) => n.id == notificationId);
  if (notification) {
    notification.isRead = true;
    renderNotifications(currentFilter);
    updateStats();

    fetch(`http://127.0.0.1:8000/api/notifications/${notificationId}/read`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).catch((error) => console.error("Error marking as read:", error));
  }
}

function markAllAsRead() {
  notifications.forEach((n) => (n.isRead = true));
  renderNotifications(currentFilter);
  updateStats();

  fetch("http://127.0.0.1:8000/api/notifications/mark-all-read", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  }).catch((error) => console.error("Error marking all as read:", error));
}

function deleteNotification(notificationId) {
  const index = notifications.findIndex((n) => n.id == notificationId);
  if (index !== -1) {
    notifications.splice(index, 1);
    renderNotifications(currentFilter);
    updateStats();

    fetch(`http://127.0.0.1:8000/api/notifications/${notificationId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
      },
    }).catch((error) => console.error("Error deleting notification:", error));
  }
}

document.addEventListener("DOMContentLoaded", function () {
  fetchNotifications();
  setInterval(fetchNotifications, 30000);
});

function filterNotifications(filter) {
  currentFilter = filter;

  // Update active tab
  document.querySelectorAll(".filter-tab").forEach((tab) => {
    tab.classList.remove("active");
  });
  event.target.classList.add("active");

  renderNotifications(filter);
}

// Updated event delegation for notification actions
document.addEventListener("click", function (e) {
  // Handle mark as read button
  if (e.target.closest(".mark-read-btn")) {
    e.preventDefault();
    e.stopPropagation();
    const button = e.target.closest(".mark-read-btn");
    const notificationId = button.getAttribute("data-id");
    markAsRead(notificationId);
    return;
  }
  
  // Handle delete button
  if (e.target.closest(".delete-btn")) {
    e.preventDefault();
    e.stopPropagation();
    const button = e.target.closest(".delete-btn");
    const notificationId = button.getAttribute("data-id");
    deleteNotification(notificationId);
    return;
  }
  
  // Handle clicking on notification item (mark as read)
  const notificationItem = e.target.closest(".notification-item");
  if (notificationItem && !e.target.closest(".notification-actions")) {
    const notificationId = notificationItem.getAttribute("data-id");
    markAsRead(notificationId);
  }
});