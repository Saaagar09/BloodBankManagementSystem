
requireAuth();

let currentDonor = null;


// LOAD MY DONOR


async function loadMyDonor() {

    try {

        const donor = await donorAPI.getMyDonor();

        console.log("My donor:", donor);

        currentDonor = donor;

        // Display donor information
        document.getElementById('displayName').textContent = donor.name || '';
        document.getElementById('displayAge').textContent = donor.age || '';
        document.getElementById('displayCity').textContent = donor.city || '';
        document.getElementById('displayBloodGroup').textContent =
            donor.bloodGroup || '';

        document.getElementById('displayContactNumber').textContent =
            donor.contactNumber || '';

        document.getElementById('donorDetails').style.display = 'block';

    } catch (error) {

    console.error("Error loading donor:", error);

    document.getElementById('donorDetails').style.display = 'none';

    document.getElementById('noDonor').style.display = 'block';
}
}



// UPDATE BUTTON


document.getElementById('updateBtn').addEventListener('click', function () {

    if (!currentDonor) {
        return;
    }

    // Fill form with existing donor data
    document.getElementById('name').value =
        currentDonor.name || '';

    document.getElementById('age').value =
        currentDonor.age || '';

    document.getElementById('city').value =
        currentDonor.city || '';

    document.getElementById('bloodGroup').value =
        currentDonor.bloodGroup || '';

    document.getElementById('contactNumber').value =
        currentDonor.contactNumber || '';


    // Hide donor card
    document.getElementById('donorDetails').style.display = 'none';

    // Show update form
    document.getElementById('updateFormContainer').style.display = 'block';
  

});

document.getElementById('becomeDonorBtn').addEventListener('click', function () {

    window.location.href = 'donor.html';

});

// CANCEL BUTTON


document.getElementById('cancelBtn').addEventListener('click', function () {

    // Hide update form
    document.getElementById('updateFormContainer').style.display = 'none';

    // Show donor card
    document.getElementById('donorDetails').style.display = 'block';

    showMessage('message','❌ Update cancelled');

});



// SAVE UPDATED DONOR


document.getElementById('myDonorForm').addEventListener('submit', async function (event) {

    event.preventDefault();

    const donorData = {

        name: document.getElementById('name').value,
        age: Number(document.getElementById('age').value),
        city: document.getElementById('city').value,
        bloodGroup: document.getElementById('bloodGroup').value,
        contactNumber: Number(
            document.getElementById('contactNumber').value
        )

    };

    try {

        const updatedDonor =
            await donorAPI.updateMe(donorData);

        console.log("Updated donor:", updatedDonor);

        currentDonor = updatedDonor;

        // Update card
        document.getElementById('displayName').textContent =
            updatedDonor.name || '';

        document.getElementById('displayAge').textContent =
            updatedDonor.age || '';

        document.getElementById('displayCity').textContent =
            updatedDonor.city || '';

        document.getElementById('displayBloodGroup').textContent =
            updatedDonor.bloodGroup || '';

        document.getElementById('displayContactNumber').textContent =
            updatedDonor.contactNumber || '';

        // Hide form
        document.getElementById('updateFormContainer').style.display = 'none';

        // Show card
        document.getElementById('donorDetails').style.display = 'block';

        showMessage(
            'message',
            '✅ Donor updated successfully',
            'success'
        );

    } catch (error) {

        console.error("Update error:", error);

        showMessage(
            'message',
            '❌ ' + error.message,
            'error'
        );
    }

});



// DELETE DONOR


document.getElementById('deleteBtn').addEventListener('click', async function () {

    const confirmDelete = confirm(
        'Are you sure you want to delete your donor profile?'
    );

    if (!confirmDelete) {
        return;
    }

    try {

        await donorAPI.deleteMe();

        showMessage(
            'message',
            '✅ Donor deleted successfully',
            'success'
        );

        // Hide donor card
        document.getElementById('donorDetails').style.display = 'none';

    } catch (error) {

        console.error("Delete error:", error);

        showMessage(
            'message',
            '❌ ' + error.message,
            'error'
        );
    }

});


// Load donor when page opens
loadMyDonor();
