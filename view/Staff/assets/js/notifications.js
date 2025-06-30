// Replace static notifications array
let notifications = [];
let currentFilter = "all";

function getStatusIcon(status) {
  const icons = {
    preparing: "fas fa-clock",
    assigned: "fas fa-check-circle",
    delivered: "fas fa-truck",
    cancelled: "fas fa-times-circle",
  };
  return icons[status] || "fas fa-bell";
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
                        <i class="fas fa-bell-slash"></i>
                        <h3>No notifications found</h3>
                        <p>You're all caught up!</p>
                    </div>
                `;
    return;
  }

  container.innerHTML = filteredNotifications
    .map(
      (notification) => `
                <div class="notification-item ${
                  !notification.isRead ? "unread" : ""
                }" data-id="${notification.id}">
                    <div class="notification-icon status-${
                      notification.status
                    }">
                        <i class="${getStatusIcon(notification.status)}"></i>
                    </div>
                    <div class="notification-content">
                        <div class="notification-title">${
                          notification.customer
                        }</div>
                        <div class="notification-message">${
                          notification.message
                        }</div>
                        <div class="notification-meta">
                            <span class="order-id">${
                              notification.orderId
                            }</span>
                            <span class="timestamp">
                                <i class="fas fa-clock"></i>
                                ${formatTimeAgo(notification.timestamp)}
                            </span>
                        </div>
                    </div>
                    <div class="notification-actions">
                        ${
                          !notification.isRead
                            ? `
                            <button class="action-btn mark-read-btn" onclick="markAsRead(${notification.id})" title="Mark as read">
                                <i class="fas fa-check"></i>
                            </button>
                        `
                            : ""
                        }
                        <button class="action-btn delete-btn" onclick="deleteNotification(${
                          notification.id
                        })" title="Delete">
                            <i class="fas fa-trash"></i>
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

  document.getElementById("unread-count").textContent = unreadCount;
  document.getElementById("total-count").textContent = totalCount;
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

    // Transform Laravel format to frontend format
    notifications = data.map((n) => ({
      id: n.id,
      orderId: n.data.order_id ? `Order#${n.data.order_id}` : "Order#N/A",
      customer: `User#${n.notifiable_id}`,
      email: n.notifiable_type,
      status: n.data.status,
      message: n.data.message,
      timestamp: new Date(n.created_at),
      isRead: n.read_at !== null,
    }));

    renderNotifications(currentFilter);
    updateStats();
  } catch (error) {
    console.error("Error fetching notifications:", error);
  }
}

function markAsRead(notificationId) {
  const notification = notifications.find((n) => n.id === notificationId);
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
  const index = notifications.findIndex((n) => n.id === notificationId);
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


function filterNotifications(filter) {
  currentFilter = filter;

  // Update active tab
  document.querySelectorAll(".filter-tab").forEach((tab) => {
    tab.classList.remove("active");
  });
  event.target.classList.add("active");

  renderNotifications(filter);
}

document.addEventListener("DOMContentLoaded", function () {
  fetchNotifications();
  setInterval(fetchNotifications, 30000);
});



// Add click event to notification items
document.addEventListener("click", function (e) {
  const notificationItem = e.target.closest(".notification-item");
  if (notificationItem && !e.target.closest(".notification-actions")) {
    const notificationId = parseInt(notificationItem.dataset.id);
    markAsRead(notificationId);
  }
});
