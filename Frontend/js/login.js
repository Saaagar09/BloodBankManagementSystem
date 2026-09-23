
const form = document.getElementById('loginForm');
const loginBtn = document.getElementById('loginBtn');
const messageDiv = document.getElementById('message');

function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = 'message ' + type;
    messageDiv.style.display = 'block';
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const loginData = {
        username: document.getElementById('username').value.trim(),
        password: document.getElementById('password').value
    };

    loginBtn.disabled = true;
    loginBtn.textContent = 'Signing In...';

    try {
        await authAPI.login(loginData);

        showMessage(
            'Login successful! Redirecting...',
            'success'
        );

        setTimeout(() => {

    const user = getCurrentUser();

    if (user && user.role === 'ADMIN') {
        window.location.href = 'admin-index.html';
    } else {
        window.location.href = 'index.html';
    }

}, 1000);

    } catch (error) {
        console.error('Login error:', error);

        showMessage(
            '❌ ' + (error.message || 'Invalid username or password'),
            'error'
        );

    } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = 'Sign In';
    }
});
