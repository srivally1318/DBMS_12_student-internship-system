// frontend/script.js

// ✅ Use local backend URL for development
const API_BASE = 'http://localhost:5000/api';  // <- changed from Render URL

document.addEventListener('DOMContentLoaded', () => {
    // Common Setup
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    updateNavigation(currentUser);

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }

    initializeData();

    // Specific Page Handlers
    initAuthForms();
    if (window.location.pathname.includes('view_internships')) {
        renderInternships();
        initApplicationModal();
    }
    if (window.location.pathname.includes('applications')) {
        renderApplications();
    }
});

// Navigation Utils
function updateNavigation(user) {
    const guestNav = document.getElementById('guest-nav');
    const userNav = document.getElementById('user-nav');
    const userNameSpan = document.getElementById('user-name-display');

    if (user) {
        if(guestNav) guestNav.classList.add('hidden');
        if(userNav) userNav.classList.remove('hidden');
        if(userNameSpan) userNameSpan.textContent = user.name;
    } else {
        if(guestNav) guestNav.classList.remove('hidden');
        if(userNav) userNav.classList.add('hidden');
    }
}

// Authentication Logic
function initAuthForms() {
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const errorMsg = document.getElementById('signup-error');

            if (password !== confirmPassword) {
                errorMsg.textContent = 'Passwords do not match.';
                errorMsg.classList.remove('hidden');
                return;
            }

            try {
                const response = await fetch(`${API_BASE}/signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                });
                const result = await response.json();

                if (result.success) {
                    localStorage.setItem('currentUser', JSON.stringify(result.user));
                    window.location.href = 'dashboard.html';
                } else {
                    errorMsg.textContent = result.message;
                    errorMsg.classList.remove('hidden');
                }
            } catch (err) {
                errorMsg.textContent = 'Network error. Make sure the backend server is running.';
                errorMsg.classList.remove('hidden');
            }
        });
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorMsg = document.getElementById('login-error');

            try {
                const response = await fetch(`${API_BASE}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const result = await response.json();

                if (result.success) {
                    localStorage.setItem('currentUser', JSON.stringify(result.user));
                    window.location.href = 'dashboard.html';
                } else {
                    errorMsg.textContent = result.message;
                    errorMsg.classList.remove('hidden');
                }
            } catch (err) {
                errorMsg.textContent = 'Network error. Make sure the backend server is running.';
                errorMsg.classList.remove('hidden');
            }
        });
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

function requireAuth() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        window.location.href = 'login.html';
    }
    return user;
}

// Mock Data for Internships
function initializeData() {
    const defaultInternships = [
        { id: '1', title: 'Software Engineering Intern', company: 'TechCorp', description: 'Join our team to build scalable web applications using React and Node.js.', location: 'San Francisco, CA' },
        { id: '2', title: 'Data Science Intern', company: 'DataMetrics', description: 'Analyze large datasets and build predictive models using Python and SQL.', location: 'Remote' },
        { id: '3', title: 'UX/UI Design Intern', company: 'CreativeStudio', description: 'Design intuitive user interfaces and conduct user research.', location: 'New York, NY' },
        { id: '4', title: 'DBMS Intern', company: 'Database Solutions Inc.', description: 'Optimize queries, design schemas, and manage MySQL and PostgreSQL databases.', location: 'Austin, TX' },
        { id: '5', title: 'Cybersecurity Intern', company: 'SecureNet Solutions', description: 'Work on network security, vulnerability analysis, and real-time threat detection systems.', location: 'Remote' },
        { id: '6', title: 'Digital Marketing Intern', company: 'GrowthHub Media', description: 'Assist in SEO, social media campaigns, and analytics-driven marketing strategies.', location: 'Mumbai, India' }
    ];
    let stored = JSON.parse(localStorage.getItem('internships')) || [];
    if (stored.length < defaultInternships.length) {
        defaultInternships.forEach(defInt => {
            if (!stored.find(s => s.id === defInt.id)) {
                stored.push(defInt);
            }
        });
        localStorage.setItem('internships', JSON.stringify(stored));
    } else if (!localStorage.getItem('internships')) {
        localStorage.setItem('internships', JSON.stringify(defaultInternships));
    }
}

// ✅ Rest of your script (renderInternships, initApplicationModal, etc.) stays the same
// Just make sure all fetch requests use API_BASE

    