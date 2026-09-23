document.addEventListener('DOMContentLoaded', () => {

    // ================================
    // CHECK ADMIN AUTHENTICATION
    // ================================

    const user = getCurrentUser();

    if (!user || user.role !== 'ADMIN') {
        window.location.href = 'login.html';
        return;
    }


    // ================================
    // LOGOUT
    // ================================

    window.handleLogout = function () {
        authAPI.logout();
    };


    // ================================
    // CURRENT TIME
    // ================================

    function updateCurrentTime() {
        const timeElement = document.getElementById('currentTime');

        if (!timeElement) {
            return;
        }

        const now = new Date();

        const time = now.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        timeElement.textContent = time;
    }

    updateCurrentTime();

    setInterval(updateCurrentTime, 1000);

});