function updateNavigation() {

    const navMenu = document.getElementById('navMenu');
    const authButtons = document.getElementById('authButtons');

    const user = getCurrentUser();

    // Not logged in
    if (!user) {
        navMenu.innerHTML = `
            <a href="#home" class="nav-link">Home</a>
        `;

        authButtons.innerHTML = `
            <a href="login.html" class="btn-auth btn-login">Login</a>
            <a href="register.html" class="btn-auth btn-register">Register</a>
        `;

        return;
    }

    // USER
    if (user.role === 'USER') {
        navMenu.innerHTML = `
            <a href="#home" class="nav-link">Home</a>
            <a href="donor.html" class="nav-link">Become a Donor</a>
            <a href="request.html" class="nav-link">Request Blood</a>
            <a href="my-donor.html" class="nav-link">My Donor Profile</a>
            <a href="my-requests.html" class="nav-link">My Blood Request</a>
            <a href="notifications.html" class="nav-link notification-nav">
    🔔 Notifications
    <span id="notificationBadge" class="notification-badge-nav"></span>
</a>
        `;
    }

    // ADMIN
    if (user.role === 'ADMIN') {
        navMenu.innerHTML = `
            <a href="#home" class="nav-link">Home</a>
            <a href="admin-donors.html" class="nav-link">Donors</a>
            <a href="admin-requests.html" class="nav-link">Blood Requests</a>
            <a href="admin.html" class="nav-link">Admin Dashboard</a>
        `;
    }

    authButtons.innerHTML = `
        <button class="btn-auth btn-login" onclick="authAPI.logout()">
            Logout
        </button>
    `;
}

async function checkNotifications() {

    const badge = document.getElementById('notificationBadge');

    if (!badge) {
        return;
    }

    try {

        const notifications = await notificationAPI.getMyNotifications();

        const unreadCount = notifications.filter(
            notification => notification.status === 'PENDING'
        ).length;

        if (unreadCount > 0) {
            badge.style.display = 'block';
        } else {
            badge.style.display = 'none';
        }

    } catch (error) {

        console.error('Error checking notifications:', error);
    }
}

updateNavigation();
checkNotifications();

// Check for new notifications every 5 seconds
setInterval(checkNotifications, 5000);