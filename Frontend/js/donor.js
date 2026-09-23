requireAuth();

document.getElementById('donorForm').addEventListener('submit', async function (event) {

    event.preventDefault();

    const donorData = {

        name: document.getElementById('fullName').value,
        age: Number(document.getElementById('age').value),
        city: document.getElementById('city').value,
        bloodGroup: document.getElementById('bloodGroup').value,
        contactNumber: Number(document.getElementById('phoneNumber').value)

    };

    console.log("Donor data:", donorData);
    console.log("About to create donor:", donorData);
    try {

        const donor = await donorAPI.create(donorData);

        console.log("Donor created:", donor);

        showMessage(
            'message',
            '✅ Donor registered successfully',
            'success'
        );

        document.getElementById('donorForm').reset();

        } catch (error) {

        console.error("Donor registration error:", error);

        showMessage(
            'message',
            '❌ ' + error.message,
            'error'
        );
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