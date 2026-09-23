const form = document.getElementById('registerForm');

const registerBtn = document.getElementById('registerBtn');

const messageDiv = document.getElementById('message');



function showMessage(text, type) {

    messageDiv.textContent = text;

    messageDiv.className = 'message ' + type;

    messageDiv.style.display = 'block';
}



form.addEventListener('submit', async (e) => {

    e.preventDefault();


    const password =
        document.getElementById('password').value;


    const confirmPassword =
        document.getElementById('confirmPassword').value;



    // Check if passwords match

    if (password !== confirmPassword) {

        showMessage(
            'Passwords do not match!',
            'error'
        );

        return;
    }



    const registerData = {

        username:
            document
                .getElementById('username')
                .value
                .trim(),

        email:
            document
                .getElementById('email')
                .value
                .trim(),

        password: password
    };



    registerBtn.disabled = true;

    registerBtn.textContent = 'Creating Account...';



    try {

        const response = await authAPI.register(registerData);

        if (response) {

            showMessage(
                'Account created! Redirecting to login...',
                'success'
            );

            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);

        } else {
            throw new Error('Registration failed');
        }



    } catch (error) {

        console.error(
            'Registration error:',
            error
        );


        showMessage(
            error.message ||
            'Registration failed. Username may already exist.',
            'error'
        );


    } finally {

        registerBtn.disabled = false;

        registerBtn.textContent = 'Create Account';
    }

});