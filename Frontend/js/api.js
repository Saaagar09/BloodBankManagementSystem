
const API_BASE_URL = "https://bloodbankmanagementsystem-97ue.onrender.com/api";

// Auth token management
function getAuthToken() {
    return localStorage.getItem('authToken');
}

function setAuthToken(token) {
    localStorage.setItem('authToken', token);
}

function removeAuthToken() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
}

function isAuthenticated() {
    return getAuthToken() !== null;
}

function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

// API call with of JWT
async function apiCall(endpoint, method = 'GET', data = null) {
    const url = `${API_BASE_URL}${endpoint}`;

    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'cors'
    };

    // Add JWT token if it is available
    const token = getAuthToken();
    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        options.body = JSON.stringify(data);
    }

    try {
        console.log(`📤 ${method} ${url}`);
        if (data) console.log('📦 Data:', data);

        const response = await fetch(url, options);
        console.log(`📥 Status: ${response.status}`);

        // Handle 401 Unauthorized
        if (response.status === 401) {
            console.log('🔒 401 RECEIVED FROM BACKEND');
            throw new Error('401 Unauthorized');
        }

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Error:', errorText);
            throw new Error(errorText || `HTTP ${response.status}`);
        }

        // Handle no content responses
        if (response.status === 204 || method === 'DELETE') {
            const text = await response.text();
            console.log('✅ Success:', text || 'No content');
            return { success: true, message: text || 'Operation successful' };
        }

        const text = await response.text();

        let result;

        try {
            result = JSON.parse(text);
        } catch {
            result = text;
        }

        console.log('✅ Success:', result);
        return result;

    } catch (error) {
        console.error('❌ API Error:', error);
        throw error;
    }
}


// AUTHENTICATION API

function getUserFromToken(token) {
    const payload = JSON.parse(atob(token.split('.')[1]));

    return {
        username: payload.sub,
        role: payload.role
    };
}

const authAPI = {
    login: async (credentials) => {

        const token = await apiCall('/auth/login', 'POST', credentials);

        setAuthToken(token);

        const user = getUserFromToken(token);

        localStorage.setItem('user', JSON.stringify(user));

        return token;
    },

    register: async (userData) => {
        return await apiCall('/auth/register', 'POST', userData);
    },

    logout: () => {
        removeAuthToken();
        window.location.href = 'login.html';
    },

};



// DONOR API (Matches your DonorController)


const donorAPI = {
    // Get all donors
    getAll: async () => {
        return await apiCall('/bloodbank/Donor', 'GET');
    },

    // Get donor by ID
    getById: async (id) => {
        return await apiCall(`/bloodbank/Donor/${id}`, 'GET');
    },

    getMyDonor: async () => {
        return await apiCall('/bloodbank/Donor/me', 'GET');
    },

    create: async (donorData) => {
        return await apiCall('/bloodbank/Donor', 'POST', donorData);
    },

    update: async (id, donorData) => {
        return await apiCall(`/bloodbank/Donor/${id}`, 'PATCH', donorData);
    },

    delete: async (id) => {
        return await apiCall(`/bloodbank/Donor/${id}`, 'DELETE');
    },

    updateMe: async (donorData) => {
        return await apiCall('/bloodbank/Donor/me', 'PATCH', donorData);
    },

    deleteMe: async () => {
        return await apiCall('/bloodbank/Donor/me', 'DELETE');
    }
};


// RECIPIENT API (For Blood Requests)


const recipientAPI = {
    getAll: async () => {
        return await apiCall('/bloodbank/Recipient', 'GET');
    },
    
    getMyRequests: async () => {
    return await apiCall('/bloodbank/Recipient/me', 'GET');
    },

    getById: async (id) => {
        return await apiCall(`/bloodbank/Recipient/${id}`, 'GET');
    },

    create: async (recipientData) => {
        return await apiCall('/bloodbank/Recipient', 'POST', recipientData);
    },

    update: async (id, recipientData) => {
        return await apiCall(`/bloodbank/Recipient/${id}`, 'PATCH', recipientData);
    },

    delete: async (id) => {
        return await apiCall(`/bloodbank/Recipient/${id}`, 'DELETE');
    },

    updateMe: async (recipientData) => {
        return await apiCall('/bloodbank/Recipient/me', 'PATCH', recipientData);
    },

    deleteMe: async (id) => {
    return await apiCall(`/bloodbank/Recipient/me/${id}`, 'DELETE');
}
};

// Alias for consistency with frontend code
const requestAPI = recipientAPI;


// UTILITY FUNCTIONS


async function testConnection() {
    try {
        console.log('🔍 Testing backend connection...');

        if (!isAuthenticated()) {
            console.log('⚠️ Not authenticated');
            return false;
        }

        await donorAPI.getAll();
        console.log('✅ Backend connection successful!');
        return true;
    } catch (error) {
        console.error('❌ Backend connection failed!');
        console.error('Error:', error.message);
        return false;
    }
}

function showMessage(elementId, text, type = 'success') {
    const messageDiv = document.getElementById(elementId);
    if (!messageDiv) return;

    messageDiv.style.display = 'block';
    messageDiv.textContent = text;

    if (type === 'success') {
        messageDiv.style.backgroundColor = '#d4edda';
        messageDiv.style.color = '#155724';
        messageDiv.style.border = '1px solid #c3e6cb';
    } else if (type === 'error') {
        messageDiv.style.backgroundColor = '#f8d7da';
        messageDiv.style.color = '#721c24';
        messageDiv.style.border = '1px solid #f5c6cb';
    }

    messageDiv.style.padding = '12px';
    messageDiv.style.borderRadius = '5px';
    messageDiv.style.marginBottom = '15px';
    messageDiv.style.fontWeight = 'bold';

    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

function requireAuth() {
    if (!isAuthenticated()) {
        console.log('🔒 Authentication required - redirecting to login');
        window.location.href = 'login.html';
    }
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

console.log('✅ API Module Loaded');
console.log('🌐 API URL:', API_BASE_URL);
console.log('🔐 Authenticated:', isAuthenticated());


//notification

const notificationAPI = {
    getMyNotifications: async () =>
        await apiCall('/notifications/me', 'GET'),

    markAsRead: async (id) =>
        await apiCall(`/notifications/${id}/read`, 'PATCH'),

    accept: async (id) =>
        await apiCall(`/notifications/${id}/accept`, 'PATCH'),

    decline: async (id) =>
        await apiCall(`/notifications/${id}/decline`, 'PATCH')
};