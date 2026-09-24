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
    <a href="html/login.html" class="btn-auth btn-login">Login</a>
    <a href="html/register.html" class="btn-auth btn-register">Register</a>
`;

        return;
    }

    // USER
    if (user.role === 'USER') {
        navMenu.innerHTML = `
             <a href="#home" class="nav-link">Home</a>
            <a href="html/donor.html" class="nav-link">Become a Donor</a>
            <a href="html/request.html" class="nav-link">Request Blood</a>
            <a href="html/my-donor.html" class="nav-link">My Donor Profile</a>
            <a href="html/my-requests.html" class="nav-link">My Blood Request</a>
            <a href="html/notifications.html" class="nav-link notification-nav">
                🔔 Notifications
                <span id="notificationBadge" class="notification-badge-nav"></span>
            </a>
        `;
    }

    // ADMIN
    if (user.role === 'ADMIN') {
        navMenu.innerHTML = `
           <a href="#home" class="nav-link">Home</a>
            <a href="html/admin-donors.html" class="nav-link">Donors</a>
            <a href="html/admin-requests.html" class="nav-link">Blood Requests</a>
            <a href="html/admin.html" class="nav-link">Admin Dashboard</a>
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



// ===== MOBILE MENU FUNCTIONALITY =====
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');

    if (!mobileMenuToggle || !navMenu) {
        return;
    }

    // Toggle menu on hamburger click
    mobileMenuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent scrolling when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    });

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar')) {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

// Initialize mobile menu
initMobileMenu();