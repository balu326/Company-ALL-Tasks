// LuxeMarket Authentication System

// Configuration
const AUTH_CONFIG = {
    // Default admin credentials (in production, this should be handled server-side)
    DEFAULT_ADMIN: {
        username: 'admin',
        password: 'luxeadmin2024'
    },
    SESSION_KEY: 'luxemarket_admin_session',
    SESSION_DURATION: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION: 15 * 60 * 1000 // 15 minutes in milliseconds
};

// Authentication Manager
class AuthManager {
    constructor() {
        this.sessionKey = AUTH_CONFIG.SESSION_KEY;
        this.lockoutKey = 'luxemarket_lockout';
        this.attemptsKey = 'luxemarket_attempts';
    }

    // Check if user is currently authenticated
    isAuthenticated() {
        const session = this.getSession();
        if (!session) return false;

        // Check if session has expired
        if (new Date().getTime() > session.expiresAt) {
            this.clearSession();
            return false;
        }

        return true;
    }

    // Get current session
    getSession() {
        try {
            const sessionData = localStorage.getItem(this.sessionKey);
            return sessionData ? JSON.parse(sessionData) : null;
        } catch (error) {
            console.error('Error reading session:', error);
            return null;
        }
    }

    // Create new session
    createSession(userData, rememberMe = false) {
        const duration = rememberMe ? AUTH_CONFIG.SESSION_DURATION * 7 : AUTH_CONFIG.SESSION_DURATION; // 7 days if remembered
        const session = {
            user: userData,
            createdAt: new Date().getTime(),
            expiresAt: new Date().getTime() + duration,
            rememberMe: rememberMe
        };

        try {
            localStorage.setItem(this.sessionKey, JSON.stringify(session));
            this.clearLoginAttempts();
            return true;
        } catch (error) {
            console.error('Error creating session:', error);
            return false;
        }
    }

    // Clear current session
    clearSession() {
        localStorage.removeItem(this.sessionKey);
    }

    // Check if account is locked out
    isLockedOut() {
        try {
            const lockoutData = localStorage.getItem(this.lockoutKey);
            if (!lockoutData) return false;

            const lockout = JSON.parse(lockoutData);
            const now = new Date().getTime();

            if (now > lockout.expiresAt) {
                this.clearLockout();
                return false;
            }

            return true;
        } catch (error) {
            console.error('Error checking lockout:', error);
            return false;
        }
    }

    // Record failed login attempt
    recordFailedAttempt() {
        try {
            let attempts = parseInt(localStorage.getItem(this.attemptsKey) || '0');
            attempts++;
            localStorage.setItem(this.attemptsKey, attempts.toString());

            if (attempts >= AUTH_CONFIG.MAX_LOGIN_ATTEMPTS) {
                this.lockAccount();
                return { locked: true, attempts: attempts };
            }

            return { locked: false, attempts: attempts, remaining: AUTH_CONFIG.MAX_LOGIN_ATTEMPTS - attempts };
        } catch (error) {
            console.error('Error recording failed attempt:', error);
            return { locked: false, attempts: 0, remaining: AUTH_CONFIG.MAX_LOGIN_ATTEMPTS };
        }
    }

    // Lock account after too many failed attempts
    lockAccount() {
        const lockout = {
            lockedAt: new Date().getTime(),
            expiresAt: new Date().getTime() + AUTH_CONFIG.LOCKOUT_DURATION
        };

        try {
            localStorage.setItem(this.lockoutKey, JSON.stringify(lockout));
        } catch (error) {
            console.error('Error locking account:', error);
        }
    }

    // Clear lockout
    clearLockout() {
        localStorage.removeItem(this.lockoutKey);
    }

    // Clear login attempts
    clearLoginAttempts() {
        localStorage.removeItem(this.attemptsKey);
    }

    // Get remaining lockout time in minutes
    getRemainingLockoutTime() {
        try {
            const lockoutData = localStorage.getItem(this.lockoutKey);
            if (!lockoutData) return 0;

            const lockout = JSON.parse(lockoutData);
            const remaining = lockout.expiresAt - new Date().getTime();

            return Math.max(0, Math.ceil(remaining / 60000)); // Convert to minutes
        } catch (error) {
            console.error('Error getting lockout time:', error);
            return 0;
        }
    }

    // Validate credentials
    validateCredentials(username, password) {
        // In a real application, this would validate against a secure backend
        // For demo purposes, we use the default credentials
        return username === AUTH_CONFIG.DEFAULT_ADMIN.username && 
               password === AUTH_CONFIG.DEFAULT_ADMIN.password;
    }

    // Login method
    async login(username, password, rememberMe = false) {
        // Check if account is locked
        if (this.isLockedOut()) {
            const remainingTime = this.getRemainingLockoutTime();
            throw new Error(`Account is locked. Please try again in ${remainingTime} minutes.`);
        }

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Validate credentials
        if (!this.validateCredentials(username.trim(), password)) {
            const attemptResult = this.recordFailedAttempt();
            
            if (attemptResult.locked) {
                const remainingTime = this.getRemainingLockoutTime();
                throw new Error(`Too many failed attempts. Account locked for ${remainingTime} minutes.`);
            } else {
                throw new Error(`Invalid credentials. ${attemptResult.remaining} attempts remaining.`);
            }
        }

        // Create session
        const userData = {
            username: username.trim(),
            role: 'admin',
            loginTime: new Date().toISOString()
        };

        const sessionCreated = this.createSession(userData, rememberMe);
        if (!sessionCreated) {
            throw new Error('Failed to create session. Please try again.');
        }

        return userData;
    }

    // Logout method
    logout() {
        this.clearSession();
        
        // Redirect to login page if on admin page
        if (window.location.pathname.includes('admin.html')) {
            window.location.href = 'admin-login.html';
        }
    }

    // Redirect if not authenticated (for protected pages)
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = 'admin-login.html';
            return false;
        }
        return true;
    }

    // Get current user
    getCurrentUser() {
        const session = this.getSession();
        return session ? session.user : null;
    }
}

// Global auth instance
const auth = new AuthManager();

// Login page functionality
if (window.location.pathname.includes('admin-login.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        // Check if already authenticated
        if (auth.isAuthenticated()) {
            window.location.href = 'admin.html';
            return;
        }

        const loginForm = document.getElementById('loginForm');
        const loginBtn = document.getElementById('loginBtn');
        const errorMessage = document.getElementById('errorMessage');
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        const rememberMeCheck = document.getElementById('rememberMe');

        // Show error message
        function showError(message) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
            
            // Auto hide after 5 seconds
            setTimeout(() => {
                errorMessage.style.display = 'none';
            }, 5000);
        }

        // Hide error message
        function hideError() {
            errorMessage.style.display = 'none';
        }

        // Show loading state
        function showLoading() {
            const loginText = loginBtn.querySelector('.login-text');
            loginText.innerHTML = '<div class="loading"><div class="spinner"></div> Authenticating...</div>';
            loginBtn.disabled = true;
        }

        // Hide loading state
        function hideLoading() {
            const loginText = loginBtn.querySelector('.login-text');
            loginText.innerHTML = '<i class="fas fa-sign-in-alt"></i> Access Dashboard';
            loginBtn.disabled = false;
        }

        // Handle form submission
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = usernameInput.value;
            const password = passwordInput.value;
            const rememberMe = rememberMeCheck.checked;

            if (!username || !password) {
                showError('Please enter both username and password.');
                return;
            }

            hideError();
            showLoading();

            try {
                await auth.login(username, password, rememberMe);
                
                // Success - redirect to admin dashboard
                window.location.href = 'admin.html';
                
            } catch (error) {
                showError(error.message);
                
                // Clear password field on error
                passwordInput.value = '';
                passwordInput.focus();
                
            } finally {
                hideLoading();
            }
        });

        // Auto-focus username field
        usernameInput.focus();

        // Clear error on input
        [usernameInput, passwordInput].forEach(input => {
            input.addEventListener('input', hideError);
        });

        // Check for lockout on page load
        if (auth.isLockedOut()) {
            const remainingTime = auth.getRemainingLockoutTime();
            showError(`Account is locked. Please try again in ${remainingTime} minutes.`);
            loginBtn.disabled = true;
            
            // Check every minute for lockout expiry
            const lockoutCheck = setInterval(() => {
                if (!auth.isLockedOut()) {
                    clearInterval(lockoutCheck);
                    hideError();
                    loginBtn.disabled = false;
                } else {
                    const remaining = auth.getRemainingLockoutTime();
                    if (remaining > 0) {
                        showError(`Account is locked. Please try again in ${remaining} minutes.`);
                    }
                }
            }, 60000);
        }
    });
}

// Admin page functionality
if (window.location.pathname.includes('admin.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        // Require authentication
        if (!auth.requireAuth()) {
            return;
        }

        // Add logout functionality to existing admin page
        addLogoutFunctionality();
        
        // Update admin navbar with user info
        updateAdminNavbar();
        
        // Auto-refresh session
        startSessionRefresh();
    });
}

// Add logout functionality to admin page
function addLogoutFunctionality() {
    const navActions = document.querySelector('.nav-actions');
    if (navActions) {
        // Create logout button
        const logoutBtn = document.createElement('button');
        logoutBtn.className = 'nav-btn';
        logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
        logoutBtn.style.marginLeft = '1rem';
        
        logoutBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                showToast('Logging out...', 'info');
                setTimeout(() => {
                    auth.logout();
                }, 1000);
            }
        });
        
        navActions.appendChild(logoutBtn);
    }
}

// Update admin navbar with user info
function updateAdminNavbar() {
    const currentUser = auth.getCurrentUser();
    if (currentUser) {
        const navLogo = document.querySelector('.nav-logo h1');
        if (navLogo) {
            // Add welcome message
            const welcomeMsg = document.createElement('div');
            welcomeMsg.style.cssText = `
                font-size: 0.8rem;
                color: var(--secondary-color);
                font-weight: normal;
                margin-top: 0.25rem;
            `;
            welcomeMsg.textContent = `Welcome, ${currentUser.username}`;
            navLogo.parentNode.appendChild(welcomeMsg);
        }
    }
}

// Start session refresh mechanism
function startSessionRefresh() {
    // Check session validity every 5 minutes
    setInterval(() => {
        if (!auth.isAuthenticated()) {
            alert('Your session has expired. Please login again.');
            auth.logout();
        }
    }, 5 * 60 * 1000);
}

// Toast notification function (if not already defined)
if (typeof showToast === 'undefined') {
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--card-bg);
            color: var(--primary-color);
            padding: 1rem 1.5rem;
            border-radius: 8px;
            border: 1px solid var(--glass-border);
            box-shadow: var(--shadow-medium);
            z-index: 4000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;
        
        if (type === 'success') {
            toast.style.borderLeftColor = 'var(--success-color)';
            toast.style.borderLeftWidth = '4px';
        } else if (type === 'error') {
            toast.style.borderLeftColor = 'var(--danger-color)';
            toast.style.borderLeftWidth = '4px';
        } else if (type === 'info') {
            toast.style.borderLeftColor = 'var(--accent-color)';
            toast.style.borderLeftWidth = '4px';
        }
        
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            toast.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
}

// Export auth for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = auth;
} else {
    window.auth = auth;
}
