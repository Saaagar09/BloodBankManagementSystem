let notifications = [];
let currentFilter = 'all';

// Sample notification data (replace with actual API call)
const sampleNotifications = [
    {
        id: 1,
        type: 'success',
        title: 'Blood Request Fulfilled',
        message: 'Your blood request for A+ has been successfully fulfilled. Thank you for using our service.',
        time: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        read: false,
        important: true
    },
    {
        id: 2,
        type: 'info',
        title: 'New Donor Registered',
        message: 'A new donor with blood type O+ has registered in your area.',
        time: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: false,
        important: false
    },
    {
        id: 3,
        type: 'warning',
        title: 'Upcoming Donation Drive',
        message: 'There is a blood donation drive scheduled for tomorrow at City Hospital.',
        time: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        read: true,
        important: true
    },
    {
        id: 4,
        type: 'error',
        title: 'Request Expired',
        message: 'Your blood request #BR1234 has expired. Please create a new request if still needed.',
        time: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        read: true,
        important: false
    },
    {
        id: 5,
        type: 'success',
        title: 'Profile Updated',
        message: 'Your donor profile has been successfully updated with new information.',
        time: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        read: true,
        important: false
    }
];

// Load notifications
async function loadNotifications() {
    try {

        const response = await notificationAPI.getMyNotifications();

        notifications = response.map(notification => ({
    id: notification.id,
    type: 'info',
    title: 'New Blood Request',
    message: notification.message,
    time: new Date(notification.createdAt),
    status: notification.status,
    read: notification.status !== 'PENDING',
    important: true
}));

        updateCounts();
        renderNotifications();

    } catch (error) {

        console.error('Error loading notifications:', error);
        showError();
    }
}

// Render notifications
function renderNotifications() {
    const listContainer = document.getElementById('notificationList');
    
    let filteredNotifications = notifications;
    
    // Apply filter
    if (currentFilter === 'unread') {
        filteredNotifications = notifications.filter(n => !n.read);
    } else if (currentFilter === 'important') {
        filteredNotifications = notifications.filter(n => n.important);
    }
    
    // Check if empty
    if (filteredNotifications.length === 0) {
        listContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-bell-slash"></i>
                </div>
                <h3 class="empty-title">No notifications</h3>
                <p class="empty-description">
                    You're all caught up! Check back later for new updates.
                </p>
            </div>
        `;
        return;
    }
    
    // Render notifications
    listContainer.innerHTML = filteredNotifications
        .map(notification => createNotificationHTML(notification))
        .join('');
}

// Create notification HTML
function createNotificationHTML(notification) {
    const timeAgo = getTimeAgo(notification.time);
    const iconClass = `type-${notification.type}`;
    const unreadClass = notification.read ? '' : 'unread';

    const iconMap = {
        success: 'fa-check-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle',
        error: 'fa-times-circle'
    };

    return `
        <div class="notification-item ${unreadClass}" data-id="${notification.id}">

            <div class="notification-icon ${iconClass}">
                <i class="fas ${iconMap[notification.type]}"></i>
            </div>

            <div class="notification-content">
                <div class="notification-header">
                    <h3 class="notification-title">${notification.title}</h3>
                    <span class="notification-time">
                        <i class="fas fa-clock"></i>
                        ${timeAgo}
                    </span>
                </div>

                <p class="notification-message">${notification.message}</p>

                <div class="notification-meta">
                    ${notification.important ? `
                        <span class="notification-badge badge-important">
                            <i class="fas fa-star"></i>
                            Important
                        </span>
                    ` : ''}

                    ${!notification.read ? `
                        <span class="notification-badge">
                            <i class="fas fa-circle"></i>
                            Unread
                        </span>
                    ` : ''}

                    ${notification.status === 'PENDING' ? `
                        <span class="notification-badge">
                            <i class="fas fa-clock"></i>
                            Waiting for response
                        </span>
                    ` : ''}

                    ${notification.status === 'ACCEPTED' ? `
                        <span class="notification-badge">
                            <i class="fas fa-check"></i>
                            Accepted
                        </span>
                    ` : ''}

                    ${notification.status === 'DECLINED' ? `
                        <span class="notification-badge">
                            <i class="fas fa-times"></i>
                            Declined
                        </span>
                    ` : ''}
                </div>
            </div>

            <div class="notification-actions">
                ${notification.status === 'PENDING' ? `
                    <button
                        class="action-btn btn-accept"
                        onclick="acceptNotification(${notification.id})"
                        title="Accept blood request">
                        <i class="fas fa-check"></i>
                        <span>Accept</span>
                    </button>

                    <button
                        class="action-btn btn-decline"
                        onclick="declineNotification(${notification.id})"
                        title="Decline blood request">
                        <i class="fas fa-times"></i>
                        <span>Decline</span>
                    </button>
                ` : ''}

                ${!notification.read ? `
                    <button
                        class="action-btn btn-mark-read"
                        onclick="markAsRead(${notification.id})"
                        title="Mark as read">
                        <i class="fas fa-check-double"></i>
                        <span>Mark as read</span>
                    </button>
                ` : ''}

                <button
                    class="action-btn btn-delete"
                    onclick="deleteNotification(${notification.id})"
                    title="Delete">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>

        </div>
    `;
}

// Get time ago string
function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return `${interval} ${unit}${interval !== 1 ? 's' : ''} ago`;
        }
    }
    
    return 'Just now';
}

// Update counts
function updateCounts() {
    const allCount = notifications.length;
    const unreadCount = notifications.filter(n => !n.read).length;
    const importantCount = notifications.filter(n => n.important).length;
    
    document.getElementById('allCount').textContent = allCount;
    document.getElementById('unreadCount').textContent = unreadCount;
    document.getElementById('importantCount').textContent = importantCount;
    document.getElementById('unreadBadge').textContent = unreadCount;
}

// Filter notifications
function filterNotifications(filter) {
    currentFilter = filter;
    
    // Update active tab
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
    
    renderNotifications();
}

// Mark as read
async function markAsRead(id) {

    try {

        await notificationAPI.markAsRead(id);

        const notification = notifications.find(n => n.id === id);

        if (notification) {
            notification.read = true;
        }

        updateCounts();
        renderNotifications();

        showToast('Notification marked as read', 'success');

    } catch (error) {

        console.error('Error marking notification as read:', error);
        showToast('Failed to mark notification as read', 'error');
    }
}

async function acceptNotification(id) {

    try {

        await notificationAPI.accept(id);

        const notification = notifications.find(n => n.id === id);

        if (notification) {
            notification.status = 'ACCEPTED';
            notification.read = true;
        }

        updateCounts();
        renderNotifications();

        showToast('Blood request accepted', 'success');

    } catch (error) {

        console.error('Error accepting blood request:', error);
        showToast('Failed to accept blood request', 'error');
    }
}


async function declineNotification(id) {

    try {

        await notificationAPI.decline(id);

        const notification = notifications.find(n => n.id === id);

        if (notification) {
            notification.status = 'DECLINED';
            notification.read = true;
        }

        updateCounts();
        renderNotifications();

        showToast('Blood request declined', 'success');

    } catch (error) {

        console.error('Error declining blood request:', error);
        showToast('Failed to decline blood request', 'error');
    }
}

// Mark all as read
async function markAllAsRead() {

    const unreadNotifications = notifications.filter(n => !n.read);

    if (unreadNotifications.length === 0) {
        showToast('All notifications are already read', 'info');
        return;
    }

    try {

        // Mark every unread notification as READ in backend
        for (const notification of unreadNotifications) {
            await notificationAPI.markAsRead(notification.id);
        }

        // Update frontend
        notifications.forEach(n => {
            n.read = true;
        });

        updateCounts();
        renderNotifications();

        showToast('All notifications marked as read', 'success');

    } catch (error) {

        console.error('Error marking all notifications as read:', error);
        showToast('Failed to mark all notifications as read', 'error');
    }
}

// Delete notification
function deleteNotification(id) {
    if (!confirm('Are you sure you want to delete this notification?')) {
        return;
    }
    
    notifications = notifications.filter(n => n.id !== id);
    updateCounts();
    renderNotifications();
    showToast('Notification deleted', 'success');
}

// Clear all
function clearAll() {
    if (notifications.length === 0) {
        showToast('No notifications to clear', 'info');
        return;
    }
    
    if (!confirm('Are you sure you want to delete all notifications?')) {
        return;
    }
    
    notifications = [];
    updateCounts();
    renderNotifications();
    showToast('All notifications cleared', 'success');
}

// Show error
function showError() {
    const listContainer = document.getElementById('notificationList');
    listContainer.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <h3 class="empty-title">Failed to load notifications</h3>
            <p class="empty-description">
                Something went wrong. Please try again later.
            </p>
        </div>
    `;
}

// Show toast
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.style.cssText = `
    position: fixed;
    top: 24px;
    right: 16px;
    left: auto;
    max-width: calc(100vw - 32px);
    padding: 16px 24px;
    background: ${type === 'success' ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)' : 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)'};
    color: ${type === 'success' ? '#065f46' : '#1e40af'};
    border-radius: 12px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
    font-weight: 600;
    font-size: 14px;
    line-height: 1.4;
    overflow-wrap: anywhere;
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
    
    // Add animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    if (!document.querySelector('style[data-toast]')) {
        style.setAttribute('data-toast', '');
        document.head.appendChild(style);
    }
}

// Initialize
loadNotifications();