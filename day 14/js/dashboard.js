document.addEventListener('DOMContentLoaded', function() {
    // Display current user name and check authentication
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Redirect to login if no user is logged in
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    
    // Update user name in the header and welcome message
    const userNameElement = document.getElementById('user-name');
    const welcomeNameElement = document.getElementById('welcome-name');
    
    if (currentUser.name) {
        userNameElement.textContent = currentUser.name;
        welcomeNameElement.textContent = currentUser.name.split(' ')[0]; // First name only
    } else if (currentUser.email) {
        const username = currentUser.email.split('@')[0];
        userNameElement.textContent = username;
        welcomeNameElement.textContent = username;
    }
    
    // Display student ID if available
    const studentIdElement = document.getElementById('student-id');
    if (studentIdElement && currentUser.studentId) {
        studentIdElement.textContent = `ID: ${currentUser.studentId}`;
    }
    
    // Set current date
    const currentDateElement = document.getElementById('current-date');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    currentDateElement.textContent = today.toLocaleDateString('en-US', options);
    
    // Toggle sidebar on mobile
    const toggleMenu = document.querySelector('.toggle-menu');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    toggleMenu.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        mainContent.classList.toggle('active');
    });
    
    // Handle logout
    const logoutButton = document.getElementById('logout-button');
    
    logoutButton.addEventListener('click', function(e) {
        e.preventDefault();
        // Clear only current user data (keep registered users)
        localStorage.removeItem('currentUser');
        // Redirect to login page
        window.location.href = 'index.html';
    });
    
    // Display login time
    if (currentUser.loginTime) {
        const loginTime = new Date(currentUser.loginTime);
        const loginTimeElement = document.getElementById('login-time');
        if (loginTimeElement) {
            loginTimeElement.textContent = `Last login: ${loginTime.toLocaleString()}`;
        }
    }
    
    // Handle navigation menu clicks
    const navLinks = document.querySelectorAll('.nav-links li a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Prevent default only for links that don't have specific functionality yet
            if (!this.classList.contains('logout-link')) {
                e.preventDefault();
                
                // Remove active class from all links
                navLinks.forEach(navLink => {
                    navLink.parentElement.classList.remove('active');
                });
                
                // Add active class to clicked link
                this.parentElement.classList.add('active');
                
                // Here you would typically load the corresponding content
                // For now, we'll just show an alert
                const pageName = this.querySelector('span').textContent;
                if (pageName !== 'Dashboard' && pageName !== 'Logout') {
                    alert(`${pageName} page is under construction. Coming soon!`);
                }
            }
        });
    });
    
    // Check if user is logged in, if not redirect to login page
    if (!currentUser.email && !currentUser.name) {
        window.location.href = 'index.html';
    }
});