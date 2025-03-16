
//***************! General !***************//
let modaltitle;
let deleteUserIndex = null;
let deleteTeamIndex = null;

window.addEventListener('DOMContentLoaded', () => {
    // Apply saved theme
    if (localStorage.getItem('devtasks-theme') === 'dark') {
        bodyEl.classList.add('dark-mode');
        darkBtn.textContent = 'light_mode';
    }

    // Show Dashboard by default
    showSection('dashboardPage');

    // Handle role-based UI
    if (currentUser.role === 'admin') {
        document.getElementById('adminUserBtn').classList.remove('hidden');
        document.getElementById('adminSystemBtn').classList.remove('hidden');
    }

    // Inject name/email into profile sidebar
    document.querySelector("#userSidebar p.font-semibold").textContent = currentUser.name;
    document.querySelector("#userSidebar p.text-sm").textContent = currentUser.email;

    const savedAppName = localStorage.getItem('devtasks-appname');
    if (savedAppName) {
        const appNameElements = document.querySelectorAll('.appName');
        for (const el of appNameElements) {
            el.textContent = savedAppName;
        }
        document.title = `${savedAppName} | Dashboard`;
    }
    
});

function getCssVariable(variable) {
    return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
}

//! notification (Toast) function
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

//! Navigation: show only the selected page section
function showSection(sectionId) {
    for (const section of document.querySelectorAll('.page-section')) {
        section.classList.add('hidden');
    }
    document.getElementById(sectionId).classList.remove('hidden');
}

//! remove/add hidden functions
function openModal() {
    document.getElementById('customModal').classList.remove('hidden');
}
function closeModal() {
    document.getElementById('customModal').classList.add('hidden');
}
//! Confirmation dialog functions
function openConfirmation() {
    document.getElementById('confirmationDialog').classList.remove('hidden');
}
function closeConfirmation() {
    document.getElementById('confirmationDialog').classList.add('hidden');
}

function confirmDelete() {
    if (deleteUserIndex !== null) {
        UserConfirmAction();
    } else if (deleteTeamIndex !== null) {
        TeamConfirmAction();
    }
}

//***************! Dark Mode Toggle !***************//
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
    updateChartType(currentChartType);
    refreshReportsCharts();
});


//***************! User Sidebar !***************//
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

//***************! Authentication Page !***************//

//! Password Visibility Toggle
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

//! Authentication Tabs: show login or register form
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
//! Show Authentication Page with the appropriate tab
function showAuthPage(tab) {
    showSection('authPage');
    showAuthTab(tab);
}

function signOutUser() {
    alert("Signed out! (In real app: clear session, redirect to login)");
    closeUserSidebar();
    showAuthPage('login');
}

//! Login user function
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


//! Register user function
function registerUser() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const role = 'member'; // Default role for new users
    const termsAccepted = document.getElementById('terms').checked;
    const userEditIndex = document.getElementById("userModal").getAttribute("user-edit-index");
    
    // Validate passwords match
    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }

    // Here you would typically make an API call to register
    console.log('Registration attempt:', { name, email, password, role, termsAccepted });


    if(name && email && password && termsAccepted) {
        if (userEditIndex !== "null") {
            userNames[userEditIndex] = { name, email, role };
        } else {
            userNames.push({ name, email, role });
        }
    }

    // For demo purposes, show a success notification
    //todo showNotification('Registration successful!', 'success');

    // Switch to login tab (for demo)
    setTimeout(() => {
        showAuthTab('login');
    }, 1000);

    renderUsers();
    closeUserModal();
}
const userNames = [
    { name: "user1", email: "lXs0i@example.com", role: "admin"},
    { name: "user2", email: "v7Nw2@example.com", role: "member"},
];
function renderUsers(){
    const userTable = document.getElementById("userTableBody");
    userTable.innerHTML = "";
    
    for (const [userIndex, user] of userNames.entries()) {
        const row = `<tr class='user-row border-t'>
                        <td class='px-4 py-2'>${user.name}</td>
                        <td class='px-4 py-2'>${user.email}</td>
                        <td class='px-4 py-2'>${user.role}</td>
                        <td class='px-4 py-2 space-x-2'>
                            <button onclick='editUser(${userIndex})' class='text-blue-600 hover:underline'>Edit</button>
                            <button onclick='removeUser(${userIndex})' class='text-red-600 hover:underline'>Remove</button>
                        </td>
                    </tr>`;
        userTable.innerHTML += row;
    }
}
function openUserModal(userEditIndex = null) {
    document.getElementById("userModal").classList.remove("hidden");
    document.getElementById("userName").value = (userEditIndex !== null) ? userNames[userEditIndex].name: "";
    document.getElementById("userEmail").value = (userEditIndex !== null) ? userNames[userEditIndex].email : "";
    document.getElementById("userRole").value = (userEditIndex !== null) ? userNames[userEditIndex].role: "";
    document.getElementById("userModal").setAttribute("user-edit-index", userEditIndex);
}
function closeUserModal() {
    document.getElementById("userModal").classList.add("hidden");
}
// Function to edit a a user
function editUser(userIndex) {
    openUserModal(userIndex);
}
function saveUser() {
    const name = document.getElementById("userName").value;
    const email = document.getElementById("userEmail").value;
    const role = document.getElementById("userRole").value;
    const userEditIndex = document.getElementById("userModal").getAttribute("user-edit-index");
    
    if (name && email && role) {
        if (userEditIndex !== "null") {
            userNames[userEditIndex] = { name, email, role };
        } else {            
            userNames.push({ name, email, role });
        }
    }
    closeUserModal();
    renderUsers();
}
function UserConfirmAction() {
    if (deleteUserIndex !== null) {
        userNames.splice(deleteUserIndex, 1);
        deleteUserIndex = null; // Reset after delete
        renderUsers();
    }
    closeConfirmation();
}

// Function to remove a team member
function removeUser(userIndex) {
    deleteUserIndex = userIndex;
    document.getElementById("confirmationDialog").classList.remove("hidden");
}

//***************! Admin: User Management Page !***************//
//! Simulated logged-in user info (replace later with real data)
const currentUser = {
    name: "Rasha Alsaleh",
    email: "rasha@demo.com",
    role: "admin" // Can be "admin", "member", "viewer"
};


function filterUsers() {
    const input = document.getElementById("userSearchInput").value.toLowerCase();
    const rows = document.getElementById("userTableBody").querySelectorAll("tr");

    for (const row of rows) {
        const name = row.children[0].innerText.toLowerCase();
        const email = row.children[1].innerText.toLowerCase();

        if (name.includes(input) || email.includes(input)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    }
}

//****************! Admin: System Settings Page !***************//
function saveSystemSettings() {
    const appName = document.getElementById('appNameInput').value;
    const notifyTasks = document.getElementById('notifyTaskAssignments').checked;
    const notifyProjects = document.getElementById('notifyProjectUpdates').checked;
    const useDark = document.getElementById('systemDarkTheme').checked;

    console.log({
        appName,
        notifyTasks,
        notifyProjects,
        useDark
    });

    showNotification("System settings saved!", "success");

    if (useDark) {
        darkBtn.textContent = 'light_mode';
        document.getElementById('body').classList.add('dark-mode');
        localStorage.setItem('devtasks-theme', 'dark');
    } else {
        darkBtn.textContent = 'dark_mode';
        document.getElementById('body').classList.remove('dark-mode');
        localStorage.setItem('devtasks-theme', 'light');
    }

    // Update app name in all elements with class "appName"
if (appName.trim() !== "") {
    const appNameElements = document.querySelectorAll('.appName');
    for (const el of appNameElements) {
        el.textContent = appName;
    }
    document.title = `${appName} | Dashboard`;
    localStorage.setItem('devtasks-appname', appName);
  }
  
}

//****************! Admin: Team Management Page !***************//

//***************! Charts !***************//

//! Global variable to store the current chart type
let currentChartType = 'bar';

//! Create the default chart on page load
window.addEventListener('DOMContentLoaded', () => {
    // ... other initialization code ...
    createDashboardChart('bar');
});

// Global variable to store the chart instance
let dashboardChart;

//! create the dashboard chart
function createDashboardChart(chartType) {
    const ctx = document.getElementById('dashboardTaskChart').getContext('2d');
    const isDarkMode = document.body.classList.contains('dark-mode');

    // ❗ Safety: destroy existing chart before creating new one
    if (dashboardChart) {
        dashboardChart.destroy();
        dashboardChart = null;
    }

    dashboardChart = new Chart(ctx, {
        type: chartType,
        data: {
            labels: ['To Do', 'In Progress', 'Done'],
            datasets: [{
                label: 'Tasks by Status',
                data: [8, 12, 20],
                backgroundColor: ["#16BDCA", "#FDBA8C", "#E74694"],
                borderColor: chartType === 'line' ? (isDarkMode ? '#9ca3af' : '#6b7280') : 'transparent',
                borderWidth: 1,
                hoverOffset: 10,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: isDarkMode ? 'white' : 'black'
                    }
                },
                tooltip: { enabled: true }
            },
            scales: {
                x: {
                    ticks: {
                        color: isDarkMode ? 'white' : 'black'
                    }
                },
                y: {
                    ticks: {
                        color: isDarkMode ? 'white' : 'black'
                    }
                }
            }
        }
    });

}
//! Function to update the chart type when the user selects a new option
function updateChartType(newType) {
    currentChartType = newType;
    if (dashboardChart) {
        dashboardChart.destroy();
    }
    createDashboardChart(newType);
}

//***************! Report Page !***************//
function loadReportsCharts() {
    const statusCtx = document.getElementById('reportsStatusChart').getContext('2d');
    const isDarkMode = document.body.classList.contains('dark-mode');
    if (window.reportChart1) {
        reportChart1.destroy();
    }
    if (window.reportChart2) {
        reportChart2.destroy();
    }
    reportChart1 = new Chart(statusCtx, {
        type: 'pie',
        data: {
            labels: ['To Do', 'In Progress', 'Done'],
            datasets: [{
                data: [40, 35, 57],
                backgroundColor: ["#16BDCA", "#FDBA8C", "#E74694"],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: isDarkMode ? 'white' : 'black'
                    }
                },
                tooltip: { enabled: true }
            },
            scales: {
                x: {
                    ticks: {
                        color: isDarkMode ? 'white' : 'black'
                    }
                },
                y: {
                    ticks: {
                        color: isDarkMode ? 'white' : 'black'
                    }
                }
            }
        }
    });

    const projectCtx = document.getElementById('reportsProjectChart').getContext('2d');
    reportChart2 = new Chart(projectCtx, {
        type: 'bar',
        data: {
            labels: ['Project Alpha', 'Project Beta', 'Project Gamma'],
            datasets: [{
                label: 'Tasks',
                data: [45, 30, 50],
                backgroundColor: ["#16BDCA", "#FDBA8C", "#E74694"],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: isDarkMode ? 'white' : 'black'
                    }
                },
                tooltip: { enabled: true }
            },
            elements: {
                bar: {
                    barThickness: 10,          // Width in pixels
                    maxBarThickness: 20,       // Maximum width
                    borderRadius: 6,            // Rounded bars
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: isDarkMode ? 'white' : 'black'
                    }
                },
                y: {
                    ticks: {
                        color: isDarkMode ? 'white' : 'black'
                    }
                }
            }

        }
    });
}
function refreshReportsCharts() {
    if (window.reportChart1) {
        reportChart1.destroy();
    }
    if (window.reportChart2) {
        reportChart2.destroy();
    }

    // Destroy dashboardChart before recreating it
    if (window.dashboardChart) {
        dashboardChart.destroy();
    }

    loadReportsCharts();
    createDashboardChart(currentChartType);
}

//! Load reports charts when reports page is opened
function openReportsPage() {
    showSection('reportsPage');
    setTimeout(() => loadReportsCharts(), 100); // slight delay for rendering
}


//***************! Settings Page !***************//
function saveProfileSettings() {
    const name = document.getElementById('settingsName').value;
    const email = document.getElementById('settingsEmail').value;
    const notifications = document.getElementById('prefNotifications').checked;
    //const darkMode = document.getElementById('prefDarkMode').checked;

    console.log("Settings saved:", { name, email, notifications/*, darkMode */ });

    // Show success message
    showNotification("Profile settings saved successfully!", "success");

    // Redirect back to profile after a second
    setTimeout(() => {
        showSection('profilePage');
    }, 1000);
}

//***************! Projects Page !***************//
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

//***************! Tasks Page !***************//
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

//***************! Team Page !***************//
// Sample team members array
const teamMembers = [
    { name: "John Doe", role: "Developer", status: "Active" },
    { name: "Jane Smith", role: "Designer", status: "Inactive" }
];

// Function to display team members
function renderTeamMembers() {
    const teamTable = document.getElementById("teamTableBody");
    teamTable.innerHTML = "";
    
    for (const [teamIndex, member] of teamMembers.entries()) {
        const row = `<tr class='member-row border-t'>
                        <td class='px-4 py-2'>${member.name}</td>
                        <td class='px-4 py-2'>${member.role}</td>
                        <td class='px-4 py-2 space-x-2'>
                            <button onclick='editTeamMember(${teamIndex})' class='text-blue-600 hover:underline'>Edit</button>
                            <button onclick='removeTeamMember(${teamIndex})' class='text-red-600 hover:underline'>Remove</button>
                        </td>
                    </tr>`;
        teamTable.innerHTML += row;
    }
}

// Function to open the modal
function openTeamModal(teamEditIndex = null) {
    document.getElementById("teamModal").classList.remove("hidden");
    document.getElementById("teamModalTitle").textContent = teamEditIndex !== null ? "Edit Team Member" : "Add Team Member";
    document.getElementById("teamMemberName").value = teamEditIndex !== null ? teamMembers[teamEditIndex].name : "";
    document.getElementById("teamMemberRole").value = teamEditIndex !== null ? teamMembers[teamEditIndex].role : "";
    document.getElementById("teamModal").setAttribute("data-edit-index", teamEditIndex);
}

// Function to close the modal
function closeTeamModal() {
    document.getElementById("teamModal").classList.add("hidden");
}

//! Function to save team member
function saveTeamMember() {
    const name = document.getElementById("teamMemberName").value;
    const role = document.getElementById("teamMemberRole").value;
    const teamEditIndex = document.getElementById("teamModal").getAttribute("data-edit-index");
    
    if (name && role) {
        if (teamEditIndex !== "null") {
            teamMembers[teamEditIndex] = { name, role};
        } else {
            teamMembers.push({ name, role });
        }
    }
    
    closeTeamModal();
    renderTeamMembers();
}

// Function to edit a team member
function editTeamMember(teamIndex) {
    openTeamModal(teamIndex);
}

function TeamConfirmAction() {
    if (deleteTeamIndex !== null) {
        teamMembers.splice(deleteTeamIndex, 1);
        deleteTeamIndex = null; // Reset after delete
        renderTeamMembers();
    }
    closeConfirmation();
}

// Function to remove a team member
function removeTeamMember(teamIndex) {
    deleteTeamIndex = teamIndex;
    document.getElementById("confirmationDialog").classList.remove("hidden");
}

// Function to filter team members
function filterTeamMembers() {
    const input = document.getElementById("teamSearchInput").value.toLowerCase();
    const rows = document.querySelectorAll("#teamTableBody tr");
    for (const row of rows) {
        const name = row.children[0].textContent.toLowerCase();
        row.style.display = name.includes(input) ? "" : "none";
    }
}

// Render the team members on page load
document.addEventListener("DOMContentLoaded", renderTeamMembers);
document.addEventListener("DOMContentLoaded", registerUser());
