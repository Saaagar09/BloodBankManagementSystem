const donorList = document.getElementById('donorList');
const requestList = document.getElementById('requestList');
const donorCount = document.getElementById('donorCount');
const requestCount = document.getElementById('requestCount');
const donorCountBadge = document.getElementById('donorCountBadge');
const requestCountBadge = document.getElementById('requestCountBadge');

async function loadDonors() {
    donorList.innerHTML = `
        <li class="loading-state">
            <i class="fas fa-spinner fa-spin"></i>
            <span>Loading donors...</span>
        </li>
    `;
    
    try {
        const response = await donorAPI.getAll();
        const donors = Array.isArray(response) ? response : (response.data || []);
        
        donorCount.textContent = donors.length;
        donorCountBadge.textContent = donors.length;
        donorList.innerHTML = '';
        
        if (donors.length === 0) {
            donorList.innerHTML = `
                <li class="empty-state">
                    <i class="fas fa-users"></i>
                    <p>No donors registered yet</p>
                </li>
            `;
            return;
        }
        
        donors.forEach((donor) => {
    const li = document.createElement('li');

    li.innerHTML = `
        <div class="item-info">
            <div class="item-name">${donor.name}</div>

            <div class="item-details">

                <span class="item-detail">
                    <i class="fas fa-tint"></i>
                    <strong>Blood Group:</strong> ${donor.bloodGroup}
                </span>

                <span class="item-detail">
                    <i class="fas fa-user"></i>
                    <strong>Age:</strong> ${donor.age}
                </span>

                <span class="item-detail">
                    <i class="fas fa-map-marker-alt"></i>
                    <strong>City:</strong> ${donor.city}
                </span>

                <span class="item-detail">
                    <i class="fas fa-phone"></i>
                    <strong>Contact:</strong> ${donor.contactNumber}
                </span>

            </div>
        </div>

        <div class="item-actions">

    <button class="edit-btn" onclick="editDonor(${donor.id})">
        <i class="fas fa-edit"></i>
        <span>Edit</span>
    </button>

    <button class="delete-btn" onclick="deleteDonor(${donor.id}, '${donor.name}')">
        <i class="fas fa-trash-alt"></i>
        <span>Delete</span>
    </button>

</div>
    `;

    donorList.appendChild(li);
});
        
    } catch (error) {
        console.error('Error loading donors:', error);
        donorList.innerHTML = `
            <li class="empty-state">
                <i class="fas fa-exclamation-circle"></i>
                <p style="color: #dc3545;">Error loading donors</p>
            </li>
        `;
    }
}

async function loadRequests() {
    requestList.innerHTML = `
        <li class="loading-state">
            <i class="fas fa-spinner fa-spin"></i>
            <span>Loading requests...</span>
        </li>
    `;
    
    try {
        const response = await requestAPI.getAll();
        const requests = Array.isArray(response) ? response : (response.data || []);
        
        requestCount.textContent = requests.length;
        requestCountBadge.textContent = requests.length;
        requestList.innerHTML = '';
        
        if (requests.length === 0) {
            requestList.innerHTML = `
                <li class="empty-state">
                    <i class="fas fa-tint"></i>
                    <p>No blood requests yet</p>
                </li>
            `;
            return;
        }
        
       requests.forEach((request) => {
    const li = document.createElement('li');

    li.innerHTML = `
        <div class="item-info">

            <div class="item-name">${request.name}</div>

            <div class="item-details">

                <span class="item-detail">
                    <i class="fas fa-tint"></i>
                    <strong>Blood Group:</strong> ${request.bloodGroup}
                </span>

                <span class="item-detail">
                    <i class="fas fa-prescription-bottle"></i>
                    <strong>Units:</strong> ${request.units}
                </span>

                <span class="item-detail">
                    <i class="fas fa-user"></i>
                    <strong>Age:</strong> ${request.age}
                </span>

                <span class="item-detail">
                    <i class="fas fa-map-marker-alt"></i>
                    <strong>City:</strong> ${request.city}
                </span>

                <span class="item-detail">
                    <i class="fas fa-phone"></i>
                    <strong>Contact:</strong> ${request.contactNumber}
                </span>

                <span class="item-detail">
                    <i class="fas fa-notes-medical"></i>
                    <strong>Purpose:</strong> ${request.purpose}
                </span>

            </div>
        </div>

       <div class="item-actions">

    <button class="edit-btn" onclick="editRequest(${request.id})">
        <i class="fas fa-edit"></i>
        <span>Edit</span>
    </button>

    <button class="delete-btn" onclick="deleteRequest(${request.id}, '${request.name}')">
        <i class="fas fa-trash-alt"></i>
        <span>Delete</span>
    </button>

</div>
`;
    requestList.appendChild(li);
});
        
    } catch (error) {
        console.error('Error loading requests:', error);
        requestList.innerHTML = `
            <li class="empty-state">
                <i class="fas fa-exclamation-circle"></i>
                <p style="color: #dc3545;">Error loading requests</p>
            </li>
        `;
    }
}

    async function editDonor(id) {

    try {

        // Get the latest donor data from backend
        const donor = await donorAPI.getById(id);

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';

        modal.innerHTML = `
            <div class="modal-content">

                <div class="modal-header">
                    <div class="modal-icon">
                        <i class="fas fa-user-edit"></i>
                    </div>

                    <h3 class="modal-title">Edit Donor</h3>
                </div>

                <div class="modal-body">

                    <div class="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            id="editDonorName"
                            value="${donor.name || ''}"
                        >
                    </div>

                    <div class="form-group">
                        <label>Age</label>
                        <input
                            type="number"
                            id="editDonorAge"
                            value="${donor.age || ''}"
                        >
                    </div>

                    <div class="form-group">
                        <label>Blood Group</label>
                        <select id="editDonorBloodGroup">
                            <option value="A+" ${donor.bloodGroup === 'A+' ? 'selected' : ''}>A+</option>
                            <option value="A-" ${donor.bloodGroup === 'A-' ? 'selected' : ''}>A-</option>
                            <option value="B+" ${donor.bloodGroup === 'B+' ? 'selected' : ''}>B+</option>
                            <option value="B-" ${donor.bloodGroup === 'B-' ? 'selected' : ''}>B-</option>
                            <option value="AB+" ${donor.bloodGroup === 'AB+' ? 'selected' : ''}>AB+</option>
                            <option value="AB-" ${donor.bloodGroup === 'AB-' ? 'selected' : ''}>AB-</option>
                            <option value="O+" ${donor.bloodGroup === 'O+' ? 'selected' : ''}>O+</option>
                            <option value="O-" ${donor.bloodGroup === 'O-' ? 'selected' : ''}>O-</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>City</label>
                        <input
                            type="text"
                            id="editDonorCity"
                            value="${donor.city || ''}"
                        >
                    </div>

                    <div class="form-group">
                        <label>Contact Number</label>
                        <input
                            type="number"
                            id="editDonorContact"
                            value="${donor.contactNumber || ''}"
                        >
                    </div>

                </div>

                <div class="modal-footer">

                    <button
                        class="modal-btn modal-btn-cancel"
                        onclick="closeModal()">
                        Cancel
                    </button>

                    <button
                        class="modal-btn modal-btn-update"
                        onclick="confirmEditDonor(${id})">
                        <i class="fas fa-save"></i>
                        Update Donor
                    </button>

                </div>

            </div>
        `;

        document.body.appendChild(modal);

        // Close when clicking outside the modal
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

    } catch (error) {

        console.error('Error loading donor:', error);

        showErrorMessage(
            'Unable to load donor details: ' + error.message
        );
    }
}

async function confirmEditDonor(id) {

    const name = document.getElementById('editDonorName').value.trim();
    const age = document.getElementById('editDonorAge').value;
    const bloodGroup = document.getElementById('editDonorBloodGroup').value;
    const city = document.getElementById('editDonorCity').value.trim();
    const contactNumber = document.getElementById('editDonorContact').value;

    // Basic validation
    if (!name || !age || !bloodGroup || !city || !contactNumber) {
        showErrorMessage('Please fill all fields');
        return;
    }

    const updateBtn = document.querySelector('.modal-btn-update');

    updateBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Updating...';

    updateBtn.disabled = true;

    const donorData = {
        name: name,
        age: Number(age),
        bloodGroup: bloodGroup,
        city: city,
        contactNumber: Number(contactNumber)
    };

    console.log('Updating donor:', id);
    console.log('Data:', donorData);

    try {

        await donorAPI.update(id, donorData);

        closeModal();

        showSuccessMessage('Donor updated successfully!');

        // Reload donor list
        loadDonors();

    } catch (error) {

        console.error('Error updating donor:', error);

        showErrorMessage(
            'Update failed: ' + error.message
        );

        updateBtn.innerHTML =
            '<i class="fas fa-save"></i> Update Donor';

        updateBtn.disabled = false;
    }
}

async function editRequest(id) {

    try {

        // Get latest request data from backend
        const request = await requestAPI.getById(id);

        const modal = document.createElement('div');
        modal.className = 'modal-overlay';

        modal.innerHTML = `
            <div class="modal-content">

                <div class="modal-header">
                    <div class="modal-icon">
                        <i class="fas fa-edit"></i>
                    </div>

                    <h3 class="modal-title">Edit Blood Request</h3>
                </div>

                <div class="modal-body">

                    <div class="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            id="editRequestName"
                            value="${request.name || ''}"
                        >
                    </div>

                    <div class="form-group">
                        <label>Age</label>
                        <input
                            type="number"
                            id="editRequestAge"
                            value="${request.age || ''}"
                        >
                    </div>

                    <div class="form-group">
                        <label>Blood Group</label>
                        <select id="editRequestBloodGroup">
                            <option value="A+" ${request.bloodGroup === 'A+' ? 'selected' : ''}>A+</option>
                            <option value="A-" ${request.bloodGroup === 'A-' ? 'selected' : ''}>A-</option>
                            <option value="B+" ${request.bloodGroup === 'B+' ? 'selected' : ''}>B+</option>
                            <option value="B-" ${request.bloodGroup === 'B-' ? 'selected' : ''}>B-</option>
                            <option value="AB+" ${request.bloodGroup === 'AB+' ? 'selected' : ''}>AB+</option>
                            <option value="AB-" ${request.bloodGroup === 'AB-' ? 'selected' : ''}>AB-</option>
                            <option value="O+" ${request.bloodGroup === 'O+' ? 'selected' : ''}>O+</option>
                            <option value="O-" ${request.bloodGroup === 'O-' ? 'selected' : ''}>O-</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Units</label>
                        <input
                            type="number"
                            id="editRequestUnits"
                            value="${request.units || ''}"
                        >
                    </div>

                    <div class="form-group">
                        <label>City</label>
                        <input
                            type="text"
                            id="editRequestCity"
                            value="${request.city || ''}"
                        >
                    </div>

                    <div class="form-group">
                        <label>Contact Number</label>
                        <input
                            type="number"
                            id="editRequestContact"
                            value="${request.contactNumber || ''}"
                        >
                    </div>

                    <div class="form-group">
                        <label>Purpose</label>
                        <input
                            type="text"
                            id="editRequestPurpose"
                            value="${request.purpose || ''}"
                        >
                    </div>

                </div>

                <div class="modal-footer">

                    <button
                        class="modal-btn modal-btn-cancel"
                        onclick="closeModal()">
                        Cancel
                    </button>

                    <button
                        class="modal-btn modal-btn-update"
                        onclick="confirmEditRequest(${id})">
                        <i class="fas fa-save"></i>
                        Update Request
                    </button>

                </div>

            </div>
        `;

        document.body.appendChild(modal);

        // Close when clicking outside modal
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

    } catch (error) {

        console.error('Error loading request:', error);

        showErrorMessage(
            'Unable to load request details: ' + error.message
        );
    }
}

async function confirmEditRequest(id) {

    const name = document.getElementById('editRequestName').value.trim();
    const age = document.getElementById('editRequestAge').value;
    const bloodGroup = document.getElementById('editRequestBloodGroup').value;
    const units = document.getElementById('editRequestUnits').value;
    const city = document.getElementById('editRequestCity').value.trim();
    const contactNumber = document.getElementById('editRequestContact').value;
    const purpose = document.getElementById('editRequestPurpose').value.trim();

    // Basic validation
    if (!name || !age || !bloodGroup || !units || !city || !contactNumber || !purpose) {
        showErrorMessage('Please fill all fields');
        return;
    }

    const updateBtn = document.querySelector('.modal-btn-update');

    updateBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Updating...';

    updateBtn.disabled = true;

    const requestData = {
        name: name,
        age: Number(age),
        city: city,
        units: Number(units),
        purpose: purpose,
        bloodGroup: bloodGroup,
        contactNumber: Number(contactNumber)
    };

    console.log('Updating request:', id);
    console.log('Data:', requestData);

    try {

        await requestAPI.update(id, requestData);

        closeModal();

        showSuccessMessage('Blood request updated successfully!');

        // Reload request list
        loadRequests();

    } catch (error) {

        console.error('Error updating request:', error);

        showErrorMessage(
            'Update failed: ' + error.message
        );

        updateBtn.innerHTML =
            '<i class="fas fa-save"></i> Update Request';

        updateBtn.disabled = false;
    }
}

async function deleteDonor(id, name) {
    // Create confirmation modal
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <div class="modal-icon modal-icon-warning">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h3 class="modal-title">Delete Donor?</h3>
            </div>
            <div class="modal-body">
                <p class="modal-description">
                    Are you sure you want to delete donor <strong>"${name}"</strong>? 
                    This action cannot be undone.
                </p>
            </div>
            <div class="modal-footer">
                <button class="modal-btn modal-btn-cancel" onclick="closeModal()">
                    Cancel
                </button>
                <button class="modal-btn modal-btn-delete" onclick="confirmDeleteDonor(${id})">
                    <i class="fas fa-trash-alt"></i>
                    Delete Donor
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

async function confirmDeleteDonor(id) {
    const deleteBtn = document.querySelector('.modal-btn-delete');
    deleteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Deleting...';
    deleteBtn.disabled = true;
    
    try {
        await donorAPI.delete(id);
        closeModal();
        showSuccessMessage('Donor deleted successfully!');
        loadDonors();
    } catch (error) {
        showErrorMessage('Delete failed: ' + error.message);
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i> Delete Donor';
        deleteBtn.disabled = false;
    }
}

async function deleteRequest(id, name) {
    // Create confirmation modal
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <div class="modal-icon modal-icon-warning">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h3 class="modal-title">Delete Blood Request?</h3>
            </div>
            <div class="modal-body">
                <p class="modal-description">
                    Are you sure you want to delete the blood request for <strong>"${name}"</strong>? 
                    This action cannot be undone.
                </p>
            </div>
            <div class="modal-footer">
                <button class="modal-btn modal-btn-cancel" onclick="closeModal()">
                    Cancel
                </button>
                <button class="modal-btn modal-btn-delete" onclick="confirmDeleteRequest(${id})">
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
            closeModal();
        }
    });
}

async function confirmDeleteRequest(id) {
    const deleteBtn = document.querySelector('.modal-btn-delete');
    deleteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Deleting...';
    deleteBtn.disabled = true;
    
    try {
        await requestAPI.delete(id);
        closeModal();
        showSuccessMessage('Request deleted successfully!');
        loadRequests();
    } catch (error) {
        showErrorMessage('Delete failed: ' + error.message);
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i> Delete Request';
        deleteBtn.disabled = false;
    }
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => modal.remove(), 200);
    }
}

function showSuccessMessage(message) {
    const toast = document.createElement('div');
    toast.className = 'toast toast-success';
    toast.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function showErrorMessage(message) {
    const toast = document.createElement('div');
    toast.className = 'toast toast-error';
    toast.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function loadAllData() {
    loadDonors();
    loadRequests();
}

window.addEventListener('DOMContentLoaded', async () => {
    const connected = await testConnection();
    if (connected) {
        loadAllData();
    } else {
        donorList.innerHTML = `
            <li class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <p style="color: #dc3545;">Backend not connected</p>
            </li>
        `;
        requestList.innerHTML = `
            <li class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <p style="color: #dc3545;">Backend not connected</p>
            </li>
        `;
    }
});