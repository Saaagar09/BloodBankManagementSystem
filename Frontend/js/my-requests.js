requireAuth();

const requestsContainer = document.getElementById('requestsContainer');
const noRequests = document.getElementById('noRequests');

async function loadMyRequests() {
    try {
        const requests = await recipientAPI.getMyRequests();

console.log("My blood requests:", requests);
console.log("First request ID:", requests[0].id);
console.log("First request object:", requests[0]);

        if (!requests || requests.length === 0) {
            requestsContainer.style.display = 'none';
            noRequests.style.display = 'block';
            return;
        }

        noRequests.style.display = 'none';
        requestsContainer.style.display = 'grid';
        requestsContainer.innerHTML = ''; // Clear existing content

        requests.forEach(request => {
            const requestCard = createRequestCard(request);
            requestsContainer.appendChild(requestCard);
        });

    } catch (error) {
        console.error("Error loading my requests:", error);
        requestsContainer.style.display = 'none';
        noRequests.style.display = 'block';
    }
}

// Create request card element
function createRequestCard(request) {
    

    const card = document.createElement('div');
    card.className = 'request-card';
    card.setAttribute('data-request-id', request.id);
    
    card.innerHTML = `
        <div class="card-header">
            <div class="card-title-section">
                <div class="card-blood-type">${request.bloodGroup}</div>
                <h3 class="card-patient-name">${request.name}</h3>
                <p class="card-hospital">
                    <i class="fas fa-map-marker-alt"></i>
                    ${request.city}
                </p>
            </div>
            <div class="card-actions">
                <button class="btn-delete" onclick="deleteRequest(${request.id})" title="Delete Request">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        </div>

        <div class="card-body">
            <div class="card-info-grid">
                <div class="card-info-item">
                    <span class="card-info-label">Age</span>
                    <span class="card-info-value">
                        <i class="fas fa-user"></i>
                        ${request.age} years
                    </span>
                </div>
                <div class="card-info-item">
                    <span class="card-info-label">Units Needed</span>
                    <span class="card-info-value">
                        <i class="fas fa-tint"></i>
                        ${request.units} Units
                    </span>
                </div>
                <div class="card-info-item">
                    <span class="card-info-label">Contact</span>
                    <span class="card-info-value">
                        <i class="fas fa-phone"></i>
                        ${request.contactNumber}
                    </span>
                </div>
                <div class="card-info-item">
                    <span class="card-info-label">Purpose</span>
                    <span class="card-info-value">
                        <i class="fas fa-notes-medical"></i>
                        ${request.purpose}
                    </span>
                </div>
            </div>
        </div>

       <div class="accepted-donors-section">

    ${
        request.acceptedDonors && request.acceptedDonors.length > 0
        ? `
            <div class="accepted-donors-header">
                <i class="fas fa-check-circle"></i>
                <span>Donor${request.acceptedDonors.length > 1 ? 's' : ''} Accepted</span>
            </div>

            <div class="accepted-donors-list">

                ${request.acceptedDonors.map(donor => `
                    <div class="accepted-donor-card">

                        <div class="donor-icon">
                            <i class="fas fa-user"></i>
                        </div>

                        <div class="donor-details">
                            <h4>${donor.name}</h4>

                            <p>
                                <i class="fas fa-tint"></i>
                                ${donor.bloodGroup}
                            </p>

                            <p>
                                <i class="fas fa-map-marker-alt"></i>
                                ${donor.city}
                            </p>

                            <p>
                                <i class="fas fa-phone"></i>
                                ${donor.contactNumber}
                            </p>
                        </div>

                    </div>
                `).join('')}

            </div>
        `
        : `
            <div class="waiting-donor-section">
                <i class="fas fa-clock"></i>
                <span>Waiting for a donor to accept your request...</span>
            </div>
        `
    }

</div>

<div class="card-footer">
    <span class="card-badge">
        <i class="fas fa-hashtag"></i>
        Request #${request.id}
    </span>
</div>
    `;
    
    return card;
}

// Delete request with confirmation
function deleteRequest(requestId) {
    showDeleteConfirmation(requestId);
}

// Show confirmation modal
function showDeleteConfirmation(requestId) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <div class="modal-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h3 class="modal-title">Delete Blood Request?</h3>
            </div>
            <div class="modal-body">
                <p class="modal-description">
                    Are you sure you want to delete this blood request? 
                    This action cannot be undone and the request will be permanently removed.
                </p>
            </div>
            <div class="modal-footer">
                <button class="modal-btn modal-btn-cancel" onclick="closeDeleteModal()">
                    Cancel
                </button>
                <button class="modal-btn modal-btn-delete" onclick="confirmDelete(${requestId})">
                    <i class="fas fa-trash-alt"></i>
                    Delete Request
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeDeleteModal();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', handleEscapeKey);
}

// Handle Escape key
function handleEscapeKey(e) {
    if (e.key === 'Escape') {
        closeDeleteModal();
    }
}

// Close modal
function closeDeleteModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.remove();
            document.removeEventListener('keydown', handleEscapeKey);
        }, 200);
    }
}

// Confirm and execute delete
async function confirmDelete(requestId) {
    const deleteBtn = document.querySelector('.modal-btn-delete');
    const cancelBtn = document.querySelector('.modal-btn-cancel');
    
    // Disable buttons
    deleteBtn.classList.add('loading');
    deleteBtn.disabled = true;
    cancelBtn.disabled = true;
    deleteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Deleting...';
    
    try {
        // Call your API to delete the request
        await recipientAPI.deleteMe(requestId);
        
        // Remove card with animation
        const card = document.querySelector(`[data-request-id="${requestId}"]`);
        if (card) {
            card.style.transform = 'translateX(100%)';
            card.style.opacity = '0';
            
            setTimeout(() => {
                card.remove();
                checkIfEmpty();
                showSuccessMessage('Blood request deleted successfully');
            }, 300);
        }
        
        closeDeleteModal();
        
    } catch (error) {
        console.error('Delete error:', error);
        showErrorMessage('Failed to delete request. Please try again.');
        
        // Re-enable buttons
        deleteBtn.classList.remove('loading');
        deleteBtn.disabled = false;
        cancelBtn.disabled = false;
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i> Delete Request';
    }
}

// Check if no requests remain
function checkIfEmpty() {
    if (requestsContainer.children.length === 0) {
        requestsContainer.style.display = 'none';
        noRequests.style.display = 'block';
    }
}

// Success message
function showSuccessMessage(message) {
    const messageDiv = document.getElementById('message');
    messageDiv.innerHTML = `
        <div class="alert alert-success">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    setTimeout(() => {
        messageDiv.innerHTML = '';
    }, 4000);
}

// Error message
function showErrorMessage(message) {
    const messageDiv = document.getElementById('message');
    messageDiv.innerHTML = `
        <div class="alert alert-error">
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    setTimeout(() => {
        messageDiv.innerHTML = '';
    }, 4000);
}

// Load requests on page load
loadMyRequests();


// ===== MOBILE MENU =====
function initMobileMenu() {
    const toggle = document.getElementById('mobileMenuToggle');
    const menu = document.getElementById('navMenu');

    if (!toggle || !menu) return;

    toggle.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('active');
        menu.classList.toggle('active');
        document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : 'auto';
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar')) {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

initMobileMenu();