/**
 * Authentication JavaScript for signup and login pages
 * Handles form validation, password visibility, strength checking, and form submission
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the appropriate form functions based on the page
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');

    if (signupForm) {
        initializeSignup();
    }

    if (loginForm) {
        initializeLogin();
    }

    // Initialize password toggle buttons
    initializePasswordToggles();
});

function initializeSignup() {
    const signupForm = document.getElementById('signup-form');

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validate form
        if (validateSignupForm()) {
            // Collect form data
            const formData = {
                name: signupForm.fullname.value,
                email: signupForm.email.value,
                username: signupForm.username.value,
                role: signupForm.role.value,
                department: signupForm.department.value,
                joinDate: new Date().toLocaleDateString(),
                stats: {
                    quizzesTaken: 0,
                    averageScore: 0,
                    totalPoints: 0
                }
            };

            // Save to localStorage
            localStorage.setItem('userData', JSON.stringify(formData));

            // Show success message
            showNotification('Account created successfully! Please log in to continue.', 'success');

            // Redirect to login page after a short delay
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        }
    });
}

function initializeLogin() {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Collect form data
            const loginEmail = loginForm['login-email'].value;
            const loginPassword = loginForm['login-password'].value;

            // Get stored user data
            const userData = JSON.parse(localStorage.getItem('userData'));

            // Validate credentials
            if (userData && (userData.email === loginEmail || userData.username === loginEmail)) {
                // Successful login
                showNotification('Login successful!', 'success');

                // Update remember-me if checked
                if (loginForm['remember-me'].checked) {
                    localStorage.setItem('rememberMe', 'true');
                }

                // Store current user session
                localStorage.setItem('currentUser', JSON.stringify(userData));

                // Redirect to dashboard after a short delay
                setTimeout(() => {
                    window.location.href = 'quiz_platform.html';
                }, 1500);
            } else {
                // Invalid credentials
                showNotification('Invalid email/username or password', 'error');
            }
        });
    }
}

/**
 * Initialize password toggle buttons
 */
function initializePasswordToggles() {
    const toggleButtons = document.querySelectorAll('.toggle-password');

    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const input = button.parentElement.querySelector('input');
            const icon = button.querySelector('i');

            if (input.type === 'password') {
                input.type = 'text';
                icon.className = 'fas fa-eye-slash';
            } else {
                input.type = 'password';
                icon.className = 'fas fa-eye';
            }
        });
    });
}

/**
 * Validate the signup form
 * @returns {boolean} Whether the form is valid
 */
function validateSignupForm() {
    const form = document.getElementById('signup-form');
    let isValid = true;

    // Reset previous error states
    const errorGroups = document.querySelectorAll('.form-group.error');
    errorGroups.forEach(group => group.classList.remove('error'));

    // Validate full name (at least 2 words)
    const fullname = form.fullname.value.trim();
    if (fullname.split(' ').filter(word => word.length > 0).length < 2) {
        showInputError('fullname', 'Please enter your full name (first and last name)');
        isValid = false;
    }

    // Validate email
    const email = form.email.value.trim();
    if (!isValidEmail(email)) {
        showInputError('email', 'Please enter a valid email address');
        isValid = false;
    }

    // Validate username (at least 3 characters, no spaces)
    const username = form.username.value.trim();
    if (username.length < 3 || username.includes(' ')) {
        showInputError('username', 'Username must be at least 3 characters without spaces');
        isValid = false;
    }

    // Validate password (at least 8 characters, with complexity)
    const password = form.password.value;
    if (!isStrongPassword(password)) {
        showInputError('password', 'Password must be at least 8 characters with numbers and letters');
        isValid = false;
    }

    // Validate confirm password
    const confirmPassword = form['confirm-password'].value;
    if (password !== confirmPassword) {
        showInputError('confirm-password', 'Passwords do not match');
        isValid = false;
    }

    // Validate department selection
    const department = form.department.value;
    if (!department) {
        showInputError('department', 'Please select your department');
        isValid = false;
    }

    // Validate terms checkbox
    if (!form.terms.checked) {
        const termsGroup = form.terms.closest('.form-group');
        termsGroup.classList.add('error');
        isValid = false;
    }

    return isValid;
}

/**
 * Show error for a specific input
 * @param {string} inputId - The ID of the input element
 * @param {string} errorMessage - The error message to display
 */
function showInputError(inputId, errorMessage) {
    const input = document.getElementById(inputId);
    if (!input) return;

    const formGroup = input.closest('.form-group');
    formGroup.classList.add('error');

    const label = formGroup.querySelector('label');
    if (label) {
        label.setAttribute('data-error', errorMessage);
    }
}

/**
 * Check if email is valid
 * @param {string} email - The email to validate
 * @returns {boolean} Whether the email is valid
 */
function isValidEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Check if password is strong enough
 * @param {string} password - The password to check
 * @returns {boolean} Whether the password is strong enough
 */
function isStrongPassword(password) {
    // At least 8 characters with at least one letter and one number
    return password.length >= 8 &&
           /[A-Za-z]/.test(password) &&
           /[0-9]/.test(password);
}

/**
 * Update password strength meter
 * @param {string} password - The password to check
 * @param {HTMLElement} strengthElement - The strength meter element
 */
function updatePasswordStrength(password, strengthElement) {
    // Get the strength segments and text
    const segments = strengthElement.querySelectorAll('.strength-segment');
    const strengthText = strengthElement.querySelector('.strength-text');

    // Remove previous strength classes
    strengthElement.classList.remove('strength-weak', 'strength-medium', 'strength-strong', 'strength-very-strong');

    if (!password) {
        strengthText.textContent = 'Password strength';
        return;
    }

    // Calculate password strength
    let strength = 0;

    // Length check (up to 4 points)
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;

    // Character variety checks
    if (/[0-9]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    // Set strength level
    let strengthLevel = '';
    let strengthMessage = '';

    if (strength <= 2) {
        strengthLevel = 'strength-weak';
        strengthMessage = 'Weak';
    } else if (strength <= 4) {
        strengthLevel = 'strength-medium';
        strengthMessage = 'Medium';
    } else if (strength <= 6) {
        strengthLevel = 'strength-strong';
        strengthMessage = 'Strong';
    } else {
        strengthLevel = 'strength-very-strong';
        strengthMessage = 'Very Strong';
    }

    // Update UI
    strengthElement.classList.add(strengthLevel);
    strengthText.textContent = `Password strength: ${strengthMessage}`;
}

/**
 * Show notification message
 * @param {string} message - The message to show
 * @param {string} type - The type of notification ('success' or 'error')
 */
function showNotification(message, type) {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        document.body.removeChild(notification);
    });

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Add to document
    document.body.appendChild(notification);

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 12px 24px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            opacity: 0;
            transition: opacity 0.3s, transform 0.3s;
            z-index: 1000;
        }

        .notification.success {
            background-color: var(--success-color);
        }

        .notification.error {
            background-color: var(--error-color);
        }

        .notification.show {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    `;
    document.head.appendChild(style);

    // Show with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Remove after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            try {
                document.body.removeChild(notification);
            } catch (e) {
                // In case it was already removed
            }
        }, 300);
    }, 3000);
}
