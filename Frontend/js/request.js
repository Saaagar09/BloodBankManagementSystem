

requireAuth();


    const form = document.getElementById('requestForm');
    const submitBtn = document.getElementById('submitBtn');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Build recipient object matching your RecipientDTO
      try {
        const recipientData = {
          name: document.getElementById('recipientName').value.trim(),
          age: parseInt(document.getElementById('age').value),
          city: document.getElementById('city').value.trim(),
          units: parseInt(document.getElementById('unitsRequired').value),
          purpose: document.getElementById('purpose').value.trim(),
          bloodGroup: document.querySelector('input[name="bloodGroup"]:checked')?.value,
          contactNumber: parseInt(document.getElementById('phoneNumber').value)
        };

        console.log('Submitting request:', recipientData);

        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="spinner" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2" stroke-dasharray="50" stroke-linecap="round"/>
          </svg>
          <span class="btn-text">Submitting...</span>
        `;

        const response = await recipientAPI.create(recipientData);

        console.log('Backend response:', response);

        alert('Blood request submitted successfully!');

        form.reset();

      } catch (error) {

        console.error('Error submitting recipient:', error);

        alert(error.message || 'Failed to submit request.');

      } finally {

        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 10L9 15L16 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="btn-text">Submit Request</span>
        `;

      }
    });

const adminNav = document.getElementById('adminNav');

if (adminNav) {
    adminNav.style.display = 'none';

    const token = localStorage.getItem('authToken');

    if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));

        if (payload.role === 'ADMIN') {
            adminNav.style.display = 'inline-block';
        }
    }
}