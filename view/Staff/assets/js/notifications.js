 // Sample notification data - replace with Laravel API calls
        const notifications = [
            {
                id: 1,
                orderId: 'Order#21345',
                customer: 'Michelle Rivera',
                email: 'michelle.rivera@example.com',
                status: 'preparing',
                message: 'Order is being prepared in the kitchen',
                timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
                isRead: false
            },
            {
                id: 2,
                orderId: 'Order#21344',
                customer: 'Marvin McKinney',
                email: 'debbie.baker@example.com',
                status: 'ready',
                message: 'Order is ready for pickup/delivery',
                timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
                isRead: false
            },
            {
                id: 3,
                orderId: 'Order#21343',
                customer: 'Jane Cooper',
                email: 'kenzi.lawson@example.com',
                status: 'delivered',
                message: 'Order has been successfully delivered',
                timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
                isRead: true
            },
            {
                id: 4,
                orderId: 'Order#21342',
                customer: 'Cody Fisher',
                email: 'nathan.roberts@example.com',
                status: 'cancelled',
                message: 'Order has been cancelled due to unavailable items',
                timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
                isRead: false
            },
            {
                id: 5,
                orderId: 'Order#21341',
                customer: 'Bessie Cooper',
                email: 'felicia.reid@example.com',
                status: 'preparing',
                message: 'Order is being prepared in the kitchen',
                timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
                isRead: false
            },
            {
                id: 6,
                orderId: 'Order#21340',
                customer: 'Leslie Alexander',
                email: 'tim.jennings@example.com',
                status: 'delivered',
                message: 'Order has been successfully delivered',
                timestamp: new Date(Date.now() - 1000 * 60 * 90), // 1.5 hours ago
                isRead: true
            },
            {
                id: 7,
                orderId: 'Order#21339',
                customer: 'Guy Hawkins',
                email: 'alma.lawson@example.com',
                status: 'ready',
                message: 'Order is ready for pickup/delivery',
                timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
                isRead: false
            },
            {
                id: 8,
                orderId: 'Order#21338',
                customer: 'Theresa Webb',
                email: 'debra.holt@example.com',
                status: 'delivered',
                message: 'Order has been successfully delivered',
                timestamp: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
                isRead: true
            }
        ];

        let currentFilter = 'all';

        function getStatusIcon(status) {
            const icons = {
                preparing: 'fas fa-clock',
                ready: 'fas fa-check-circle',
                delivered: 'fas fa-truck',
                cancelled: 'fas fa-times-circle'
            };
            return icons[status] || 'fas fa-bell';
        }

        function formatTimeAgo(timestamp) {
            const now = new Date();
            const diff = Math.floor((now - timestamp) / 1000);

            if (diff < 60) return 'Just now';
            if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
            if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
            return `${Math.floor(diff / 86400)}d ago`;
        }

        function renderNotifications(filter = 'all') {
            const container = document.getElementById('notifications-list');
            let filteredNotifications = notifications;

            if (filter === 'unread') {
                filteredNotifications = notifications.filter(n => !n.isRead);
            } else if (filter !== 'all') {
                filteredNotifications = notifications.filter(n => n.status === filter);
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

            container.innerHTML = filteredNotifications.map(notification => `
                <div class="notification-item ${!notification.isRead ? 'unread' : ''}" data-id="${notification.id}">
                    <div class="notification-icon status-${notification.status}">
                        <i class="${getStatusIcon(notification.status)}"></i>
                    </div>
                    <div class="notification-content">
                        <div class="notification-title">${notification.customer}</div>
                        <div class="notification-message">${notification.message}</div>
                        <div class="notification-meta">
                            <span class="order-id">${notification.orderId}</span>
                            <span class="timestamp">
                                <i class="fas fa-clock"></i>
                                ${formatTimeAgo(notification.timestamp)}
                            </span>
                        </div>
                    </div>
                    <div class="notification-actions">
                        ${!notification.isRead ? `
                            <button class="action-btn mark-read-btn" onclick="markAsRead(${notification.id})" title="Mark as read">
                                <i class="fas fa-check"></i>
                            </button>
                        ` : ''}
                        <button class="action-btn delete-btn" onclick="deleteNotification(${notification.id})" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }

        function updateStats() {
            const unreadCount = notifications.filter(n => !n.isRead).length;
            const totalCount = notifications.length;
            
            document.getElementById('unread-count').textContent = unreadCount;
            document.getElementById('total-count').textContent = totalCount;
        }

        function markAsRead(notificationId) {
            const notification = notifications.find(n => n.id === notificationId);
            if (notification) {
                notification.isRead = true;
                renderNotifications(currentFilter);
                updateStats();
                
                // Here you would make an API call to Laravel to update the database
                // fetch(`/api/notifications/${notificationId}/read`, { method: 'POST' })
            }
        }

        function markAllAsRead() {
            notifications.forEach(n => n.isRead = true);
            renderNotifications(currentFilter);
            updateStats();
            
            // Here you would make an API call to Laravel to update all notifications
            // fetch('/api/notifications/mark-all-read', { method: 'POST' })
        }

        function deleteNotification(notificationId) {
            const index = notifications.findIndex(n => n.id === notificationId);
            if (index !== -1) {
                notifications.splice(index, 1);
                renderNotifications(currentFilter);
                updateStats();
                
                // Here you would make an API call to Laravel to delete from database
                // fetch(`/api/notifications/${notificationId}`, { method: 'DELETE' })
            }
        }

        function filterNotifications(filter) {
            currentFilter = filter;
            
            // Update active tab
            document.querySelectorAll('.filter-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            event.target.classList.add('active');
            
            renderNotifications(filter);
        }

        // Initialize the page
        document.addEventListener('DOMContentLoaded', function() {
            renderNotifications();
            updateStats();
            
            // Auto-refresh notifications every 30 seconds
            setInterval(() => {
                // Here you would fetch new notifications from Laravel API
                // fetchNotifications();
            }, 30000);
        });

        // Function to fetch notifications from Laravel API
        function fetchNotifications() {
            // Example API call to Laravel
            /*
            fetch('/api/notifications')
                .then(response => response.json())
                .then(data => {
                    notifications.length = 0;
                    notifications.push(...data);
                    renderNotifications(currentFilter);
                    updateStats();
                })
                .catch(error => console.error('Error fetching notifications:', error));
            */
        }

        // Add click event to notification items
        document.addEventListener('click', function(e) {
            const notificationItem = e.target.closest('.notification-item');
            if (notificationItem && !e.target.closest('.notification-actions')) {
                const notificationId = parseInt(notificationItem.dataset.id);
                markAsRead(notificationId);
            }
        });