// Dropdown functionality
function toggleDropdown() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('show');
}

// Close dropdown when clicking outside
document.addEventListener('click', function (event) {
    const userMenu = document.querySelector('.user-menu');
    const dropdown = document.getElementById('userDropdown');

    if (!userMenu.contains(event.target)) {
        dropdown.classList.remove('show');
    }
});

// Page navigation
/*
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Remove active class from all tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Show selected page
    document.getElementById(pageId).classList.add('active');

    // Add active class to clicked tab
    event.target.classList.add('active');
}
    */
function showPage(pageId, event) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    // Remove active class from both sidebar links and nav-tabs
    document.querySelectorAll('.sidebar-link, .nav-tab').forEach(link => {
        link.classList.remove('active');
    });

    // Add active to clicked one
    if (event) {
        event.currentTarget.classList.add('active');
    }
}



// User menu actions
function showProfile() {
    alert('Profile page - Coming soon!');
    toggleDropdown();
}

function showSettings() {
    alert('Settings page - Coming soon!');
    toggleDropdown();
}

function showOrders(event) {
    showPage('current-orders', event);
    toggleDropdown();
}


function showReports() {
    showPage('analytics');
    document.querySelector('[onclick="showPage(\'analytics\')"]').classList.add('active');
    toggleDropdown();
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Add logout logic here
        alert('Logged out successfully!');
        // Redirect to login page
        // window.location.href = '/login.html';
    }
    toggleDropdown();
}

function showMembership(event){
    showPage('membership', event);
    toggleDropdown();
}


