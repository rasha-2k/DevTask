// Navigation: show only the selected page section
function showSection(sectionId) {
    for (const section of document.querySelectorAll('.page-section')) {
        section.classList.add('hidden');
    }
    document.getElementById(sectionId).classList.remove('hidden');
}

// Authentication Tabs: show login or register form
function showAuthTab(tab) {
    // Get the tab elements
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (tab === 'login') {
        // Activate login tab and form
        loginTab.classList.add('active');
        registerTab.classList.remove('active');

        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    } else {
        // Activate register tab and form
        registerTab.classList.add('active');
        loginTab.classList.remove('active');

        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    }
}

// Toggle password visibility with icon change
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    const icon = button.querySelector('.material-icons');

    if (input.type === 'password') {
        input.type = 'text';
        icon.textContent = 'visibility_off';
    } else {
        input.type = 'password';
        icon.textContent = 'visibility';
    }
}
// User Sidebar
function toggleUserSidebar() {
    const sidebar = document.getElementById('userSidebar');
    const overlay = document.getElementById('userSidebarOverlay');
    const isVisible = !sidebar.classList.contains('translate-x-full');

    if (isVisible) {
        closeUserSidebar();
    } else {
        sidebar.classList.remove('translate-x-full');
        overlay.classList.remove('hidden');
    }
}

function closeUserSidebar() {
    const sidebar = document.getElementById('userSidebar');
    const overlay = document.getElementById('userSidebarOverlay');
    sidebar.classList.add('translate-x-full');
    overlay.classList.add('hidden');
}

function signOutUser() {
    alert("Signed out! (In real app: clear session, redirect to login)");
    closeUserSidebar();
    showAuthPage('login');
}

// Form submission handlers
function loginUser() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const remember = document.getElementById('rememberMe').checked;

    // Here you would typically make an API call to authenticate
    console.log('Login attempt:', { email, password, remember });

    // For demo purposes, show a success notification
    showNotification('Login successful!', 'success');

    // Redirect to dashboard (for demo)
    setTimeout(() => {
        showSection('dashboardPage');
    }, 1000);
}

function registerUser() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const role = document.getElementById('userRole').value;
    const termsAccepted = document.getElementById('terms').checked;

    // Validate passwords match
    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }

    // Here you would typically make an API call to register
    console.log('Registration attempt:', { name, email, password, role, termsAccepted });

    // For demo purposes, show a success notification
    showNotification('Registration successful!', 'success');

    // Switch to login tab (for demo)
    setTimeout(() => {
        showAuthTab('login');
    }, 1000);
}

// notification (Toast) function
function showNotification(message, type = 'success') {
    const notif = document.createElement('div');

    // Set base classes
    notif.className = 'px-4 py-3 rounded shadow-md flex items-center';

    // Add type-specific classes
    switch (type) {
        case 'success':
            notif.classList.add('bg-green-500', 'text-white');
            notif.innerHTML = `<span class="material-icons mr-2">check_circle</span>${message}`;
            break;
        case 'error':
            notif.classList.add('bg-red-500', 'text-white');
            notif.innerHTML = `<span class="material-icons mr-2">error</span>${message}`;
            break;
        case 'warning':
            notif.classList.add('bg-yellow-500', 'text-white');
            notif.innerHTML = `<span class="material-icons mr-2">warning</span>${message}`;
            break;
        case 'info':
            notif.classList.add('bg-blue-500', 'text-white');
            notif.innerHTML = `<span class="material-icons mr-2">info</span>${message}`;
            break;
    }

    document.getElementById('notificationContainer').appendChild(notif);

    // Add animation classes
    notif.style.animation = 'fadeIn 0.3s, fadeOut 0.3s 2.7s';

    // Remove the notification after animation
    setTimeout(() => {
        notif.remove();
    }, 3000);
}


// Dark Mode Toggle with localStorage support and variable updates
const darkBtn = document.getElementById('toggleDark');
const bodyEl = document.getElementById('body');

darkBtn.addEventListener('click', () => {
    bodyEl.classList.toggle('dark-mode');

    // Update the icon to match the current theme
    if (bodyEl.classList.contains('dark-mode')) {
        darkBtn.textContent = 'light_mode';
        localStorage.setItem('devtasks-theme', 'dark');
    } else {
        darkBtn.textContent = 'dark_mode';
        localStorage.setItem('devtasks-theme', 'light');
    }
});

window.addEventListener('DOMContentLoaded', () => {
    // Apply saved theme
    if (localStorage.getItem('devtasks-theme') === 'dark') {
        bodyEl.classList.add('dark-mode');
        darkBtn.textContent = 'light_mode';
    }

    // Show Dashboard by default
    showSection('dashboardPage');
});

//! Projects Page
function showProjectTab(tabName) {
    // Hide all project tab contents
    const tabContents = document.querySelectorAll('.project-tab-content');
    for (const content of tabContents) {
        content.classList.add('hidden');
    }

    // Remove active styles from all project tabs
    const projectTabs = document.querySelectorAll('.project-tab');
    for (const tab of projectTabs) {
        tab.classList.remove('text-blue-600', 'border-b-2', 'border-blue-600');
        tab.classList.add('text-gray-600');
    }

    // Show selected tab content
    document.getElementById(`projectTab${capitalize(tabName)}`).classList.remove('hidden');

    // Add active styles to selected tab
    for (const tab of projectTabs) {
        if (tab.textContent.trim().toLowerCase() === tabName) {
            tab.classList.add('text-blue-600', 'border-b-2', 'border-blue-600');
        }
    }
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function saveProject() {
    // Gather form data
    const title = document.getElementById('projectTitle').value;
    const description = document.getElementById('projectDescription').value;
    const deadline = document.getElementById('projectDeadline').value;
    const team = document.getElementById('projectTeam').value;
    const status = document.getElementById('projectStatus').value;

    // In a real application, send this data to your backend via an API call.
    console.log({ title, description, deadline, team, status });

    // Show a success notification (uses your existing showNotification function)
    showNotification("Project saved successfully!", "success");

    // Redirect back to the Projects Page after a short delay
    setTimeout(() => {
        showSection('projectsPage');
    }, 1000);
}

//! Tasks Page
function saveTask() {
    // Gather form data
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const assignee = document.getElementById('taskAssignee').value;
    const status = document.getElementById('taskStatus').value;
    const priority = document.getElementById('taskPriority').value;
    const dueDate = document.getElementById('taskDueDate').value;
    const project = document.getElementById('taskProject').value;

    // For a real application, send this data to your backend via an API call.
    console.log({
        title, description, assignee, status, priority, dueDate, project
    });

    // Show a success notification
    showNotification("Task saved successfully!", "success");

    // Redirect back to the Tasks Page after a short delay
    setTimeout(() => {
        showSection('tasksPage');
    }, 1000);
}

//////////////////////////////////////////////////
// Show Authentication Page with the appropriate tab
function showAuthPage(tab) {
    showSection('authPage');
    showAuthTab(tab);
}

// Modal functions
function openModal() {
    document.getElementById('customModal').classList.remove('hidden');
}
function closeModal() {
    document.getElementById('customModal').classList.add('hidden');
}

// Confirmation dialog functions
function openConfirmation() {
    document.getElementById('confirmationDialog').classList.remove('hidden');
}
function closeConfirmation() {
    document.getElementById('confirmationDialog').classList.add('hidden');
}
function confirmAction() {
    alert('Action confirmed!');
    closeConfirmation();
}
//////////////////////////////////////////////////
// Global variable to store the chart instance
let dashboardChart;

// Function to create the chart with the given type
function createDashboardChart(chartType) {
    const ctx = document.getElementById('dashboardTaskChart').getContext('2d');
    dashboardChart = new Chart(ctx, {
        type: chartType,
        data: {
            labels: ['To Do', 'In Progress', 'Done'],
            datasets: [{
                label: 'Tasks by Status',
                data: [8, 12, 20],
                backgroundColor: ['#60A5FA', '#FBBF24', '#34D399']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' },
                tooltip: { enabled: true }
            }
        }
    });
}

// Function to update the chart type when the user selects a new option
function updateChartType(newType) {
    if (dashboardChart) {
        dashboardChart.destroy();
    }
    createDashboardChart(newType);
}

// Create the default chart on page load
window.addEventListener('DOMContentLoaded', () => {
    // ... other initialization code ...
    // Create the default chart, e.g., 'doughnut'
    createDashboardChart('doughnut');
});
