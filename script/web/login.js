(() => {
    const form = document.querySelector('.loginForm');
    const usernameInput = document.getElementById('desktopUsername');
    const passwordInput = document.getElementById('desktopPassword');
    const loginBtn = document.getElementById('desktopLoginBtn');
    const loginError = document.getElementById('desktopLoginError');

    let isSubmitting = false;

    const VALID_USERS = {
        standard_user: 'secret_swag',
        problem_user: 'secret_swag',
        performance_glitch_user: 'secret_swag'
    };

    const LOCKED_USERS = [
        'locked_out_user'
    ];

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        loginError.classList.remove('visible');
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        if (!username || !password) {
            loginError.textContent =
                'Please enter username and password.';
            loginError.classList.add('visible');
            return;
        }

        isSubmitting = true;
        loginBtn.disabled = true;
        loginBtn.innerHTML =
            'Logging in...';
        setTimeout(() => {
            if (LOCKED_USERS.includes(username)) {
                loginError.textContent =
                    'This account is locked.';
                loginError.classList.add('visible');
                resetButton();
                return;
            }
            if (
                VALID_USERS[username] !== password
            ) {
                loginError.textContent =
                    'Invalid username or password.';
                loginError.classList.add('visible');
                passwordInput.value = '';
                passwordInput.focus();
                resetButton();
                return;
            }

            window.location.href =
                './index.html';
        }, 800);

    });
    function resetButton() {
        isSubmitting = false;
        loginBtn.disabled = false;
        loginBtn.innerHTML = 'Login';
    }
})();