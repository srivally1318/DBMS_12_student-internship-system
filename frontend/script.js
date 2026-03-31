// frontend/script.js
const API_BASE = 'http://localhost:5000/api';

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

// Mock Data for Internships (Remains local logic as no DB table was specified for this)
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

// Render Internships
async function renderInternships() {
    const grid = document.getElementById('internships-grid');
    if (!grid) return;

    const internships = JSON.parse(localStorage.getItem('internships')) || [];
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Fetch user applications from backend
    let userApplications = [];
    try {
        if (currentUser) {
            const res = await fetch(`${API_BASE}/enrollments/${currentUser.id}`);
            const data = await res.json();
            if (data.success) userApplications = data.enrollments;
        }
    } catch (err) {
        console.error('Failed to fetch applications', err);
    }

    grid.innerHTML = '';
    
    internships.forEach(intern => {
        const hasApplied = userApplications.some(app => app.courseName === intern.title);
        
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-header">
                <h3 class="card-title">${intern.title}</h3>
                <div class="card-subtitle">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                    ${intern.company} &bull; ${intern.location}
                </div>
            </div>
            <div class="card-body">
                <p>${intern.description}</p>
            </div>
            <div class="card-footer">
                ${hasApplied 
                    ? '<span class="badge badge-Applied" style="margin-top: 0.5rem;">Applied</span>' 
                    : `<button class="btn btn-primary apply-btn" data-id="${intern.id}" data-title="${intern.title}">Apply Now</button>`}
            </div>
        `;
        grid.appendChild(card);
    });

    // Add event listeners to apply buttons
    document.querySelectorAll('.apply-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            const title = e.target.getAttribute('data-title');
            openApplicationModal(id, title);
        });
    });
}

function initApplicationModal() {
    const modal = document.getElementById('application-modal');
    const closeBtn = document.getElementById('close-modal');
    const form = document.getElementById('apply-form');

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            document.getElementById('apply-success').classList.add('hidden');
        });
    }

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const internshipTitle = document.getElementById('modal-internship-title').value;
            const phone = document.getElementById('apply-phone').value;
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));

            const applyMsg = document.getElementById('apply-success');

            try {
                const response = await fetch(`${API_BASE}/enroll`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        userId: currentUser.id, 
                        courseName: internshipTitle, 
                        phone: phone 
                    })
                });
                
                const result = await response.json();

                if (result.success) {
                    applyMsg.textContent = 'Application submitted successfully!';
                    applyMsg.classList.remove('alert-error');
                    applyMsg.classList.add('alert-success');
                    applyMsg.classList.remove('hidden');

                    setTimeout(() => {
                        modal.classList.remove('active');
                        applyMsg.classList.add('hidden');
                        form.reset();
                        renderInternships(); // re-render to show Applied badge
                    }, 1000);
                } else {
                    applyMsg.textContent = result.message;
                    applyMsg.classList.add('alert-error');
                    applyMsg.classList.remove('alert-success');
                    applyMsg.classList.remove('hidden');
                }
            } catch (err) {
                applyMsg.textContent = 'Network error during submission.';
                applyMsg.classList.add('alert-error');
                applyMsg.classList.remove('alert-success');
                applyMsg.classList.remove('hidden');
            }
        });
    }
}

function openApplicationModal(id, title) {
    const modal = document.getElementById('application-modal');
    document.getElementById('internship-id').value = id;
    document.getElementById('modal-internship-title').value = title;
    modal.classList.add('active');
}

// Render Applications
async function renderApplications() {
    const grid = document.getElementById('applications-grid');
    const noAppsMsg = document.getElementById('no-apps-msg');
    if (!grid) return;

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;

    try {
        const response = await fetch(`${API_BASE}/enrollments/${currentUser.id}`);
        const result = await response.json();

        let userApps = result.success ? result.enrollments : [];

        // ✅ Frontend restriction: Ensure only unique enrollments per user are displayed
        const uniqueCourses = new Set();
        userApps = userApps.filter(app => {
            if (!uniqueCourses.has(app.courseName)) {
                uniqueCourses.add(app.courseName);
                return true;
            }
            return false;
        });

        if (userApps.length === 0) {
            noAppsMsg.classList.remove('hidden');
            return;
        }

        grid.innerHTML = '';
        
        userApps.forEach(app => {
            // Retrieve company from mocked internships config to maintain UI layout
            const internships = JSON.parse(localStorage.getItem('internships')) || [];
            const internData = internships.find(i => i.title === app.courseName) || { company: 'External Company' };

            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="card-header">
                    <h3 class="card-title">${app.courseName}</h3>
                    <div class="card-subtitle">
                        ${internData.company}
                    </div>
                </div>
                <div class="card-body">
                    <ul style="list-style: none; padding: 0; margin: 0; font-size: 0.95rem; color: var(--text-dark);">
                        <li style="margin-bottom: 0.5rem;"><strong>Applied On:</strong> ${new Date(app.date).toLocaleDateString()}</li>
                        <li style="margin-bottom: 0.5rem;"><strong>Phone:</strong> ${app.phone}</li>
                        <li><strong>Status:</strong> <span class="badge badge-Applied" style="margin-left: 0.5rem;">Applied</span></li>
                    </ul>
                </div>
            `;
            grid.appendChild(card);
        });
    } catch (err) {
        console.error('Failed to render applications:', err);
    }
}

function initSettingsForm() {
    const form = document.getElementById('settings-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const newName = document.getElementById('profile-name').value;
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        // Update current user locally
        currentUser.name = newName;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        // Update nav display
        updateNavigation(currentUser);

        const successMsg = document.getElementById('settings-success');
        successMsg.textContent = 'Profile updated successfully! (Local)';
        successMsg.classList.remove('hidden');

        setTimeout(() => {
            successMsg.classList.add('hidden');
        }, 3000);
    });
}
