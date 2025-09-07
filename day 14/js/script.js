document.addEventListener('DOMContentLoaded', function() {
    // Toggle between sign-in and sign-up panels
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('container');

    // Check if user is already logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        window.location.href = 'dashboard.html';
    }

    signUpButton.addEventListener('click', () => {
        container.classList.add('right-panel-active');
    });

    signInButton.addEventListener('click', () => {
        container.classList.remove('right-panel-active');
    });
    
    // Initialize users database if it doesn't exist
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }

    // Form validation and submission
    const loginButton = document.getElementById('login-button');
    const signupButton = document.getElementById('signup-button');

    // Enhanced form validation
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePassword(password) {
        // Password must be at least 6 characters and contain at least one number
        return password.length >= 6 && /\d/.test(password);
    }
    
    function validateStudentId(studentId) {
        // Student ID should be alphanumeric and at least 5 characters
        return /^[a-zA-Z0-9]{5,}$/.test(studentId);
    }

    // Login form submission with user validation
    loginButton.addEventListener('click', function() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        let isValid = true;
        let errorMessage = '';

        if (!validateEmail(email)) {
            isValid = false;
            errorMessage += 'Please enter a valid email address.\n';
        }

        if (!validatePassword(password)) {
            isValid = false;
            errorMessage += 'Password must be at least 6 characters and contain at least one number.\n';
        }

        if (isValid) {
            // Get users from localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Find user with matching email
            const user = users.find(u => u.email === email);
            
            if (user && user.password === password) {
                // Store current user data in localStorage (excluding password)
                const userData = {
                    name: user.name,
                    email: user.email,
                    studentId: user.studentId,
                    loginTime: new Date().toISOString()
                };
                
                localStorage.setItem('currentUser', JSON.stringify(userData));
                
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            } else {
                alert('Invalid email or password. Please try again.');
            }
        } else {
            alert(errorMessage);
        }
    });

    // Signup form submission with data storage
    signupButton.addEventListener('click', function() {
        const name = document.getElementById('signup-name').value;
        const studentId = document.getElementById('signup-studentid').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        let isValid = true;
        let errorMessage = '';

        if (!name || name.length < 2) {
            isValid = false;
            errorMessage += 'Please enter your full name (at least 2 characters).\n';
        }

        if (!validateStudentId(studentId)) {
            isValid = false;
            errorMessage += 'Please enter a valid student ID (alphanumeric, at least 5 characters).\n';
        }

        if (!validateEmail(email)) {
            isValid = false;
            errorMessage += 'Please enter a valid email address.\n';
        }

        if (!validatePassword(password)) {
            isValid = false;
            errorMessage += 'Password must be at least 6 characters and contain at least one number.\n';
        }

        if (isValid) {
            // Get existing users
            const users = JSON.parse(localStorage.getItem('users')) || [];
            
            // Check if email already exists
            if (users.some(user => user.email === email)) {
                alert('An account with this email already exists. Please use a different email or login.');
                return;
            }
            
            // Check if student ID already exists
            if (users.some(user => user.studentId === studentId)) {
                alert('An account with this student ID already exists. Please verify your ID or login.');
                return;
            }
            
            // Create new user object
            const newUser = {
                name,
                studentId,
                email,
                password,
                createdAt: new Date().toISOString()
            };
            
            // Add to users array
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            // Store current user data (excluding password)
            const userData = {
                name,
                email,
                studentId,
                loginTime: new Date().toISOString()
            };
            
            localStorage.setItem('currentUser', JSON.stringify(userData));
            
            // Show success message and redirect
            alert('Account created successfully! Redirecting to dashboard...');
            window.location.href = 'dashboard.html';
        } else {
            alert(errorMessage);
        }
    });
});